import { differenceInCalendarDays, parseISO } from 'date-fns';

export function clampPercent(value) {
  const number = Number(value) || 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

export function calculateEmployeeProgress(employee, assignments, modules) {
  const rows = assignments.filter((item) => item.employee_id === employee.id);
  if (!rows.length) return clampPercent(employee.progress);
  const totalWeight = rows.reduce((sum, row) => {
    const module = modules.find((item) => item.id === row.module_id);
    return sum + (Number(module?.weightage) || 1);
  }, 0);
  const weighted = rows.reduce((sum, row) => {
    const module = modules.find((item) => item.id === row.module_id);
    return sum + clampPercent(row.progress) * (Number(module?.weightage) || 1);
  }, 0);
  return clampPercent(weighted / Math.max(totalWeight, 1));
}

export function calculateModuleCompletion(module, assignments) {
  const rows = assignments.filter((item) => item.module_id === module.id);
  if (!rows.length) return clampPercent(module.completion);
  return clampPercent(rows.reduce((sum, row) => sum + clampPercent(row.progress), 0) / rows.length);
}

export function enrichData({ employees = [], modules = [], employee_modules = [], reviews = [] }) {
  const enrichedModules = modules.map((module) => ({
    ...module,
    completion: calculateModuleCompletion(module, employee_modules),
    assignedEmployees: employee_modules.filter((row) => row.module_id === module.id).map((row) => row.employee_id)
  }));

  const enrichedEmployees = employees.map((employee) => {
    const assigned = employee_modules.filter((row) => row.employee_id === employee.id);
    const progress = calculateEmployeeProgress(employee, employee_modules, modules);
    const status = progress >= 86 ? 'Certified' : progress >= 70 ? 'On Track' : progress >= 50 ? 'Needs Focus' : 'At Risk';
    return {
      ...employee,
      progress,
      skill_score: clampPercent(employee.skill_score || progress + 4),
      status,
      modules: assigned.map((row) => ({
        ...row,
        module: enrichedModules.find((module) => module.id === row.module_id)
      })),
      reviews: reviews.filter((review) => review.employee_id === employee.id)
    };
  });

  const averageProgress = clampPercent(enrichedEmployees.reduce((sum, employee) => sum + employee.progress, 0) / Math.max(enrichedEmployees.length, 1));
  const teamCompletion = clampPercent(enrichedModules.reduce((sum, module) => sum + module.completion, 0) / Math.max(enrichedModules.length, 1));
  const skillGrowth = clampPercent(enrichedEmployees.reduce((sum, employee) => sum + Number(employee.skill_score || 0), 0) / Math.max(enrichedEmployees.length, 1));
  const readiness = clampPercent(averageProgress * 0.45 + teamCompletion * 0.35 + skillGrowth * 0.2);
  const dueSoon = enrichedModules.filter((module) => {
    if (!module.deadline) return false;
    const days = differenceInCalendarDays(parseISO(module.deadline), new Date());
    return days >= 0 && days <= 21;
  }).length;

  const categories = Object.values(
    enrichedModules.reduce((acc, module) => {
      acc[module.category] ||= { name: module.category, value: 0, completion: 0 };
      acc[module.category].value += 1;
      acc[module.category].completion += module.completion;
      return acc;
    }, {})
  ).map((item) => ({ ...item, completion: clampPercent(item.completion / item.value) }));

  const monthly = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
    month,
    completion: clampPercent(44 + index * 7 + averageProgress * 0.07),
    readiness: clampPercent(38 + index * 8 + readiness * 0.06),
    risk: clampPercent(31 - index * 3 + (100 - averageProgress) * 0.05),
    enrollments: 14 + index * 5 + employee_modules.length
  }));

  const recent = [
    `${enrichedEmployees.filter((employee) => employee.status === 'At Risk').length} employees need intervention this week.`,
    `${enrichedModules.filter((module) => module.completion >= 75).length} modules are trending toward completion.`,
    `Readiness forecast is ${readiness >= 75 ? 'healthy' : 'watchlisted'} at ${readiness}%.`
  ];

  return {
    employees: enrichedEmployees,
    modules: enrichedModules,
    employee_modules,
    reviews,
    categories,
    monthly,
    heatmap: enrichedEmployees.map((employee) => ({
      employee: employee.name,
      values: enrichedModules.map((module) => {
        const assignment = employee.modules.find((item) => item.module_id === module.id);
        return assignment ? clampPercent(assignment.progress) : 0;
      })
    })),
    kpis: {
      employees: enrichedEmployees.length,
      modules: enrichedModules.length,
      averageProgress,
      teamCompletion,
      skillGrowth,
      readiness,
      atRisk: enrichedEmployees.filter((employee) => employee.status === 'At Risk').length,
      dueSoon
    },
    recent
  };
}

export function makeId(prefix) {
  return `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
}
