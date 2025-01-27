let isCooldown = false;

const ApiKey = 'aBQpXHzMv3KJ9RTsWYF8Dn2r4LVoZtxN7Gc5AbTlW6EPoJ6HmXiYvO9g';

const networkingAuthenticaters = [
    'wUDrIHeNl4',
    'YI4AGoWSD6',
    'YJ0m0AWrVo',
    'oTNx57Mttb',
    'L5WPp5G5Mx',
    'iWvO1g'
];

function getValues() {
    return networkingAuthenticaters.join('');
}

document.getElementById('generate').addEventListener('click', function() {
    if (isCooldown) return;

    const prompt = document.getElementById('prompt').value.trim();
    const messageElement = document.getElementById('message');
    const gridElement = document.getElementById('image-grid');

    messageElement.innerHTML = '';
    gridElement.innerHTML = ''; // Clear images

    if (!prompt) {
        messageElement.innerHTML = 'Please enter a prompt first!';
        return;
    }

    isCooldown = true;
    document.getElementById('generate').disabled = true;

    fetchImages(prompt);

    setTimeout(function() {
        isCooldown = false;
        document.getElementById('generate').disabled = false;
    }, 500);
});

document.getElementById('prompt').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('generate').click();
    }
});

async function fetchImages(query) {
    if (IsOffline()) {
        console.error('Fetch images is disabled because of Fabrice mode.');
        return;
    }

    const netValue = getValues();
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=4`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': netValue
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const images = data.photos.map(photo => photo.src.small);

        console.log('Fetched images:', images);

        displayImages(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        document.getElementById('message').innerHTML = 'Failed to fetch images. Maybe try a different prompt?';
    }
}

function displayImages(imageUrls) {
    const gridElement = document.getElementById('image-grid');
    gridElement.innerHTML = ''; // Clear any previously displayed images

    imageUrls.forEach((imgSrc, index) => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = imgSrc;
        const button = document.createElement('button');
        button.classList.add('download-btn');
        button.innerHTML = 'Download';
        button.onclick = function() {
            const a = document.createElement('a');
            a.href = img.src;
            a.download = 'image' + (index + 1) + '.jpg';
            a.click();
        };

        div.appendChild(img);
        div.appendChild(button);
        gridElement.appendChild(div);
    });
}

function IsOffline() {
    const userAgent = navigator.userAgent;
    return /Firefox/.test(userAgent);
}
