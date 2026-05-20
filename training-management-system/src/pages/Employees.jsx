import { Edit3, Filter, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmButton from '../components/ConfirmButton.jsx';
import Modal from '../components/Modal.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { useTrainingData } from '../hooks/useTrainingData.jsx';
import { deleteEmployee, saveEmployee } from '../services/api.js';

const emptyEmployee = { name: '', role: '', image: '', progress: 0, skill_score: 0, status: 'On Track', join_date: '', remarks: '' };

export default function Employees() {
  const { data, loading, refresh } = useTrainingData();
  const { isAdmin } = useAdmin();
  const { notify } = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('progress');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const pageSize = 6;

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.employees
      .filter((employee) => [employee.name, employee.role, employee.remarks].join(' ').toLowerCase().includes(query.toLowerCase()))
      .filter((employee) => status === 'All' || employee.status === status)
      .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : b[sort] - a[sort]));
  }, [data, query, status, sort]);

  if (loading) return <Skeleton lines={6} />;

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function handleSave(employee) {
    await saveEmployee(employee);
    setEditing(null);
    await refresh();
    notify('Employee saved');
  }

  async function handleDelete(id) {
    await deleteEmployee(id);
    await refresh();
    notify('Employee deleted');
  }

  return (
    <div className="space-y-5">
      <section className="surface p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-black">Employee Management</h2>
            <p className="text-sm font-semibold text-slate-500">Search, filter, sort, and open employee training profiles.</p>
          </div>
          {isAdmin && <button className="primary-button" onClick={() => setEditing(emptyEmployee)}><Plus className="h-4 w-4" />Add Employee</button>}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="field pl-9" placeholder="Search employees" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
          </label>
          <label className="relative">
            <Filter className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <select className="field pl-9" value={status} onChange={(event) => setStatus(event.target.value)}>
              {['All', 'Certified', 'On Track', 'Needs Focus', 'At Risk'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <select className="field" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="progress">Sort by progress</option>
            <option value="skill_score">Sort by skill score</option>
            <option value="name">Sort by name</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((employee) => (
          <article key={employee.id} className="surface p-5">
            <div className="flex items-start gap-4">
              <img src={employee.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=0f172a&color=fff`} alt="" className="h-16 w-16 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <Link to={`/employees/${employee.id}`} className="truncate text-lg font-black hover:text-blue-600">{employee.name}</Link>
                <p className="truncate text-sm font-semibold text-slate-500">{employee.role}</p>
                <span className={`badge mt-2 ${employee.status === 'At Risk' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100'}`}>{employee.status}</span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/10"><p className="font-black">{employee.progress}%</p><p className="text-xs font-semibold text-slate-500">Progress</p></div>
              <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/10"><p className="font-black">{employee.skill_score}%</p><p className="text-xs font-semibold text-slate-500">Skill score</p></div>
            </div>
            <div className="mt-4"><ProgressBar value={employee.progress} tone={employee.progress < 50 ? 'bg-red-500' : 'bg-blue-600'} /></div>
            <p className="mt-4 line-clamp-2 min-h-[40px] text-sm font-medium text-slate-500">{employee.remarks || 'No remarks yet.'}</p>
            {isAdmin && (
              <div className="mt-4 flex gap-2">
                <button className="secondary-button flex-1" onClick={() => setEditing(employee)}><Edit3 className="h-4 w-4" />Edit</button>
                <ConfirmButton onConfirm={() => handleDelete(employee.id)} />
              </div>
            )}
          </article>
        ))}
      </section>

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-500">Showing {rows.length} of {filtered.length}</p>
        <div className="flex gap-2">
          <button className="secondary-button" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <button className="secondary-button" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>

      <Modal open={Boolean(editing)} title={editing?.id ? 'Edit employee' : 'Add employee'} onClose={() => setEditing(null)}>
        {editing && <EmployeeForm employee={editing} onSubmit={handleSave} />}
      </Modal>
    </div>
  );
}

function EmployeeForm({ employee, onSubmit }) {
  const [form, setForm] = useState(employee);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <form className="grid gap-3 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
      <input className="field" required placeholder="Name" value={form.name} onChange={(event) => set('name', event.target.value)} />
      <input className="field" required placeholder="Role" value={form.role} onChange={(event) => set('role', event.target.value)} />
      <input className="field md:col-span-2" placeholder="Profile image URL" value={form.image || ''} onChange={(event) => set('image', event.target.value)} />
      <input className="field" type="number" min="0" max="100" placeholder="Progress" value={form.progress} onChange={(event) => set('progress', event.target.value)} />
      <input className="field" type="number" min="0" max="100" placeholder="Skill score" value={form.skill_score} onChange={(event) => set('skill_score', event.target.value)} />
      <input className="field" type="date" value={form.join_date || ''} onChange={(event) => set('join_date', event.target.value)} />
      <select className="field" value={form.status || 'On Track'} onChange={(event) => set('status', event.target.value)}>
        {['Certified', 'On Track', 'Needs Focus', 'At Risk'].map((item) => <option key={item}>{item}</option>)}
      </select>
      <textarea className="field md:col-span-2" rows="3" placeholder="Remarks" value={form.remarks || ''} onChange={(event) => set('remarks', event.target.value)} />
      <button className="primary-button md:col-span-2" type="submit">Save employee</button>
    </form>
  );
}
