import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://jnrwwtmmxfpzqocvwcjk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impucnd3dG1teGZwenFvY3Z3Y2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MzUwOTMsImV4cCI6MjA1MzIxMTA5M30.bmAk383bGToVZAtuznwdKnEkAfLIGqyGOv_uSIBeWE4'; // Replace with your actual Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch usernames from Supabase
async function fetchUserNames() {
    const { data, error } = await supabase
        .from('Visitors')
        .select('Username');

    if (error) {
        console.error('Error fetching usernames:', error);
        return;
    }

    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    data.forEach(user => {
        const userItem = document.createElement('div');
        userItem.textContent = user.Username;
        userList.appendChild(userItem);
    });
}

// Function to submit a new username
async function submitUsername() {
    const usernameInput = document.getElementById('Username');
    const username = usernameInput.value.trim();

    if (username) {
        const { data, error } = await supabase
            .from('Visitors')
            .insert([{ Username: username }]);

        if (error) {
            console.error('Error inserting username:', error);
        } else {
            usernameInput.value = '';
            fetchUserNames();
        }
    } else {
        alert('Please enter a username.');
    }
}

// Event listener for the submit button
document.getElementById('submit-name').addEventListener('click', submitUsername);

// Fetch usernames on page load
fetchUserNames();
