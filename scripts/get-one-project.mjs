import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

async function run() {
  const ids = ["aiku-corniche", "domaine-limoune", "kamanja-55", "marion-corniche", "movenpick-casablanca", "sunset-corniche"];
  for (const id of ids) {
    const snap = await getDoc(doc(db, "projects", id));
    if (snap.exists()) {
      console.log(`\n=================== ${id} ===================`);
      console.log(JSON.stringify(snap.data(), null, 2));
    } else {
      console.log(`\n❌ ${id} does not exist`);
    }
  }
  process.exit(0);
}

run().catch(console.error);
