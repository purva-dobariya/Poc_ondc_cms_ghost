// Loads the Ghost page whose slug is in <body data-slug="...">
// and shows its content inside <main id="app">.
(function () {
    var cfg = window.GHOST_CONFIG || {};
    var app = document.getElementById("app");
    var slug = document.body.getAttribute("data-slug");

    function showError(title, detail) {
        app.textContent = "";
        var box = document.createElement("div");
        box.className = "error-box";
        var h = document.createElement("h2");
        h.textContent = title;
        var p = document.createElement("p");
        p.textContent = detail;
        box.appendChild(h);
        box.appendChild(p);
        app.appendChild(box);
    }

    function isPlaceholder(v) {
        return !v || /YOUR-SITE|PASTE_YOUR/.test(v);
    }

    if (isPlaceholder(cfg.url) || isPlaceholder(cfg.key)) {
        showError(
            "Ghost is not connected yet",
            "Open js/config.js and set your Ghost site URL and Content API key."
        );
        return;
    }

    var base = cfg.url.replace(/\/+$/, "");
    var endpoint =
        base + "/ghost/api/content/pages/slug/" + encodeURIComponent(slug) +
        "/?key=" + encodeURIComponent(cfg.key);

    // Ghost's video card ships with a custom player that needs Ghost's own JavaScript.
    // We don't load that script, so switch on the browser's normal video controls instead.
    function fixVideos(root) {
        var videos = root.querySelectorAll(".kg-video-card video");
        for (var i = 0; i < videos.length; i++) {
            videos[i].setAttribute("controls", "");
        }
    }

    function render(page) {
        app.textContent = "";
        // Content comes from Ghost staff editors (trusted), so it is inserted as HTML.
        app.innerHTML = page.html || "";
        fixVideos(app);
        document.title = (page.meta_title || page.title || slug) + " - ONDC CMS POC";
    }

    fetch(endpoint)
        .then(function (res) {
            if (res.ok) { return res.json(); }
            var err = new Error("HTTP " + res.status);
            err.status = res.status;
            throw err;
        })
        .then(function (data) {
            var page = data && data.pages && data.pages[0];
            if (!page) {
                var err = new Error("empty");
                err.status = 404;
                throw err;
            }
            render(page);
        })
        .catch(function (err) {
            if (err.status === 404) {
                showError(
                    "Page not found in Ghost",
                    'Create a Page in Ghost with the URL slug "' + slug +
                    '" and click Publish. Drafts are not visible to the website.'
                );
            } else if (err.status === 401 || err.status === 403) {
                showError(
                    "Ghost rejected the Content API key",
                    "Check the key in js/config.js. Copy the Content API key, not the Admin API key."
                );
            } else {
                showError(
                    "Could not reach Ghost",
                    "Check the url in js/config.js (https, no slash at the end) and that your Ghost site is online."
                );
            }
        });
})();
