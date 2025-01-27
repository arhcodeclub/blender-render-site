document.addEventListener('DOMContentLoaded', () => {
    let submissions = [];
    let currentIndex = 0;
    let fallbackTimeout;

    const startButton = document.getElementById('start-kiosk');
    const mediaContainer = document.getElementById('media-container');
    const metadataContainer = document.getElementById('metadata');
    const imageDisplay = document.getElementById('image-display');
    const videoDisplay = document.getElementById('video-display');
    const themeDisplay = document.getElementById('theme');
    const authorDisplay = document.getElementById('author');
    const dateDisplay = document.getElementById('date');

    // Fetch the data from submissions/data.json
    async function fetchSubmissions() {
        try {
            const response = await fetch('submissions/data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            submissions = data.submissions || []; // Ensure submissions array exists

            if (submissions.length > 0) {
                showMedia(currentIndex);
            } else {
                console.error('No submissions found in the JSON file.');
            }
        } catch (error) {
            console.error('Failed to fetch submissions:', error);
        }
    }

    window.startKiosk = function startKiosk() {
        startButton.style.display = 'none';
        mediaContainer.style.display = 'block';
        metadataContainer.style.display = 'block';

        if (submissions.length > 0) {
            showMedia(currentIndex);
        } else {
            console.error('No submissions available.');
        }
    };

    function showMedia(index) {
        // Clear previous timeout to avoid overlap
        clearTimeout(fallbackTimeout);

        const media = submissions[index];
        if (!media) {
            console.error(`No media found at index ${index}.`);
            return;
        }

        // Update metadata
        themeDisplay.textContent = `Theme: ${media.Theme}`;
        authorDisplay.textContent = `Author: ${media.Author}`;
        dateDisplay.textContent = `Date: ${media.Date}`;

        if (media.type === 'img') {
            // Show image
            videoDisplay.style.display = 'none';
            videoDisplay.pause();
            imageDisplay.src = media.url;
            imageDisplay.style.display = 'block';

            // Set fallback timer for next media
            fallbackTimeout = setTimeout(nextMedia, media.duration * 1000);
        } else if (media.type === 'video') {
            // Show video
            imageDisplay.style.display = 'none';
            imageDisplay.src = '';
            videoDisplay.src = media.url;
            videoDisplay.style.display = 'block';

            // Play video
            videoDisplay.play();

            // Use `onended` and a fallback timer to ensure it respects JSON duration
            videoDisplay.onended = () => {
                videoDisplay.pause();
                videoDisplay.currentTime = 0;
                videoDisplay.style.display = 'none'; // Ensure video is hidden
                nextMedia();
            };
            fallbackTimeout = setTimeout(() => {
                videoDisplay.pause();
                videoDisplay.currentTime = 0; // Reset video to start
                videoDisplay.style.display = 'none'; // Ensure video is hidden
                nextMedia();
            }, media.duration * 1000);
        }
    }

    function nextMedia() {
        const previousMedia = submissions[currentIndex];
        if (previousMedia && previousMedia.type === 'img') {
            imageDisplay.style.display = 'none'; // Ensure the previous image is hidden
        }

        currentIndex = (currentIndex + 1) % submissions.length;
        showMedia(currentIndex);
    }

    // Add click event listener to the start button
    startButton.addEventListener('click', startKiosk);

    // Fetch submissions on page load
    fetchSubmissions();
});
