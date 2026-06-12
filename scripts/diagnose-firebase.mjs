import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function diagnose() {
  const collections = ["projects", "jobs", "team_members", "feedbacks"];
  
  console.log("\n🔍 FULL FIREBASE DIAGNOSTIC\n" + "=".repeat(40));
  
  for (const col of collections) {
    try {
      const snap = await getDocs(collection(db, col));
      if (snap.empty) {
        console.log(`\n❌ "${col}": EMPTY (0 documents)`);
      } else {
        console.log(`\n✅ "${col}": ${snap.docs.length} documents`);
        snap.docs.forEach(doc => {
          const data = doc.data();
          const keys = Object.keys(data);
          console.log(`   - ID: ${doc.id} | Fields: [${keys.join(", ")}]`);
        });
      }
    } catch (e) {
      console.log(`\n🔴 "${col}": ERROR - ${e.message}`);
    }
  }
  
  console.log("\n" + "=".repeat(40));
  console.log("✅ Diagnostic complete.");
  process.exit(0);
}

diagnose().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
