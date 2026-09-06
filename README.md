# Metric Market — GA4/GTM practice site

A zero-backend static ecommerce demo created specifically for analytics practice.

## Run locally

You can simply open `index.html` in a browser.

For a more realistic local URL, from this folder run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages — easiest method

1. Create a new GitHub repository, for example `ga4-practice-site`.
2. Upload all files from this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**.
6. Save.
7. GitHub will show the published URL after deployment.

For a project repository, the URL is typically:

`https://YOUR-USERNAME.github.io/ga4-practice-site/`

The site uses only relative links, so it works under a project subpath.

## Recommended next step: GTM

Do **not** hardcode a GA4 Measurement ID in this starter. The learning task is to:

1. Create a GTM container.
2. Insert the GTM container snippets into these HTML pages.
3. Create a GA4 data stream.
4. Configure the Google tag / GA4 tag in GTM.
5. Use GTM Preview + GA4 DebugView.
6. Start with page views, then events, then ecommerce.

See `EVENT_MAP.md`.

## Resetting the demo

Cart and consent state are stored in browser `localStorage`.

Open DevTools Console and run:

```js
localStorage.removeItem('ga4_demo_cart');
localStorage.removeItem('ga4_demo_consent');
```

## Privacy

This site has no backend and collects nothing by itself. Do not put real personal data into analytics event parameters.
