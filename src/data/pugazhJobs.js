


export const ONBOARDING_STATS = {
  inProgress: { count: 107, label: 'Under review' },
  hired: { count: 2, label: 'Onboarded' },
  projectCompleted: { count: 2, label: 'Project cycle closed' },
  archive: { count: 2, label: 'No longer active' },
};

// ============================================================
// DASHBOARD - JOB STATS
// ============================================================
export const JOB_STATS = {
  totalJobs: 16988,
  activeJobs: 1685,
  myJobs: 600,
  myJobsCount: 6,
  allJobsCount: 2456,
};

// ============================================================
// DASHBOARD - CLIENT SUBMISSION STATS
// ============================================================
export const CLIENT_SUBMISSION_STATS = {
  totalClientSubmission: 1324,
  submitted: { count: 534, color: '#f97316' },
  inReview: { count: 410, color: '#3b82f6' },
  rejected: { count: 87, color: '#ef4444' },
  shortlisted: { count: 293, color: '#22c55e' },
};

// ============================================================
// DASHBOARD - CALENDAR EVENTS (April 2026)
// ============================================================
export const CALENDAR_EVENTS = [
  // Onboarded dates (green)
  { date: '2026-04-06', type: 'onboarded', label: 'Sarah Mitchell onboarded' },
  { date: '2026-04-15', type: 'onboarded', label: 'Ravi Kumar onboarded' },
  { date: '2026-04-27', type: 'onboarded', label: 'Priya Sharma onboarded' },

  // Exit dates (red)
  { date: '2026-04-04', type: 'exit', label: 'James Wilson exit' },
  { date: '2026-04-18', type: 'exit', label: 'Anita Rao exit' },
  { date: '2026-04-30', type: 'exit', label: 'Tom Harrison exit' },

  // To-do mentioned (orange)
  { date: '2026-04-02', type: 'todo', label: 'Follow up with Deloitte panel' },
  { date: '2026-04-08', type: 'todo', label: 'Resume review - Kiran Erravalla' },
  { date: '2026-04-21', type: 'todo', label: 'Client call - TCS' },
  { date: '2026-04-29', type: 'todo', label: 'Submit pipeline report' },

  // Interview scheduled (blue)
  { date: '2026-04-03', type: 'interview', label: 'Interview - Full Stack Dev @ TCS' },
  { date: '2026-04-08', type: 'interview', label: 'Interview - Java Dev @ Infosys' },
  { date: '2026-04-10', type: 'interview', label: 'Interview - React Dev @ Wipro' },
  { date: '2026-04-17', type: 'interview', label: 'Interview - Python Dev @ HCL' },
  { date: '2026-04-21', type: 'interview', label: 'Interview - DevOps @ Capgemini' },
  { date: '2026-04-24', type: 'interview', label: 'Interview - Data Engineer @ Cognizant' },
];

export const CALENDAR_LEGEND = [
  { type: 'onboarded', color: '#22c55e', label: 'Onboarded date' },
  { type: 'exit', color: '#ef4444', label: 'Exit date' },
  { type: 'todo', color: '#f97316', label: 'To-do mentioned' },
  { type: 'interview', color: '#3b82f6', label: 'Interview scheduled' },
];

// ============================================================
// DASHBOARD - STICKY NOTES
// ============================================================
export const STICKY_NOTES = [
  {
    id: 1,
    type: 'Tagged',
    title: 'Resume mismatch on Kiran Erravalla',
    body: 'Manager mentioned the submitted resume has an outdated client project. Review and resend before EOD.',
    taggedBy: 'Anusha',
    timestamp: '10:15 AM',
    timeAgo: 'Yesterday',
    color: '#ede9fe', // light purple
  },
  {
    id: 2,
    type: 'Note',
    title: 'Follow up with Deloitte panel',
    body: 'Submitted resume has an outdated client project. Review and resend.',
    createdBy: 'you',
    timestamp: null,
    timeAgo: 'Yesterday',
    color: '#fff7ed', // light orange
    dotColor: '#f97316',
    date: '04 April, 2026',
  },
  {
    id: 3,
    type: 'Note',
    title: 'Follow up with Deloitte panel',
    body: 'Manager mentioned the submitted resume has an outdated client project. Review and resend before EOD.',
    createdBy: 'you',
    timestamp: null,
    timeAgo: 'Yesterday',
    color: '#f0fdf4', // light green
  },
  {
    id: 4,
    type: 'Tagged',
    title: 'Resume mismatch on Kiran Erravalla',
    body: 'Manager mentioned the submitted resume has an outdated client project. Review and resend before EOD.',
    taggedBy: 'Anusha',
    timestamp: '10:15 AM',
    timeAgo: 'Yesterday',
    color: '#ede9fe', // light purple
  },
  {
    id: 5,
    type: 'Note',
    title: 'Background check pending - Alex Turner',
    body: 'HR flagged that background verification is still pending for Alex Turner. Follow up with the vendor.',
    createdBy: 'you',
    timestamp: null,
    timeAgo: '2 days ago',
    color: '#eff6ff', // light blue
  },
  {
    id: 6,
    type: 'Tagged',
    title: 'Offer letter approval needed',
    body: 'Offer letter for Meena Subramanian is awaiting final approval from the hiring manager. Escalate if no response by EOD.',
    taggedBy: 'Priya',
    timestamp: '09:30 AM',
    timeAgo: '3 days ago',
    color: '#fef9c3', // light yellow
  },
];

// ============================================================
// JOBS TABLE (extended from your existing mock)
// ============================================================
export const PUGAZH_MOCK_JOBS = [
  {
    key: '1',
    id: 1,
    title: 'Full Stack Developer (3 Years Experience)',
    location: 'North Davidfurt',
    locationType: 'On-site',
    experience: '',
    employmentType: 'Full-time',
    clientRate: 78,
    targetSub: { filled: 1, total: 5 },
    pipeline: 0,
    assignees: [
      { initials: 'DC', color: '#6366f1' },
      { initials: 'K', color: '#8b5cf6' },
    ],
    extraAssignees: 2,
    status: 'Fulfilled',
    createdAt: 'Apr 20, 2026',
    createdAgo: '2 months ago',
    client: 'TCS - 867544',
    hasBookmark: true,
    hasLinkedIn: false,
  },
  {
    key: '2',
    id: 2,
    title: 'Java Developer (Python Experience)',
    location: 'Texas',
    locationType: 'On-site',
    experience: '6 years',
    employmentType: 'Contract',
    clientRate: 105,
    targetSub: { filled: 1, total: 10 },
    pipeline: 0,
    assignees: [
      { initials: 'J', color: '#3b82f6' },
      { initials: 'A', color: '#10b981' },
    ],
    extraAssignees: 2,
    status: 'Open',
    createdAt: 'May 20, 2026',
    createdAgo: 'Today',
    client: 'TCS - 867544',
    hasBookmark: true,
    hasLinkedIn: true,
  },
  {
    key: '3',
    id: 3,
    title: 'Java Developer (Python Experience)',
    location: 'Chennai',
    locationType: 'Hybrid',
    experience: '7 years',
    employmentType: 'Full-time',
    clientRate: 105,
    targetSub: { filled: 3, total: 5 },
    pipeline: 2,
    assignees: [{ initials: 'K', color: '#8b5cf6' }],
    extraAssignees: 0,
    status: 'Partially Fulfilled',
    createdAt: 'May 12, 2026',
    createdAgo: '8 days ago',
    client: 'TCS - 867544',
    hasBookmark: true,
    hasLinkedIn: false,
  },
  {
    key: '4',
    id: 4,
    title: 'React Developer (TypeScript)',
    location: 'Bangalore',
    locationType: 'Remote',
    experience: '4 years',
    employmentType: 'Full-time',
    clientRate: 92,
    targetSub: { filled: 2, total: 4 },
    pipeline: 3,
    assignees: [
      { initials: 'R', color: '#f59e0b' },
      { initials: 'S', color: '#10b981' },
    ],
    extraAssignees: 1,
    status: 'Open',
    createdAt: 'May 15, 2026',
    createdAgo: '5 days ago',
    client: 'Infosys - 334210',
    hasBookmark: false,
    hasLinkedIn: true,
  },
  {
    key: '5',
    id: 5,
    title: 'DevOps Engineer (AWS + Kubernetes)',
    location: 'Hyderabad',
    locationType: 'Hybrid',
    experience: '5 years',
    employmentType: 'Contract',
    clientRate: 120,
    targetSub: { filled: 0, total: 3 },
    pipeline: 1,
    assignees: [{ initials: 'M', color: '#ef4444' }],
    extraAssignees: 0,
    status: 'Open',
    createdAt: 'May 18, 2026',
    createdAgo: '2 days ago',
    client: 'Wipro - 556789',
    hasBookmark: true,
    hasLinkedIn: false,
  },
  {
    key: '6',
    id: 6,
    title: 'Data Engineer (Spark + Databricks)',
    location: 'Pune',
    locationType: 'On-site',
    experience: '6 years',
    employmentType: 'Full-time',
    clientRate: 115,
    targetSub: { filled: 4, total: 6 },
    pipeline: 1,
    assignees: [
      { initials: 'P', color: '#6366f1' },
      { initials: 'N', color: '#14b8a6' },
    ],
    extraAssignees: 0,
    status: 'Partially Fulfilled',
    createdAt: 'Apr 30, 2026',
    createdAgo: '20 days ago',
    client: 'Cognizant - 778821',
    hasBookmark: false,
    hasLinkedIn: true,
  },
  {
    key: '7',
    id: 7,
    title: 'UI/UX Designer (Figma + Research)',
    location: 'Mumbai',
    locationType: 'Remote',
    experience: '3 years',
    employmentType: 'Full-time',
    clientRate: 65,
    targetSub: { filled: 2, total: 2 },
    pipeline: 0,
    assignees: [{ initials: 'A', color: '#f43f5e' }],
    extraAssignees: 1,
    status: 'Fulfilled',
    createdAt: 'Apr 10, 2026',
    createdAgo: '40 days ago',
    client: 'HCL - 993401',
    hasBookmark: true,
    hasLinkedIn: false,
  },
  {
    key: '8',
    id: 8,
    title: 'QA Automation Engineer (Selenium)',
    location: 'Noida',
    locationType: 'On-site',
    experience: '4 years',
    employmentType: 'Contract',
    clientRate: 80,
    targetSub: { filled: 1, total: 5 },
    pipeline: 4,
    assignees: [
      { initials: 'T', color: '#0ea5e9' },
      { initials: 'V', color: '#a855f7' },
    ],
    extraAssignees: 0,
    status: 'Open',
    createdAt: 'May 19, 2026',
    createdAgo: 'Yesterday',
    client: 'Capgemini - 112345',
    hasBookmark: false,
    hasLinkedIn: true,
  },
  {
    key: '9',
    id: 9,
    title: 'Business Analyst (Agile + JIRA)',
    location: 'Delhi',
    locationType: 'Hybrid',
    experience: '5 years',
    employmentType: 'Full-time',
    clientRate: 88,
    targetSub: { filled: 3, total: 3 },
    pipeline: 0,
    assignees: [{ initials: 'L', color: '#22c55e' }],
    extraAssignees: 0,
    status: 'Fulfilled',
    createdAt: 'Mar 25, 2026',
    createdAgo: '2 months ago',
    client: 'Deloitte - 654321',
    hasBookmark: true,
    hasLinkedIn: true,
  },
  {
    key: '10',
    id: 10,
    title: 'Cloud Architect (Azure)',
    location: 'Bangalore',
    locationType: 'Remote',
    experience: '10+ years',
    employmentType: 'Contract',
    clientRate: 175,
    targetSub: { filled: 0, total: 2 },
    pipeline: 0,
    assignees: [],
    extraAssignees: 0,
    status: 'Open',
    createdAt: 'May 20, 2026',
    createdAgo: 'Today',
    client: 'Microsoft - 200044',
    hasBookmark: false,
    hasLinkedIn: false,
  },
];

export const PUGAZH_STATUS_TAG = {
  Fulfilled: { color: 'default' },
  Open: { color: 'processing' },
  'Partially Fulfilled': { color: 'warning' },
  Closed: { color: 'error' },
};

// ============================================================
// CANDIDATE REGISTRATION FORM - DROPDOWN OPTIONS
// ============================================================
export const FORM_OPTIONS = {
  experience: [
    { value: '0-1', label: '0-1 years' },
    { value: '1-2', label: '1-2 years' },
    { value: '2-3', label: '2-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-7', label: '5-7 years' },
    { value: '7-10', label: '7-10 years' },
    { value: '10+', label: '10+ years' },
  ],
  contractType: [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'contract-to-hire', label: 'Contract to Hire' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
  ],
  skillMatchLevel: [
    { value: 'exact', label: 'Exact Match' },
    { value: 'strong', label: 'Strong Match' },
    { value: 'good', label: 'Good Match' },
    { value: 'partial', label: 'Partial Match' },
    { value: 'low', label: 'Low Match' },
  ],
  workAuthorization: [
    { value: 'usc', label: 'US Citizen' },
    { value: 'gc', label: 'Green Card' },
    { value: 'h1b', label: 'H1B' },
    { value: 'opt', label: 'OPT' },
    { value: 'cpt', label: 'CPT' },
    { value: 'tn', label: 'TN Visa' },
    { value: 'other', label: 'Other' },
  ],
  noticePeriod: [
    { value: 'immediate', label: 'Immediate' },
    { value: '15-days', label: '15 Days' },
    { value: '30-days', label: '30 Days' },
    { value: '45-days', label: '45 Days' },
    { value: '60-days', label: '60 Days' },
    { value: '90-days', label: '90 Days' },
  ],
};

export const MOCK_CANDIDATES = [
  {
    id: 'C001',
    clientName: 'TCS - 867544',
    clientReqId: 'TCS-REQ-2026-001',
    contactPerson: 'Ramesh Iyer',
    endClient: 'Deloitte',
    clientLocation: 'Chennai, Tamil Nadu',
    accountManager: 'Anusha Krishnan',
    candidateName: 'Kiran Erravalla',
    email: 'kiran.erravalla@gmail.com',
    phone: '+91 98765 43210',
    mspReqId: 'MSP-TCS-0042',
    jobTitle: 'Java Developer',
    primarySkill: 'Java, Python, Spring Boot',
    experience: '7-10',
    contractType: 'full-time',
    skillMatchLevel: 'strong',
    workAuthorization: 'other',
    currentLocation: 'Chennai, Tamil Nadu',
    noticePeriod: '30-days',
    recruiterSkillNotes:
      'Candidate has 8 years of Java experience with strong Python background. Currently serving notice. Immediate joiner preferred. Resume has an outdated project — resend updated version.',
  },
  {
    id: 'C002',
    clientName: 'Infosys - 334210',
    clientReqId: 'INF-REQ-2026-055',
    contactPerson: 'Sunita Verma',
    endClient: 'Goldman Sachs',
    clientLocation: 'Bangalore, Karnataka',
    accountManager: 'Priya Nair',
    candidateName: 'Alex Turner',
    email: 'alex.turner@outlook.com',
    phone: '+1 415 555 0192',
    mspReqId: 'MSP-INF-0089',
    jobTitle: 'React Developer',
    primarySkill: 'React JS, TypeScript, Redux',
    experience: '3-5',
    contractType: 'contract',
    skillMatchLevel: 'exact',
    workAuthorization: 'h1b',
    currentLocation: 'Austin, Texas',
    noticePeriod: 'immediate',
    recruiterSkillNotes:
      'Strong React profile with TypeScript expertise. Currently on H1B, transfer required. Background check pending — follow up with vendor by EOD.',
  },
  {
    id: 'C003',
    clientName: 'Wipro - 556789',
    clientReqId: 'WIP-REQ-2026-022',
    contactPerson: 'Manoj Pillai',
    endClient: 'Amazon',
    clientLocation: 'Hyderabad, Telangana',
    accountManager: 'Deepak Choudhary',
    candidateName: 'Meena Subramanian',
    email: 'meena.s@yahoo.com',
    phone: '+91 91234 56789',
    mspReqId: 'MSP-WIP-0031',
    jobTitle: 'DevOps Engineer',
    primarySkill: 'AWS, Kubernetes, Terraform, Jenkins',
    experience: '5-7',
    contractType: 'contract',
    skillMatchLevel: 'good',
    workAuthorization: 'other',
    currentLocation: 'Hyderabad, Telangana',
    noticePeriod: '45-days',
    recruiterSkillNotes:
      'Solid DevOps background with AWS certified. Kubernetes experience on EKS. Offer letter pending approval from hiring manager — escalate if no response.',
  },
];

// ============================================================
// CLIENT LIST (for Name dropdown in Client Details)
// ============================================================
export const MOCK_CLIENTS = [
  { value: 'tcs-867544', label: 'TCS - 867544', location: 'Chennai, Tamil Nadu', accountManager: 'Anusha Krishnan' },
  { value: 'infosys-334210', label: 'Infosys - 334210', location: 'Bangalore, Karnataka', accountManager: 'Priya Nair' },
  { value: 'wipro-556789', label: 'Wipro - 556789', location: 'Hyderabad, Telangana', accountManager: 'Deepak Choudhary' },
  { value: 'cognizant-778821', label: 'Cognizant - 778821', location: 'Pune, Maharashtra', accountManager: 'Ravi Shankar' },
  { value: 'hcl-993401', label: 'HCL - 993401', location: 'Mumbai, Maharashtra', accountManager: 'Sneha Kulkarni' },
  { value: 'capgemini-112345', label: 'Capgemini - 112345', location: 'Noida, UP', accountManager: 'Tarun Mehta' },
  { value: 'deloitte-654321', label: 'Deloitte - 654321', location: 'Delhi, NCR', accountManager: 'Lakshmi Rao' },
  { value: 'microsoft-200044', label: 'Microsoft - 200044', location: 'Bangalore, Karnataka', accountManager: 'Vikram Joshi' },
];