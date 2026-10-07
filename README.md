# ONDC POC - Ghost theme

Upload in Ghost Admin: Settings > Design & branding > Change theme > Upload theme.

- `default.hbs`  shared header, footer and menu
- `partials/navigation.hbs`  markup of the menu links
- `index.hbs`    home page (shows the Ghost Page whose URL slug is "home")
- `page.hbs`     every other Ghost Page
- `post.hbs`     blog posts (required by Ghost)
- `error.hbs`    404 and other errors
- `assets/`      CSS and JavaScript
- `package.json` theme name, version and the settings editors can change (Design & branding > Theme)
