import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// We need 'addDoc' to create new entries in the database
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// YOUR API KEYS
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

// 1. Check Auth (Security)
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html"; // Kick out if not logged in
    }
});

// 2. Handle Form Submission
const eventForm = document.getElementById('createEventForm');

eventForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page refresh

    const venue = document.getElementById('venue').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const slots = document.getElementById('slots').value;
    const priority = document.getElementById('priority').value;

    const submitBtn = eventForm.querySelector('button[type="submit"]');
    submitBtn.textContent = "Publishing...";

    try {
        // SRS 3.2.1.1: System creates event record and sets status to 'Published'
        // We save this into a new collection called "events"
        await addDoc(collection(db, "events"), {
            venue: venue,
            date: date,
            time: time,
            totalSlots: parseInt(slots),
            availableSlots: parseInt(slots), // Initially, all slots are free
            priorityBlood: priority,
            status: "Published", // SRS Requirement
            organiserId: auth.currentUser.uid, // Link event to this specific organiser
            createdAt: new Date()
        });

        alert("Success! Event has been published to the calendar.");
        window.location.href = "organiser_dashboard.html";

    } catch (error) {
        console.error("Error adding event: ", error);
        alert("Error: " + error.message);
        submitBtn.textContent = "Publish Event"; // Reset button text
    }
});