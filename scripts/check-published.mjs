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

async function checkValues() {
  console.log("\n🔍 CHECKING PUBLISHED VALUES\n" + "=".repeat(40));
  
  const cols = ["jobs", "team_members", "feedbacks"];
  for (const col of cols) {
    const snap = await getDocs(collection(db, col));
    snap.docs.forEach(doc => {
      const data = doc.data();
      console.log(`${col}/${doc.id} → published = ${JSON.stringify(data.published)} (type: ${typeof data.published})`);
    });
  }
}

checkValues().catch(console.error);
