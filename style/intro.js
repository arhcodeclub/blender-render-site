document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    let submissionIndex = urlParams.get('index');
    if(submissionIndex == null){
        submissionIndex = 0;
    }

    // Update the content attribute with the new URL including the parameter
    const metaTag = document.getElementById("linker");
    metaTag.setAttribute("content", "5;url=./render_looping.html?index=" + submissionIndex);
});