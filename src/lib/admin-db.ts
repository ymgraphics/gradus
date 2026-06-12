// Server-side only — Firestore CRUD for Admin Panel
// Supports Admin SDK (with service account) + REST API fallback (with user token)

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gradus-portfolio";
const API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyDApEMlRaUq3UnRwM2cn3qQEByG6nsX7YM";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ─── Firestore Value Converters ────────────────────────────────────────────

function toFirestoreValue(val: unknown): Record<string, unknown> {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === "string") return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === "object") {
    const fields: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

function parseFirestoreValue(val: Record<string, unknown>): unknown {
  if (!val) return null;
  if ("nullValue" in val) return null;
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return Number(val.doubleValue);
  if ("booleanValue" in val) return val.booleanValue;
  if ("arrayValue" in val) {
    const arr = val.arrayValue as { values?: Record<string, unknown>[] };
    return (arr.values || []).map(parseFirestoreValue);
  }
  if ("mapValue" in val) {
    const map = val.mapValue as { fields?: Record<string, Record<string, unknown>> };
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(map.fields || {})) {
      obj[k] = parseFirestoreValue(v);
    }
    return obj;
  }
  return null;
}

function parseFirestoreDoc(doc: Record<string, unknown>): Record<string, unknown> {
  const fields = (doc.fields as Record<string, Record<string, unknown>>) || {};
  const obj: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(fields)) {
    obj[key] = parseFirestoreValue(val);
  }
  const name = doc.name as string;
  obj._id = name?.split("/").pop() || "";
  return obj;
}

function toFirestoreDocument(data: Record<string, unknown>) {
  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === "_id" || k === "id") continue; // Skip internal IDs
    fields[k] = toFirestoreValue(v);
  }
  return { fields };
}

// ─── HTTP Request Helper ───────────────────────────────────────────────────

async function firestoreRequest(
  method: string,
  path: string,
  token?: string,
  body?: unknown
): Promise<Record<string, unknown> | null> {
  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  // If no token, try with API key (read-only safe)
  const url = token
    ? `${BASE_URL}${path}`
    : `${BASE_URL}${path}?key=${API_KEY}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 204 || res.status === 200 && method === "DELETE") {
    return null;
  }

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`Firestore ${method} ${path} → ${res.status}: ${err}`);
  }

  return res.json();
}

// ─── Public CRUD API ──────────────────────────────────────────────────────

export async function dbList(
  collection: string,
  token?: string
): Promise<Record<string, unknown>[]> {
  const data = await firestoreRequest("GET", `/${collection}`, token);
  if (!data) return [];
  const docs = data.documents as Record<string, unknown>[] | undefined;
  if (!docs) return [];
  return docs.map(parseFirestoreDoc);
}

export async function dbGet(
  collection: string,
  id: string,
  token?: string
): Promise<Record<string, unknown> | null> {
  try {
    const data = await firestoreRequest("GET", `/${collection}/${id}`, token);
    if (!data) return null;
    return parseFirestoreDoc(data);
  } catch {
    return null;
  }
}

export async function dbCreate(
  collection: string,
  data: Record<string, unknown>,
  token?: string
): Promise<Record<string, unknown>> {
  const doc = toFirestoreDocument(data);
  // POST to collection (auto-generated ID)
  const result = await firestoreRequest("POST", `/${collection}`, token, doc);
  if (!result) throw new Error("Create returned empty response");
  return parseFirestoreDoc(result);
}

export async function dbCreateWithId(
  collection: string,
  id: string,
  data: Record<string, unknown>,
  token?: string
): Promise<Record<string, unknown>> {
  const doc = toFirestoreDocument(data);
  // PATCH with documentId creates or overwrites
  const result = await firestoreRequest(
    "PATCH",
    `/${collection}/${id}`,
    token,
    doc
  );
  if (!result) throw new Error("CreateWithId returned empty response");
  return parseFirestoreDoc(result);
}

export async function dbUpdate(
  collection: string,
  id: string,
  data: Record<string, unknown>,
  token?: string
): Promise<Record<string, unknown>> {
  const doc = toFirestoreDocument(data);
  const result = await firestoreRequest(
    "PATCH",
    `/${collection}/${id}`,
    token,
    doc
  );
  if (!result) throw new Error("Update returned empty response");
  return parseFirestoreDoc(result);
}

export async function dbDelete(
  collection: string,
  id: string,
  token?: string
): Promise<void> {
  await firestoreRequest("DELETE", `/${collection}/${id}`, token);
}

// ─── Token Extraction Helper ───────────────────────────────────────────────

export function getTokenFromRequest(req: Request): string | undefined {
  const cookie = req.headers.get("cookie");
  if (!cookie) return undefined;
  const match = cookie.match(/(?:^|;\s*)__session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

// ─── Summary Stats ─────────────────────────────────────────────────────────

export async function getAdminStats(token?: string) {
  const [projects, jobs, team, feedbacks, partners] = await Promise.all([
    dbList("projects", token).then((d) => d.length).catch(() => 0),
    dbList("jobs", token).then((d) => d.length).catch(() => 0),
    dbList("team_members", token).then((d) => d.length).catch(() => 0),
    dbList("feedbacks", token).then((d) => d.length).catch(() => 0),
    dbList("partners", token).then((d) => d.length).catch(() => 0),
  ]);
  return { projects, jobs, team, feedbacks, partners };
}
