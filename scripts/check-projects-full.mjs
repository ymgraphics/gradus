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

async function run() {
  const snap = await getDocs(collection(db, "projects"));
  snap.docs.forEach(doc => {
    const data = doc.data();
    console.log(`\n================= PROJECT: ${doc.id} =================`);
    console.log(`Client: ${data.client}`);
    console.log(`Published: ${data.published}`);
    console.log(`Featured: ${data.featured}`);
    console.log(`Format: ${data.format}`);
    console.log(`CoverImage: ${data.coverImage}`);
    console.log(`media.cover: ${data.media?.cover}`);
    console.log(`media.assets: ${JSON.stringify(data.media?.assets || [])}`);
  });
  process.exit(0);
}

run().catch(console.error);
