import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://jnrwwtmmxfpzqocvwcjk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impucnd3dG1teGZwenFvY3Z3Y2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MzUwOTMsImV4cCI6MjA1MzIxMTA5M30.bmAk383bGToVZAtuznwdKnEkAfLIGqyGOv_uSIBeWE4'; // Replace with your actual Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Role styling dictionary
const roleStyles = {
    Owner: { color: 'goldenrod', fontWeight: 'bold' },
    Default: { color: 'white', fontWeight: 'normal' },
};

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
        const styles = roleStyles[role];

        userItem.textContent = role === 'Default' ? user.Username : `${user.Username} (${role})`;
        userItem.style.color = styles.color;
        userItem.style.fontWeight = styles.fontWeight;
        userItem.classList.add('user-item');

        userList.appendChild(userItem);
    });
}

// Function to submit a new username
async function submitUsername() {
    const usernameInput = document.getElementById('Username');
    const username = usernameInput.value.trim();
    const errorMessage = document.getElementById('error-message');
    const userIp = await getUserIp();

    // Clear previous error messages
    errorMessage.textContent = '';

    if (!userIp) {
        errorMessage.textContent = 'Unable to fetch your IP address. Please try again.';
        return;
    }

    if (username) {
        const { data: existingUser, error: fetchError } = await supabase
            .from('Visitors')
            .select('*')
            .eq('Ip', userIp)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error checking IP:', fetchError);
            return;
        }

        if (existingUser) {
            errorMessage.textContent = 'You have already submitted a username.';
            return;
        }

        const { error } = await supabase.from('Visitors').insert([{ Username: username, Ip: userIp }]);

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

// Function to get the user's IP address
async function getUserIp() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip; // Returns the user's IP address
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
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
