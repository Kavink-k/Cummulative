// Local "database" for demo. Swap to API without changing pages.
export type StudentRecord = {
  id: string;                // stable key (e.g., regNo or generated)
  name: string;              // used for search
  email?: string;
  regNo?: string;
  // The 12 forms' payloads as you already store them in Index:
  steps: {
    step1?: any; step2?: any; step3?: any; step4?: any; step5?: any; step6?: any;
    step7?: any; step8?: any; step9?: any; step10?: any; step11?: any; step12?: any;
  };
  // Optional metadata
  updatedAt?: number;
};

const DB_KEY = "students_db_v1";

function readDB(): StudentRecord[] {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? (JSON.parse(raw) as StudentRecord[]) : [];
  } catch { return []; }
}

function writeDB(rows: StudentRecord[]) {
  localStorage.setItem(DB_KEY, JSON.stringify(rows));
}

export function listStudents(): StudentRecord[] {
  return readDB();
}

export function upsertStudent(rec: StudentRecord) {
  const rows = readDB();
  const idx = rows.findIndex(r => r.id === rec.id);
  if (idx >= 0) rows[idx] = { ...rows[idx], ...rec, updatedAt: Date.now() };
  else rows.unshift({ ...rec, updatedAt: Date.now() });
  writeDB(rows);
}

export function getStudentById(id: string): StudentRecord | null {
  return readDB().find(r => r.id === id) ?? null;
}

export function searchStudents(q: string): StudentRecord[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return readDB().filter(r => {
    return (
      r.name?.toLowerCase().includes(term) ||
      r.email?.toLowerCase().includes(term) ||
      r.regNo?.toLowerCase().includes(term)
    );
  });
}
