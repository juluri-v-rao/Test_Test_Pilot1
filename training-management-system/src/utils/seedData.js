export const seedEmployees = [
  {
    id: 'emp-1',
    name: 'Aarav Mehta',
    role: 'Frontend Engineer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    progress: 82,
    skill_score: 86,
    status: 'On Track',
    join_date: '2026-01-15',
    remarks: 'Strong React delivery and active in peer reviews.'
  },
  {
    id: 'emp-2',
    name: 'Maya Iyer',
    role: 'Cloud Associate',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    progress: 68,
    skill_score: 72,
    status: 'Needs Focus',
    join_date: '2025-11-04',
    remarks: 'AWS labs need weekly reinforcement.'
  },
  {
    id: 'emp-3',
    name: 'Rohan Shah',
    role: 'QA Analyst',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    progress: 91,
    skill_score: 88,
    status: 'Certified',
    join_date: '2025-09-22',
    remarks: 'Ready for automation ownership.'
  },
  {
    id: 'emp-4',
    name: 'Nisha Rao',
    role: 'Customer Success',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    progress: 54,
    skill_score: 63,
    status: 'At Risk',
    join_date: '2026-02-01',
    remarks: 'Needs language coaching before client shadowing.'
  },
  {
    id: 'emp-5',
    name: 'Vikram Sethi',
    role: 'DevOps Engineer',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    progress: 76,
    skill_score: 79,
    status: 'On Track',
    join_date: '2025-10-11',
    remarks: 'Good momentum across AWS and security modules.'
  },
  {
    id: 'emp-6',
    name: 'Sara Khan',
    role: 'Product Analyst',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    progress: 39,
    skill_score: 52,
    status: 'At Risk',
    join_date: '2026-03-18',
    remarks: 'New hire ramp is behind the readiness baseline.'
  }
];

export const seedModules = [
  {
    id: 'mod-1',
    title: 'Japanese Client Readiness',
    category: 'Language',
    description: 'Business Japanese phrases, meeting etiquette, and written updates.',
    deadline: '2026-06-18',
    weightage: 40,
    completion: 64
  },
  {
    id: 'mod-2',
    title: 'React Advanced Patterns',
    category: 'Engineering',
    description: 'State architecture, accessibility, performance, and testing patterns.',
    deadline: '2026-06-28',
    weightage: 30,
    completion: 78
  },
  {
    id: 'mod-3',
    title: 'AWS Practitioner Labs',
    category: 'Cloud',
    description: 'Hands-on IAM, S3, Lambda, CloudWatch, and deployment workflows.',
    deadline: '2026-07-05',
    weightage: 30,
    completion: 59
  },
  {
    id: 'mod-4',
    title: 'Security & Data Privacy',
    category: 'Compliance',
    description: 'Security hygiene, privacy policy, incident response, and audit basics.',
    deadline: '2026-06-12',
    weightage: 20,
    completion: 71
  },
  {
    id: 'mod-5',
    title: 'Stakeholder Communication',
    category: 'Leadership',
    description: 'Executive updates, status reporting, escalation, and decision logs.',
    deadline: '2026-07-16',
    weightage: 25,
    completion: 67
  }
];

export const seedEmployeeModules = [
  { id: 'em-1', employee_id: 'emp-1', module_id: 'mod-1', progress: 78, completion: 78, updated_at: '2026-05-12' },
  { id: 'em-2', employee_id: 'emp-1', module_id: 'mod-2', progress: 86, completion: 86, updated_at: '2026-05-16' },
  { id: 'em-3', employee_id: 'emp-2', module_id: 'mod-1', progress: 66, completion: 66, updated_at: '2026-05-10' },
  { id: 'em-4', employee_id: 'emp-2', module_id: 'mod-3', progress: 70, completion: 70, updated_at: '2026-05-18' },
  { id: 'em-5', employee_id: 'emp-3', module_id: 'mod-2', progress: 94, completion: 94, updated_at: '2026-05-15' },
  { id: 'em-6', employee_id: 'emp-3', module_id: 'mod-4', progress: 88, completion: 88, updated_at: '2026-05-19' },
  { id: 'em-7', employee_id: 'emp-4', module_id: 'mod-1', progress: 44, completion: 44, updated_at: '2026-05-09' },
  { id: 'em-8', employee_id: 'emp-4', module_id: 'mod-5', progress: 62, completion: 62, updated_at: '2026-05-11' },
  { id: 'em-9', employee_id: 'emp-5', module_id: 'mod-3', progress: 80, completion: 80, updated_at: '2026-05-17' },
  { id: 'em-10', employee_id: 'emp-5', module_id: 'mod-4', progress: 72, completion: 72, updated_at: '2026-05-13' },
  { id: 'em-11', employee_id: 'emp-6', module_id: 'mod-1', progress: 34, completion: 34, updated_at: '2026-05-08' },
  { id: 'em-12', employee_id: 'emp-6', module_id: 'mod-3', progress: 42, completion: 42, updated_at: '2026-05-12' }
];

export const seedReviews = [
  { id: 'rev-1', employee_id: 'emp-1', feedback: 'Ready for client-facing React tasks.', reviewer: 'Training Lead', month: 'May 2026' },
  { id: 'rev-2', employee_id: 'emp-4', feedback: 'Add two language coaching sessions weekly.', reviewer: 'Delivery Manager', month: 'May 2026' }
];
