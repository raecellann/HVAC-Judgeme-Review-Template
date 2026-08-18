# Frontend Preview — HVAC Judge.me Review Section

A **static, zero-dependency preview** of the [HVAC Judge.me Review Section](../README.md). Open it in a browser to see exactly how the review widget looks and behaves on a live product page — no Shopify store, no Judge.me account, no build step required.

The preview is deliberately built to be uploaded to a plain static host (this repo targets **Render** since GitHub Pages was not usable for this project).

---

## What this folder contains

```
frontend/
  index.html   Mock storefront + product panel + full review section
  styles.css   Complete stylesheet (mirrors the CSS in the Liquid section)
  script.js    Filter, sort, pagination, modals, lightbox, localStorage state
  README.md    This file
```

Everything is plain HTML/CSS/vanilla JS. No frameworks, no bundler, no server code, no external CDN requests.

---

## What the preview shows

The `index.html` file renders a realistic HVAC product page (Goodman condenser mock) so the review block is displayed in a context that matches the real Shopify environment:

- **Rating summary card** — big number, star display, per-star progress bars with counts and percentages
- **Customer photos row** with a **lightbox** (prev / next, keyboard arrows, `Esc` to close, `1 / N` counter)
- **Sort tabs** — *Most Recent* and *Highest Rated* (actually re-orders the DOM)
- **Filter dropdown** — accordion with *Stars*, *Tonnage*, and *SEER2* groups (the real HVAC filters from the Liquid section)
- **18 review cards** with verified-purchase badges, avatars, "Purchased" / "Installed in" lines, and full copy
- **Pagination** at 4 per page, driven by the actual filtered/sorted results
- **Helpful button** — toggleable vote, count updates, state persisted in `localStorage`
- **Report button** — opens a reason modal, records the reported state in `localStorage` and swaps the button to a "Reported" pill
- **Write a Review modal** — reverse-flex star radio input, name / email / title / body fields, client-side validation, success confirmation panel (submission is stubbed in this preview — the real Liquid section POSTs to Judge.me)
- **Fully responsive** — the summary grid collapses on mobile, filter tabs scroll horizontally, review cards reflow

---

## Preview locally

Any static HTTP server works. Two easy options:

**Python (already installed on most machines):**

```bash
cd frontend
python -m http.server 8080
# then open http://localhost:8080
```

**Node.js:**

```bash
npx serve frontend
```

You can also just **double-click `index.html`** to open it via `file://` — everything works from the local filesystem, including `localStorage`, the modals, and the lightbox.

---

## Deploy to Render

The frontend is a **plain static site**, so it deploys as a Render **Static Site** service (no build server needed, always free tier).

1. Push this repository to GitHub / GitLab / Bitbucket (or connect the local one directly).
2. In the [Render dashboard](https://dashboard.render.com/), click **New +** → **Static Site**.
3. Select this repository.
4. Fill in the deploy settings:

   | Field                | Value        |
   | -------------------- | ------------ |
   | **Name**             | anything (e.g. `hvac-reviews-preview`) |
   | **Branch**           | `main`       |
   | **Root Directory**   | *(leave blank)* |
   | **Build Command**    | *(leave blank — no build step)* |
   | **Publish Directory**| `frontend`   |

5. Click **Create Static Site**.

Render will pull the repo, publish everything under `frontend/`, and give you a public HTTPS URL like `https://hvac-reviews-preview.onrender.com/`. Every push to the branch triggers an auto-redeploy.

**Custom domain:** set it under the service's *Settings → Custom Domains*.

**Optional — commit a `render.yaml`** at the repo root so the settings are stored as code (skip the dashboard form on next re-create):

```yaml
services:
  - type: web
    name: hvac-reviews-preview
    runtime: static
    buildCommand: ""
    staticPublishPath: ./frontend
    pullRequestPreviewsEnabled: true
```

---

## Install the actual Shopify section on another store

The preview mimics the design; the real thing lives in [`../sections/judgeme-reviews-section.liquid`](../sections/judgeme-reviews-section.liquid) and [`../snippets/`](../snippets/).

### Prerequisites

- A Shopify theme built on **Online Store 2.0** (Dawn, Sense, Refresh, or any modern theme with section groups). Legacy vintage themes need JSON templates first.
- *Optional but recommended:* the [Judge.me Product Reviews app](https://apps.shopify.com/judgeme) installed on the store. Without it, the visual layer still renders — only the "Write a Review" submission stops persisting (see the *Standalone mode* section in the [main README](../README.md)).

### Steps

1. **Open your theme's code editor:** Shopify Admin → **Online Store** → **Themes** → **⋯** on your theme → **Edit code**.

2. **Copy the section file:**
   - In the code editor's file tree, click **Add a new section** under `sections/`.
   - Name it exactly `judgeme-reviews-section` (Shopify appends `.liquid` automatically).
   - Paste the full contents of [`../sections/judgeme-reviews-section.liquid`](../sections/judgeme-reviews-section.liquid).
   - **Save**.

3. **Copy the snippets** (optional — only needed if you also want the card-level star badge or a minimalist Judge.me-only variant):
   - Under `snippets/`, click **Add a new snippet**, name it `judgeme-reviews`, paste [`../snippets/judgeme-reviews.liquid`](../snippets/judgeme-reviews.liquid), save.
   - Repeat for `judgeme-star-rating` from [`../snippets/judgeme-star-rating.liquid`](../snippets/judgeme-star-rating.liquid).

4. **Add the section to your product page:**
   - Shopify Admin → **Online Store** → **Themes** → **Customize** on your theme.
   - Switch the page dropdown at the top to **Products → Default product**.
   - Under the section list on the left, click **Add section** and pick **Judge.me Reviews**.
   - Drag it to where you want it (usually below the product info block).

5. **Turn on the section** (it ships off by default so it stays dormant until you're ready to launch):
   - Click the section in the customizer.
   - Check **Show reviews section**.
   - Tweak *Show 'Write a Review' button*, top/bottom padding as needed.
   - **Save**.

6. **Preview** the product page. You should see the exact layout from this frontend demo, now populated with your real `product`, `product.images`, and `product.options_with_values`.

### Section settings reference

| Setting                       | Type      | Default | Purpose |
| ----------------------------- | --------- | ------- | ------- |
| Show reviews section          | checkbox  | `false` | Master on/off (kill switch) |
| Show 'Write a Review' button  | checkbox  | `true`  | Hide the CTA row if you're not accepting reviews yet |
| Top padding                   | range     | 36 px   | Vertical spacing above the section |
| Bottom padding                | range     | 36 px   | Vertical spacing below the section |

### HVAC-specific filters

The **Tonnage** and **SEER2** filters auto-appear when the product has a variant option whose name contains `ton` / `capacity` (for tonnage) or `seer` (for SEER2). Rename your product options accordingly (e.g. "Tonnage" and "SEER2 Rating") and the filters populate automatically. On non-HVAC products the filter dropdown falls back to just the star-rating filter.

### Populating reviews from a metafield

To render your own review dataset instead of the fallback hardcoded set, populate the product metafield `custom.product_reviews` as a list of objects:

```json
[
  { "initials": "JD", "name": "Jane Doe", "location": "Texas",
    "rating": 5, "title": "Excellent",
    "body": "Cools the whole house in minutes.",
    "date": "March 4, 2026", "helpful": 12 }
]
```

The Liquid section detects this metafield and renders it dynamically (pre-computing the star distribution and average rating server-side to avoid CLS).

---

## Preview vs. real Shopify section — differences

The frontend demo is faithful to the design and every interactive behavior, with two intentional deviations that only exist because there's no Shopify runtime behind it:

| Behavior | Preview (this folder) | Real Shopify section |
| -------- | --------------------- | -------------------- |
| Product data (title, images, variants) | Hardcoded Goodman mock | Reads `product` / `product.variants` / `product.images` from Shopify |
| Customer photos | CSS-gradient placeholder tiles | Real `product.images` rendered with `image_url` |
| Star distribution and average | Hardcoded 4.9 / 18 reviews | Pre-computed in Liquid from `custom.product_reviews` metafield |
| "Write a Review" submission | Stubbed with a 500 ms delay + success panel | POSTs to `https://judge.me/api/v1/reviews` with real `shop.permanent_domain` and `product.id` |
| Judge.me widget mount | Not rendered | `<div class="jdgm-widget">` auto-mounts the Judge.me submission widget |
| Geo-aware "Installed in: …" location | Static per-review value | Overridden by a `hvac:geo-change` event dispatched elsewhere in the theme |
| Helpful / Report state | `localStorage` (same as real section) | `localStorage` (same as real section) |

Everything else — the design, breakpoints, sort/filter/pagination logic, modal interactions, lightbox controls, accessibility affordances — is a 1:1 port.

---

## License

MIT — same as the main repository.
