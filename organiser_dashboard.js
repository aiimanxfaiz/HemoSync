// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// TODO: PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
    apiKey: "AIzaSyDmmZr7FuJV39cK_9WqabqS26doV04USgE",
    authDomain: "hemosync-765c9.firebaseapp.com",
    databaseURL: "https://hemosync-765c9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hemosync-765c9",
    storageBucket: "hemosync-765c9.firebasestorage.app",
    messagingSenderId: "749126382362",
    appId: "1:749126382362:web:8852a1e895edbbea3072a3",
    measurementId: "G-JP1Y2S1LN5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 1. Security Check: Is user logged in?
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Organiser ID:", user.uid);
        
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                
                // Extra Security: Kick them out if they are NOT an organiser
                if (userData.role !== 'organiser') {
                    alert("Access Denied: You are not an Event Organiser.");
                    window.location.href = "index.html";
                }

                // Update Name on Screen
                document.getElementById('welcomeName').textContent = "Hello, " + userData.fullname;
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }

    } else {
        // No user signed in? Go back to login
        window.location.href = "index.html";
    }
});

// 2. Handle Logout
const logoutBtn = document.getElementById('logoutBtn');

if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            alert("Logged out successfully.");
            window.location.href = "index.html";
        }).catch((error) => {
            console.error("Logout Error:", error);
        });
    });
}