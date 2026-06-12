// Quick test of the Firebase REST API
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

async function testCollection(name) {
  const url = `${BASE_URL}/${name}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`❌ "${name}": HTTP ${res.status} - ${res.statusText}`);
    return;
  }
  const json = await res.json();
  if (!json.documents) {
    console.log(`⚠️  "${name}": No documents (response: ${JSON.stringify(json).slice(0, 100)})`);
    return;
  }
  const docs = json.documents.map(parseDoc);
  console.log(`✅ "${name}": ${docs.length} documents`);
  docs.forEach(d => console.log(`   - ${d._id}: ${JSON.stringify(d).slice(0, 80)}...`));
}

async function run() {
  console.log("🔍 Testing Firebase REST API\n" + "=".repeat(40));
  for (const col of ["projects", "jobs", "team_members", "feedbacks"]) {
    await testCollection(col);
  }
}

run().catch(console.error);
