import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://jnrwwtmmxfpzqocvwcjk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impucnd3dG1teGZwenFvY3Z3Y2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MzUwOTMsImV4cCI6MjA1MzIxMTA5M30.bmAk383bGToVZAtuznwdKnEkAfLIGqyGOv_uSIBeWE4';  // Use your Supabase key here
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate a random color for custom roles
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to fetch usernames from Supabase
async function fetchUserNames() {
    const { data, error } = await supabase.from('Visitors').select('Username, Role');

    if (error) {
        console.error('Error fetching usernames:', error);
        return;
    }

    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    data.forEach(user => {
        const userItem = document.createElement('div');
        const role = user.Role || 'Default';

        // Determine styles based on the role
        let color = 'white';
        let fontWeight = 'normal';

        if (role === 'Owner') {
            color = 'goldenrod';
            fontWeight = 'bold';
        } else if (role !== 'Default') {
            color = getRandomColor();
        }

        userItem.textContent = role === 'Default' ? user.Username : `${user.Username} (${role})`;
        userItem.style.color = color;
        userItem.style.fontWeight = fontWeight;
        userItem.classList.add('user-item');

        userList.appendChild(userItem);
    });
}

async function submitUsername() {
    const usernameInput = document.getElementById('Username');
    const username = usernameInput.value.trim();
    const errorMessage = document.getElementById('error-message');

    // Clear previous error messages
    errorMessage.textContent = '';

    if (username) {
        // Fix the query by correctly formatting the username
        const { data: existingUser, error: fetchError } = await supabase
            .from('Visitors')
            .select('*')
            .eq('Username', username)  // Corrected query for exact username match
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error checking username:', fetchError);
            return;
        }

        // Skip the duplicate check
        const { error } = await supabase.from('Visitors').insert([ { Username: username } ]);

        if (error) {
            console.error('Error inserting username:', error);
        } else {
            usernameInput.value = '';
            fetchUserNames();
        }
    } else {
        errorMessage.textContent = 'Please enter a username.';
    }
}

// Event listener for the submit button
document.getElementById('submit-name').addEventListener('click', submitUsername);

// Fetch usernames on page load
fetchUserNames();

// Event listener for the "Enter" key in the input field
document.getElementById('Username').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        submitUsername();
    }
});
