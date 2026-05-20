import { createClient } from '@supabase/supabase-js';
import { seedEmployeeModules, seedEmployees, seedModules, seedReviews } from '../utils/seedData.js';
import { enrichData, makeId } from '../utils/analytics.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = hasSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

const storageKey = 'training-dashboard-local-store';

function readLocal() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);
  const initial = {
    employees: seedEmployees,
    modules: seedModules,
    employee_modules: seedEmployeeModules,
    reviews: seedReviews
  };
  localStorage.setItem(storageKey, JSON.stringify(initial));
  return initial;
}

function writeLocal(next) {
  localStorage.setItem(storageKey, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('training-local-change'));
  return next;
}

async function fetchTable(name) {
  const { data, error } = await supabase.from(name).select('*');
  if (error) throw error;
  return data || [];
}

export async function getTrainingData() {
  if (!hasSupabase) return enrichData(readLocal());
  try {
    const [employees, modules, employeeModules, reviews] = await Promise.all([
      fetchTable('employees'),
      fetchTable('modules'),
      fetchTable('employee_modules'),
      fetchTable('reviews')
    ]);
    return enrichData({ employees, modules, employee_modules: employeeModules, reviews });
  } catch (error) {
    console.warn('Supabase data unavailable; using local preview data.', error);
    return enrichData(readLocal());
  }
}

export function subscribeTrainingData(callback) {
  if (!hasSupabase) {
    const handler = () => callback();
    window.addEventListener('training-local-change', handler);
    return () => window.removeEventListener('training-local-change', handler);
  }

  const channel = supabase
    .channel('training-dashboard-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'modules' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'employee_modules' }, callback)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, callback)
    .subscribe();

  return () => supabase.removeChannel(channel);
}

export async function saveEmployee(employee) {
  const payload = {
    ...employee,
    progress: Number(employee.progress || 0),
    skill_score: Number(employee.skill_score || 0)
  };
  if (hasSupabase) {
    const { data, error } = await supabase.from('employees').upsert(payload).select().single();
    if (error) throw error;
    return data;
  }
  const store = readLocal();
  const row = { ...payload, id: payload.id || makeId('emp') };
  const rows = store.employees.some((item) => item.id === row.id)
    ? store.employees.map((item) => (item.id === row.id ? row : item))
    : [row, ...store.employees];
  writeLocal({ ...store, employees: rows });
  return row;
}

export async function deleteEmployee(id) {
  if (hasSupabase) {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
  const store = readLocal();
  writeLocal({
    ...store,
    employees: store.employees.filter((item) => item.id !== id),
    employee_modules: store.employee_modules.filter((item) => item.employee_id !== id),
    reviews: store.reviews.filter((item) => item.employee_id !== id)
  });
  return true;
}

export async function saveModule(module, assignedEmployees = []) {
  const payload = {
    ...module,
    weightage: Number(module.weightage || 0),
    completion: Number(module.completion || 0)
  };
  if (hasSupabase) {
    const { data, error } = await supabase.from('modules').upsert(payload).select().single();
    if (error) throw error;
    await replaceModuleAssignments(data.id, assignedEmployees);
    return data;
  }
  const store = readLocal();
  const row = { ...payload, id: payload.id || makeId('mod') };
  const modules = store.modules.some((item) => item.id === row.id)
    ? store.modules.map((item) => (item.id === row.id ? row : item))
    : [row, ...store.modules];
  const without = store.employee_modules.filter((item) => item.module_id !== row.id);
  const added = assignedEmployees.map((employeeId) => ({
    id: makeId('em'),
    employee_id: employeeId,
    module_id: row.id,
    progress: row.completion,
    completion: row.completion,
    updated_at: new Date().toISOString()
  }));
  writeLocal({ ...store, modules, employee_modules: [...without, ...added] });
  return row;
}

export async function replaceModuleAssignments(moduleId, employeeIds) {
  if (!hasSupabase) return true;
  const { error: deleteError } = await supabase.from('employee_modules').delete().eq('module_id', moduleId);
  if (deleteError) throw deleteError;
  if (!employeeIds.length) return true;
  const rows = employeeIds.map((employeeId) => ({
    employee_id: employeeId,
    module_id: moduleId,
    progress: 0,
    completion: 0,
    updated_at: new Date().toISOString()
  }));
  const { error } = await supabase.from('employee_modules').insert(rows);
  if (error) throw error;
  return true;
}

export async function deleteModule(id) {
  if (hasSupabase) {
    const { error } = await supabase.from('modules').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
  const store = readLocal();
  writeLocal({
    ...store,
    modules: store.modules.filter((item) => item.id !== id),
    employee_modules: store.employee_modules.filter((item) => item.module_id !== id)
  });
  return true;
}

export async function updateAssignment(row) {
  const payload = {
    ...row,
    progress: Number(row.progress || 0),
    completion: Number(row.progress || row.completion || 0),
    updated_at: new Date().toISOString()
  };
  if (hasSupabase) {
    const { data, error } = await supabase.from('employee_modules').upsert(payload).select().single();
    if (error) throw error;
    return data;
  }
  const store = readLocal();
  const rows = store.employee_modules.map((item) => (item.id === payload.id ? payload : item));
  writeLocal({ ...store, employee_modules: rows });
  return payload;
}

export function validateAdminPassword(password) {
  return password && password === (import.meta.env.VITE_ADMIN_PASSWORD || 'admin123');
}
