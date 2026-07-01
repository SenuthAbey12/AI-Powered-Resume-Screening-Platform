export const candidates = [
  { id: 1, name: "Sarah Chen", role: "Senior ML Engineer", score: 94, match: 97, status: "shortlisted", location: "San Francisco, CA", exp: "8 yrs", applied: "2 days ago", avatar: "SC", skills: ["PyTorch", "Kubernetes", "MLOps", "Python"], education: "M.S. CS, Stanford" },
  { id: 2, name: "Marcus Okafor", role: "ML Engineer", score: 89, match: 91, status: "reviewing", location: "New York, NY", exp: "5 yrs", applied: "3 days ago", avatar: "MO", skills: ["TensorFlow", "AWS", "Docker", "Scala"], education: "B.S. CS, MIT" },
  { id: 3, name: "Priya Nair", role: "Data Scientist", score: 87, match: 88, status: "shortlisted", location: "Austin, TX", exp: "6 yrs", applied: "1 day ago", avatar: "PN", skills: ["Python", "R", "Spark", "SQL"], education: "Ph.D. Statistics, UT Austin" },
  { id: 4, name: "James Whitfield", role: "ML Researcher", score: 82, match: 84, status: "reviewing", location: "Seattle, WA", exp: "4 yrs", applied: "5 days ago", avatar: "JW", skills: ["PyTorch", "CUDA", "C++", "Research"], education: "M.S. AI, CMU" },
  { id: 5, name: "Aisha Patel", role: "AI Engineer", score: 79, match: 80, status: "pending", location: "Boston, MA", exp: "3 yrs", applied: "6 days ago", avatar: "AP", skills: ["Python", "FastAPI", "LangChain", "RAG"], education: "B.S. CS, Harvard" },
  { id: 6, name: "Tom Nakamura", role: "Platform Engineer", score: 74, match: 76, status: "pending", location: "Chicago, IL", exp: "7 yrs", applied: "1 week ago", avatar: "TN", skills: ["Go", "Kubernetes", "Terraform", "GCP"], education: "B.S. CE, UIUC" },
  { id: 7, name: "Elena Vasquez", role: "MLOps Engineer", score: 71, match: 73, status: "rejected", location: "Denver, CO", exp: "2 yrs", applied: "1 week ago", avatar: "EV", skills: ["Airflow", "Spark", "Python", "CI/CD"], education: "B.S. CS, CU Boulder" },
  { id: 8, name: "Rohan Mehta", role: "Backend Engineer", score: 68, match: 70, status: "rejected", location: "Remote", exp: "4 yrs", applied: "2 weeks ago", avatar: "RM", skills: ["Node.js", "PostgreSQL", "Redis", "Docker"], education: "B.Tech, IIT Bombay" },
];

export const jobs = [
  { id: 1, title: "Senior ML Engineer", dept: "AI Platform", applicants: 143, active: true, posted: "Dec 10, 2024", deadline: "Jan 15, 2025", shortlisted: 12, stage: "Screening" },
  { id: 2, title: "MLOps Engineer", dept: "Infrastructure", applicants: 89, active: true, posted: "Dec 5, 2024", deadline: "Jan 10, 2025", shortlisted: 8, stage: "Interview" },
  { id: 3, title: "AI Research Scientist", dept: "Research", applicants: 67, active: true, posted: "Nov 28, 2024", deadline: "Dec 31, 2024", shortlisted: 5, stage: "Final Round" },
  { id: 4, title: "Data Engineer", dept: "Data Platform", applicants: 201, active: false, posted: "Nov 15, 2024", deadline: "Dec 15, 2024", shortlisted: 3, stage: "Closed" },
];

export const hiringFunnel = [
  { stage: "Applied", count: 500 },
  { stage: "Screened", count: 312 },
  { stage: "Shortlisted", count: 87 },
  { stage: "Interviewed", count: 34 },
  { stage: "Offered", count: 11 },
];

export const weeklyApplications = [
  { week: "W1 Nov", apps: 42, hired: 2 },
  { week: "W2 Nov", apps: 68, hired: 3 },
  { week: "W3 Nov", apps: 55, hired: 1 },
  { week: "W4 Nov", apps: 91, hired: 4 },
  { week: "W1 Dec", apps: 78, hired: 2 },
  { week: "W2 Dec", apps: 110, hired: 5 },
  { week: "W3 Dec", apps: 143, hired: 3 },
];

export const scoreDistribution = [
  { range: "90-100", count: 18, fill: "#10b981" },
  { range: "80-89", count: 34, fill: "#6366f1" },
  { range: "70-79", count: 52, fill: "#f59e0b" },
  { range: "60-69", count: 41, fill: "#f43f5e" },
  { range: "<60", count: 27, fill: "#6b7280" },
];

export const skillDemand = [
  { skill: "PyTorch", demand: 89 },
  { skill: "Kubernetes", demand: 76 },
  { skill: "Python", demand: 95 },
  { skill: "MLOps", demand: 82 },
  { skill: "AWS", demand: 71 },
  { skill: "TensorFlow", demand: 68 },
];
