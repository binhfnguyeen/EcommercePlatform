import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDcaB7DJPnGO6ufyZ4b71wFGI_5d-FkV-c",
    authDomain: "ecommercechatrealtime.firebaseapp.com",
    databaseURL: "https://ecommercechatrealtime-default-rtdb.firebaseio.com",
    projectId: "ecommercechatrealtime",
    storageBucket: "ecommercechatrealtime.appspot.com",
    messagingSenderId: "220042499557",
    appId: "1:220042499557:android:8c33e4fe3643e9aab40b0c"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
