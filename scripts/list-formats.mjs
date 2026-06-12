// Direct REST API fetch to list project formats
const PROJECT_ID = "gradus-portfolio";
const API_KEY = "AIzaSyDApEMlRaUq3UnRwM2cn3qQEByG6nsX7YM";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function parseValue(val) {
  if (!val) return null;
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return Number(val.integerValue);
  if (val.doubleValue !== undefined) return Number(val.doubleValue);
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.arrayValue !== undefined) return (val.arrayValue.values || []).map(parseValue);
  if (val.mapValue !== undefined) {
    const obj = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) obj[k] = parseValue(v);
    return obj;
  }
  return null;
}

function parseDoc(doc) {
  const fields = doc.fields || {};
  const obj = {};
  for (const [key, val] of Object.entries(fields)) obj[key] = parseValue(val);
  obj._id = doc.name?.split("/").pop() || "";
  return obj;
}

const toNum = (val) => {
  const n = Number(val);
  return isNaN(n) ? 999 : n;
};

async function run() {
  const url = `${BASE_URL}/projects?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("HTTP error:", res.status);
    return;
  }
  const json = await res.json();
  if (!json.documents) {
    console.log("No documents.");
    return;
  }
  const rawDocs = json.documents.map(parseDoc);
  
  const projects = rawDocs.map(d => {
    const format = d.format || d.Format || d.settings?.layout_format || "half";
    const published = d.published ?? d.settings?.published ?? true;
    const sort_order = toNum(d.sort_order ?? d.settings?.sort_order ?? d.order);
    return {
      id: d._id,
      client: d.client || "Client",
      format,
      published,
      sort_order,
      cover: d.media?.cover || d.coverImage || ""
    };
  })
  .filter(p => p.published !== false && p.id !== "-template")
  .sort((a, b) => a.sort_order - b.sort_order);

  console.log("\n📊 CURRENT PROJECTS & FORMATS:");
  projects.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.id}] Client: "${p.client}" | Format: "${p.format}" | Order: ${p.sort_order} | Cover: "${p.cover ? 'Yes' : 'No'}"`);
  });
  process.exit(0);
}

run().catch(console.error);
