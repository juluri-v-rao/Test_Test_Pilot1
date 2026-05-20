import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import Skeleton from '../components/Skeleton.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { useTrainingData } from '../hooks/useTrainingData.jsx';

export default function Reports() {
  const { data, loading } = useTrainingData();
  const { notify } = useToast();
  if (loading) return <Skeleton lines={4} />;

  function employeeRows() {
    return data.employees.map((employee) => ({
      Name: employee.name,
      Role: employee.role,
      Status: employee.status,
      Progress: `${employee.progress}%`,
      'Skill Score': `${employee.skill_score}%`,
      'Join Date': employee.join_date,
      Remarks: employee.remarks
    }));
  }

  function exportExcel() {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(employeeRows()), 'Employees');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.modules), 'Modules');
    XLSX.writeFile(wb, `training-review-${new Date().toISOString().slice(0, 10)}.xlsx`);
    notify('Excel report exported');
  }

  function exportPdf() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Training Management Monthly Review', 14, 18);
    doc.setFontSize(10);
    doc.text(`Readiness ${data.kpis.readiness}% | Completion ${data.kpis.teamCompletion}% | Employees ${data.kpis.employees}`, 14, 26);
    autoTable(doc, {
      startY: 34,
      head: [['Name', 'Role', 'Status', 'Progress', 'Skill']],
      body: data.employees.map((employee) => [employee.name, employee.role, employee.status, `${employee.progress}%`, `${employee.skill_score}%`])
    });
    doc.save(`training-review-${new Date().toISOString().slice(0, 10)}.pdf`);
    notify('PDF report exported');
  }

  return (
    <div className="space-y-6">
      <section className="surface p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black">Reports</h2>
            <p className="text-sm font-semibold text-slate-500">Export employee reports and monthly review packs.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="primary-button" onClick={exportPdf}><FileText className="h-4 w-4" />Export PDF</button>
            <button className="secondary-button" onClick={exportExcel}><FileSpreadsheet className="h-4 w-4" />Export Excel</button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Readiness', `${data.kpis.readiness}%`],
          ['Completion', `${data.kpis.teamCompletion}%`],
          ['Skill Growth', `${data.kpis.skillGrowth}%`],
          ['At Risk', data.kpis.atRisk]
        ].map(([label, value]) => (
          <div key={label} className="surface p-5">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </section>

      <section className="surface overflow-hidden">
        <div className="border-b border-slate-200 p-5 dark:border-white/10">
          <h3 className="text-lg font-black">Employee Report Preview</h3>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-[0.14em] text-slate-500 dark:bg-white/10">
              <tr>{['Name', 'Role', 'Status', 'Progress', 'Skill Score', 'Join Date'].map((head) => <th key={head} className="px-4 py-3 font-black">{head}</th>)}</tr>
            </thead>
            <tbody>
              {data.employees.map((employee) => (
                <tr key={employee.id} className="border-t border-slate-100 dark:border-white/10">
                  <td className="px-4 py-3 font-black">{employee.name}</td>
                  <td className="px-4 py-3 font-semibold text-slate-500">{employee.role}</td>
                  <td className="px-4 py-3">{employee.status}</td>
                  <td className="px-4 py-3">{employee.progress}%</td>
                  <td className="px-4 py-3">{employee.skill_score}%</td>
                  <td className="px-4 py-3">{employee.join_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="surface p-5">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5 text-blue-600" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Exports are generated in-browser, so they work on Vercel without a server process.</p>
        </div>
      </div>
    </div>
  );
}
