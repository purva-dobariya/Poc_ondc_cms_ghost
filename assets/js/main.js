// Ghost's own video-card player script is not loaded in this theme,
// so switch on the browser's normal video controls instead.
(function () {
    var videos = document.querySelectorAll(".kg-video-card video");
    for (var i = 0; i < videos.length; i++) {
        videos[i].setAttribute("controls", "");
    }
})();
