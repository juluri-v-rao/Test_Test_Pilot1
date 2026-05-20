export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function statusTone(progress = 0, status = '') {
  if (status === 'Completed' || progress >= 90) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200';
  if (status === 'At Risk' || progress < 40) return 'bg-orange-100 text-orange-700 dark:bg-orange-400/15 dark:text-orange-200';
  return 'bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-200';
}

export function progressLabel(progress = 0) {
  if (progress >= 90) return 'Completed';
  if (progress >= 60) return 'On Track';
  if (progress >= 35) return 'Watch';
  return 'At Risk';
}

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Number(value || 0)));
}
