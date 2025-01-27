document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);

    fetch("./submissions/data.json")
        .then(response => response.json())
        .then(data => {
            const submissions = data.submissions;
            if (submissions && submissions.length > 0) {
                const topbarTheme = document.getElementById("theme");
                const topbarArtist = document.getElementById("artist");
                const topbarDate = document.getElementById("date");
                const submissionIndex = urlParams.get('index');
                if(submissionIndex == null){
                    submissionIndex = 0;
                }

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
                let i;
                if(parseInt(submissionIndex)+1 < submissions.length){
                    i = 1 + parseInt(submissionIndex);
                }else{
                    i = 0;
                }
                metaTag.setAttribute("content",  submission.duration + ";url=./index_looping.html?index=" + i);             
            }
        })
        .catch(error => console.error("Error fetching data:", error));
});
