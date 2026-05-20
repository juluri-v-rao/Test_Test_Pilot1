import { CalendarClock, Edit3, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import ConfirmButton from '../components/ConfirmButton.jsx';
import Modal from '../components/Modal.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { useTrainingData } from '../hooks/useTrainingData.jsx';
import { deleteModule, saveModule } from '../services/api.js';

const emptyModule = { title: '', category: '', description: '', deadline: '', weightage: 20, completion: 0, assignedEmployees: [] };

export default function Modules() {
  const { data, loading, refresh } = useTrainingData();
  const { isAdmin } = useAdmin();
  const { notify } = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [editing, setEditing] = useState(null);

  const categories = ['All', ...new Set((data?.modules || []).map((module) => module.category))];
  const rows = useMemo(() => (data?.modules || [])
    .filter((module) => [module.title, module.category, module.description].join(' ').toLowerCase().includes(query.toLowerCase()))
    .filter((module) => category === 'All' || module.category === category), [data, query, category]);

  if (loading) return <Skeleton lines={6} />;

  async function handleSave(module, assignedEmployees) {
    await saveModule(module, assignedEmployees);
    setEditing(null);
    await refresh();
    notify('Module saved');
  }

  async function handleDelete(id) {
    await deleteModule(id);
    await refresh();
    notify('Module deleted');
  }

  return (
    <div className="space-y-5">
      <section className="surface p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black">Training Modules</h2>
            <p className="text-sm font-semibold text-slate-500">Create modules, set deadlines, weightage, and assign employees.</p>
          </div>
          {isAdmin && <button className="primary-button" onClick={() => setEditing(emptyModule)}><Plus className="h-4 w-4" />Create Module</button>}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="field pl-9" placeholder="Search modules" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {rows.map((module) => (
          <article key={module.id} className="surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100">{module.category}</span>
                <h3 className="mt-3 text-xl font-black">{module.title}</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">{module.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black">{module.completion}%</p>
                <p className="text-xs font-bold text-slate-500">Complete</p>
              </div>
            </div>
            <div className="mt-4"><ProgressBar value={module.completion} tone="bg-teal-500" /></div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/10"><p className="font-black">{module.weightage}%</p><p className="text-xs font-semibold text-slate-500">Weightage</p></div>
              <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/10"><p className="font-black">{module.assignedEmployees.length}</p><p className="text-xs font-semibold text-slate-500">Assigned</p></div>
              <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/10"><p className="truncate font-black">{module.deadline}</p><p className="text-xs font-semibold text-slate-500">Deadline</p></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {data.employees.filter((employee) => module.assignedEmployees.includes(employee.id)).slice(0, 5).map((employee) => (
                <img key={employee.id} src={employee.image} alt={employee.name} title={employee.name} className="h-9 w-9 rounded-lg object-cover ring-2 ring-white dark:ring-slate-950" />
              ))}
            </div>
            {isAdmin && (
              <div className="mt-4 flex gap-2">
                <button className="secondary-button flex-1" onClick={() => setEditing(module)}><Edit3 className="h-4 w-4" />Edit</button>
                <ConfirmButton onConfirm={() => handleDelete(module.id)} />
              </div>
            )}
          </article>
        ))}
      </section>

      <Modal open={Boolean(editing)} title={editing?.id ? 'Edit module' : 'Create module'} onClose={() => setEditing(null)}>
        {editing && <ModuleForm module={editing} employees={data.employees} onSubmit={handleSave} />}
      </Modal>
    </div>
  );
}

function ModuleForm({ module, employees, onSubmit }) {
  const [form, setForm] = useState(module);
  const [assigned, setAssigned] = useState(module.assignedEmployees || []);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <form className="grid gap-3 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(form, assigned); }}>
      <input className="field" required placeholder="Module name" value={form.title} onChange={(event) => set('title', event.target.value)} />
      <input className="field" required placeholder="Category" value={form.category} onChange={(event) => set('category', event.target.value)} />
      <textarea className="field md:col-span-2" rows="3" placeholder="Description" value={form.description || ''} onChange={(event) => set('description', event.target.value)} />
      <label className="field flex items-center gap-2"><CalendarClock className="h-4 w-4" /><input className="w-full bg-transparent outline-none" type="date" value={form.deadline || ''} onChange={(event) => set('deadline', event.target.value)} /></label>
      <input className="field" type="number" min="0" max="100" placeholder="Weightage" value={form.weightage} onChange={(event) => set('weightage', event.target.value)} />
      <input className="field" type="number" min="0" max="100" placeholder="Completion %" value={form.completion} onChange={(event) => set('completion', event.target.value)} />
      <div className="md:col-span-2">
        <p className="mb-2 text-sm font-black">Assign employees</p>
        <div className="grid max-h-48 gap-2 overflow-auto rounded-lg border border-slate-200 p-3 dark:border-white/10">
          {employees.map((employee) => (
            <label key={employee.id} className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={assigned.includes(employee.id)} onChange={(event) => setAssigned((current) => event.target.checked ? [...current, employee.id] : current.filter((id) => id !== employee.id))} />
              {employee.name}
            </label>
          ))}
        </div>
      </div>
      <button className="primary-button md:col-span-2" type="submit">Save module</button>
    </form>
  );
}
