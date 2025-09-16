# AniRanker Static Site

AniRanker is a purely static experience built with modern browser APIs that can be hosted anywhere GitHub Pages can serve HTML, CSS, and JavaScript files. All data used by the interface is bundled directly into the repository, so no server-side runtime or build tooling is required.

## Project structure

```
.
├── index.html        # Entry point that loads the vanilla JS application
├── styles.css        # Global styles for the entire experience
└── src/
    ├── api/          # Local mock implementations that provide data to the UI
    ├── icons.js      # Lightweight SVG icon helpers
    ├── data/         # Curated anime and waifu data sets served from static JS modules
    └── utils/        # Shared helpers, e.g. SVG placeholder generators
```

## Local development

Because everything is static, you can either open `index.html` directly in your browser or serve the directory with a very small HTTP server. For example:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000) to interact with the site.

## Deploying to GitHub Pages

1. Push the repository to GitHub.
2. Open the repository settings and navigate to the **Pages** section.
3. Under **Source**, choose **Deploy from a branch**.
4. Select the default branch (usually `main`) and the `/ (root)` folder, then click **Save**.
5. GitHub Pages will build and publish the static site automatically. Once the deployment completes, your site will be available at `https://<username>.github.io/<repository>/`.

That’s it—no build scripts or additional configuration are needed.
