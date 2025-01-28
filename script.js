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

    async function fetchSubmissions() {
        try {
            const response = await fetch('submissions/data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            submissions = data.submissions || [];

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
        startButton.style.opacity = '0';
        setTimeout(() => {
            startButton.style.display = 'none';
            mediaContainer.style.display = 'block';
            metadataContainer.style.display = 'block';
            
            // Trigger reflow
            void mediaContainer.offsetWidth;
            
            mediaContainer.classList.add('visible');
            metadataContainer.classList.add('visible');

            if (submissions.length > 0) {
                showMedia(currentIndex);
            } else {
                console.error('No submissions available.');
            }
        }, 300);
    };

    function showMedia(index) {
        clearTimeout(fallbackTimeout);

        const media = submissions[index];
        if (!media) {
            console.error(`No media found at index ${index}.`);
            return;
        }

        // Update metadata with fade effect
        metadataContainer.classList.remove('visible');
        setTimeout(() => {
            themeDisplay.textContent = `${media.Theme}`;
            authorDisplay.textContent = `Door: ${media.Author}`;
            dateDisplay.textContent = `Datum: ${media.Date}`;
            metadataContainer.classList.add('visible');
        }, 300);

        if (media.type === 'img') {
            videoDisplay.classList.remove('visible');
            setTimeout(() => {
                videoDisplay.style.display = 'none';
                videoDisplay.pause();
                imageDisplay.src = media.url;
                imageDisplay.style.display = 'block';
                
                // Trigger reflow
                void imageDisplay.offsetWidth;
                
                imageDisplay.classList.add('visible');
            }, 300);

            fallbackTimeout = setTimeout(nextMedia, media.duration * 1000);
        } else if (media.type === 'video') {
            imageDisplay.classList.remove('visible');
            setTimeout(() => {
                imageDisplay.style.display = 'none';
                imageDisplay.src = '';
                videoDisplay.src = media.url;
                videoDisplay.style.display = 'block';
                
                // Trigger reflow
                void videoDisplay.offsetWidth;
                
                videoDisplay.classList.add('visible');
                videoDisplay.play();
            }, 300);

            videoDisplay.onended = () => {
                videoDisplay.classList.remove('visible');
                setTimeout(() => {
                    videoDisplay.pause();
                    videoDisplay.currentTime = 0;
                    videoDisplay.style.display = 'none';
                    nextMedia();
                }, 300);
            };

            fallbackTimeout = setTimeout(() => {
                videoDisplay.classList.remove('visible');
                setTimeout(() => {
                    videoDisplay.pause();
                    videoDisplay.currentTime = 0;
                    videoDisplay.style.display = 'none';
                    nextMedia();
                }, 300);
            }, media.duration * 1000);
        }
    }

    function nextMedia() {
        const previousMedia = submissions[currentIndex];
        if (previousMedia && previousMedia.type === 'img') {
            imageDisplay.classList.remove('visible');
            setTimeout(() => {
                imageDisplay.style.display = 'none';
            }, 300);
        }

        currentIndex = (currentIndex + 1) % submissions.length;
        showMedia(currentIndex);
    }

    startButton.addEventListener('click', startKiosk);
    fetchSubmissions();
});