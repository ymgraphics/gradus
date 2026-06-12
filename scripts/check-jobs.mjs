import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDApEMlRaUq3UnRwM2cn3qQEByG6nsX7YM",
  authDomain: "gradus-portfolio.firebaseapp.com",
  projectId: "gradus-portfolio",
  storageBucket: "gradus-portfolio.firebasestorage.app",
  messagingSenderId: "1090805777507",
  appId: "1:1090805777507:web:83f4140e15430738482456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkJobs() {
  console.log("🔍 Connecting to Firebase to check Jobs...");
  
  const collections = ["jobs", "Jobs", "JOB", "Jobs_List"];
  
  for (const colName of collections) {
    console.log(`\nChecking collection: "${colName}"...`);
    const q = query(collection(db, colName));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log(`❌ Collection "${colName}" is empty or does not exist.`);
    } else {
      console.log(`✅ Found ${snapshot.docs.length} documents in "${colName}":`);
      snapshot.docs.forEach(doc => {
        console.log(`- ID: ${doc.id}`);
        console.log(`  Data:`, JSON.stringify(doc.data(), null, 2));
      });
    }
  }
}

checkJobs().catch(console.error);
