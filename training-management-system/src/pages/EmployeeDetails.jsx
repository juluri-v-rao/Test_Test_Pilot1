import { ArrowLeft, CalendarDays, Save } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { useTrainingData } from '../hooks/useTrainingData.jsx';
import { updateAssignment } from '../services/api.js';

export default function EmployeeDetails() {
  const { id } = useParams();
  const { data, loading, refresh } = useTrainingData();
  const { isAdmin } = useAdmin();
  const { notify } = useToast();

  if (loading) return <Skeleton lines={4} />;
  const employee = data.employees.find((item) => item.id === id);
  if (!employee) return <div className="surface p-6">Employee not found.</div>;

  async function saveProgress(assignment, progress) {
    await updateAssignment({ ...assignment, progress });
    await refresh();
    notify('Progress updated');
  }

  return (
    <div className="space-y-5">
      <Link to="/employees" className="secondary-button"><ArrowLeft className="h-4 w-4" />Employees</Link>
      <section className="surface overflow-hidden">
        <div className="bg-slate-950 p-6 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <img src={employee.image} alt="" className="h-24 w-24 rounded-lg border border-white/20 object-cover" />
            <div className="min-w-0 flex-1">
              <h2 className="text-3xl font-black">{employee.name}</h2>
              <p className="font-semibold text-slate-300">{employee.role}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="badge bg-white/10 text-white">{employee.status}</span>
                <span className="badge bg-white/10 text-white"><CalendarDays className="mr-1 h-3.5 w-3.5" />Joined {employee.join_date || 'N/A'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:w-72">
              <div className="rounded-lg bg-white/10 p-3"><p className="text-2xl font-black">{employee.progress}%</p><p className="text-xs font-semibold text-slate-300">Progress</p></div>
              <div className="rounded-lg bg-white/10 p-3"><p className="text-2xl font-black">{employee.skill_score}%</p><p className="text-xs font-semibold text-slate-300">Skill</p></div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-black">Assigned Modules</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {employee.modules.map((assignment) => (
              <div key={assignment.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black">{assignment.module?.title}</p>
                    <p className="text-sm font-semibold text-slate-500">{assignment.module?.category} • deadline {assignment.module?.deadline}</p>
                  </div>
                  <span className="text-sm font-black">{assignment.progress}%</span>
                </div>
                <div className="mt-3"><ProgressBar value={assignment.progress} tone="bg-blue-600" /></div>
                {isAdmin && (
                  <div className="mt-4 flex gap-2">
                    <input className="field" type="number" min="0" max="100" defaultValue={assignment.progress} id={`progress-${assignment.id}`} />
                    <button className="primary-button" onClick={() => saveProgress(assignment, document.getElementById(`progress-${assignment.id}`).value)}>
                      <Save className="h-4 w-4" />Update
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-slate-100 p-4 dark:bg-white/10">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Remarks</p>
            <p className="mt-2 font-semibold">{employee.remarks || 'No remarks available.'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
