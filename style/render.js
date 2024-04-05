document.addEventListener("DOMContentLoaded", function () {
    fetch("./data.json")
        .then(response => response.json())
        .then(data => {
            const submissions = data.submissions;
            if (submissions && submissions.length > 0) {
                const topbarTheme = document.getElementById("theme");
                const topbarArtist = document.getElementById("artist");
                const topbarDate = document.getElementById("date");
                const submissionIndex = urlParams.get('index');
                const urlParams = new URLSearchParams(window.location.search);


                topbarTheme.textContent = submissions[submissionIndex].Theme;
                topbarArtist.textContent = "Door " + submissions[submissionIndex].Author;
                topbarDate.textContent = submissions[submissionIndex].Date;

                submission = submissions[submissionIndex];

                if (submission.type == "video") {
                    const video = document.getElementById("videosrc");
                    video.classList.add("content");
                    video.loop = true;
                    video.muted = true;
                    video.autoplay = true;

                    const source = document.createElement("source");
                    source.src = submission.url;
                    source.type = "video/mp4";

                    video.appendChild(source);
                } else if (submission.type == "img") {
                    const image = document.getElementById("imgsrc");
                    image.classList.add("content");
                    image.src = submission.url;
                }

                // Update the content attribute with the new URL including the parameter
                const metaTag = document.getElementById("linker");
                const i = 0;
                if(submissionIndex+1 < submissionIndex.length){
                    i = submissionIndex+1;
                }else{
                    i = 0;
                }
                metaTag.setAttribute("content", "5;url=./render_looping.html?index=" + encodeURIComponent(submissionIndex+1));             
            }
        })
        .catch(error => console.error("Error fetching data:", error));
});
