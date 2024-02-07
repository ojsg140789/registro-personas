import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyD0AyXhIKYqN_seTgoyj4D8cskRlEMudik",
    authDomain: "clientes-ee81e.firebaseapp.com",
    databaseURL: "https://clientes-ee81e-default-rtdb.firebaseio.com",
    projectId: "clientes-ee81e",
    storageBucket: "clientes-ee81e.appspot.com",
    messagingSenderId: "800152636596",
    appId: "1:800152636596:web:be121490a31caba9d4dbe1"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);