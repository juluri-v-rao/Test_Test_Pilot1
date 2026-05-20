import { initials } from '../utils/format.js';

export default function Avatar({ employee, size = 'h-10 w-10' }) {
  if (employee?.avatar) {
    return <img className={`${size} rounded-2xl object-cover`} src={employee.avatar} alt={employee.name} />;
  }
  return (
    <div className={`${size} grid place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-sm font-bold text-white shadow-lg shadow-blue-500/20`}>
      {initials(employee?.name)}
    </div>
  );
}
