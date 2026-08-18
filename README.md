# HVAC Customer Reviews — Shopify Section

A drop-in **Customer Reviews** section for Shopify product pages, built for HVAC storefronts. Ships as a Judge.me-compatible widget with a fully custom-branded UI, filtering, pagination, a write-a-review modal, a photo lightbox, and an accessible "no reviews yet" empty state.

> **Note on name:** the section is named `judgeme-reviews-section` because it was built as a drop-in replacement for the Okendo/Judge.me review widget. The design and all interactive logic are **fully custom** — the only external dependency is the Judge.me Shopify app for submitting/persisting reviews. Remove that dependency and the visual layer still renders (see *Standalone mode* below).

---

## What's in this repo

```
sections/
  judgeme-reviews-section.liquid   Full custom-branded review section (CSS + HTML + JS in one file)
snippets/
  judgeme-reviews.liquid           Minimal wrapper that renders Judge.me's own widget only
  judgeme-star-rating.liquid       Compact star badge for product cards (uses custom.product_reviews metafield)
```

Everything is self-contained Liquid — no external CSS, no external JS, no npm build step.

---

## Preview

Empty state (no reviews yet):

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Customer Reviews                          🛡  Verified Purchases Only  │
│  Real feedback from verified HVAC buyers                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┬───────────────────────────────────────────────────┐  │
│  │       —       │  5 ★  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  0% (0)     │  │
│  │  ☆ ☆ ☆ ☆ ☆   │  4 ★  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  0% (0)     │  │
│  │   out of 5    │  3 ★  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  0% (0)     │  │
│  │ No reviews yet│  2 ★  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  0% (0)     │  │
│  │               │  1 ★  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  0% (0)     │  │
│  └───────────────┴───────────────────────────────────────────────────┘  │
│                                                                         │
│              💬  No Reviews Yet                                         │
│      Be the first to share your experience with this product.           │
└─────────────────────────────────────────────────────────────────────────┘
```

Populated state adds: a customer-photos strip with lightbox, sort tabs (*Most Recent / Highest Rated*), a filter dropdown (stars + product-specific options like Tonnage / SEER2 for HVAC), individual review cards with verified-purchase badges, helpful/report actions, and pagination.

---

## Design system

| Token           | Value                                    | Used for                              |
| --------------- | ---------------------------------------- | ------------------------------------- |
| Primary brand   | `#1a4a80` / `#1e3a6e`                    | Summary card bg, modal headers, CTAs  |
| Accent yellow   | `#fcd34d` / `#fbbf24` / `#f59e0b`        | Star fills, rating bar fills          |
| Text primary    | `#0f172a`                                | Headings, review titles               |
| Text secondary  | `#64748b` / `#94a3b8`                    | Sub-labels, dates, meta               |
| Success green   | `#16a34a`                                | Verified Purchase badge               |
| Border          | `#e2e8f0`                                | Card outlines, dividers               |
| Font stack      | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| Radii           | `10px` (tiles) / `14px` (summary card) / `18px` (modals) |

All styles are scoped to `#jmr-{{ section.id }}` so they can't leak into other sections of the theme.

Responsive breakpoint: **749px**. Below that, the summary grid collapses to a single column and review cards reflow for mobile.

---

## Feature overview & logic

### 1. Rating summary (Liquid-computed)

The section pre-computes the star distribution and average rating in Liquid before rendering — no client-side math, no CLS from late updates.

```liquid
{%- for _rv_item in _meta_reviews -%}
  {%- assign _rv_stars = _rv_item.rating | plus: 0 -%}
  {%- case _rv_stars -%}
    {%- when 5 -%}{%- assign _sum_ct5 = _sum_ct5 | plus: 1 -%}
    ...
  {%- endcase -%}
{%- endfor -%}
{%- assign _pct5 = _sum_ct5 | times: 100.0 | divided_by: _total_reviews | round -%}
{%- assign _rating_sum = _w5 | plus: _w4 | plus: _w3 | plus: _w2 | plus: _sum_ct1 -%}
{%- assign _avg_rating = _rating_sum | times: 1.0 | divided_by: _total_reviews | round: 1 -%}
{%- assign _fg_width = _avg_rating | times: 20 | round -%}   {# 20% per full star #}
```

Native `<progress>` elements render the per-star bars — no custom widgets, works with default browser accessibility.

### 2. Empty state

When no reviews are available, the summary card shows an em-dash placeholder plus dimmed empty stars, and the body renders a dashed-border "No Reviews Yet" panel with the Judge.me review-widget mount point. This keeps the layout stable for both states (no CLS on late data load).

### 3. Sort + filter

* **Sort tabs**: *Most Recent* and *Highest Rated* — pure client-side re-order.
* **Filter dropdown**: accordion with three groups
  * *Filter by Stars* (1–5)
  * *Filter by Tonnage* — auto-generated from `product.options_with_values` when an option name contains `ton` or `capacity`
  * *Filter by SEER2* — auto-generated when an option name contains `seer`

The section auto-detects HVAC-specific options at render time:

```liquid
{%- for _opt in product.options_with_values -%}
  {%- assign _oname = _opt.name | downcase -%}
  {%- if _oname contains 'ton' or _oname contains 'capacity' -%}
    {%- assign _has_tonnage = true -%}
    {%- assign _tonnage_values = _opt.values -%}
  {%- endif -%}
  {%- if _oname contains 'seer' -%}
    {%- assign _has_seer2 = true -%}
    {%- assign _seer2_values = _opt.values -%}
  {%- endif -%}
{%- endfor -%}
```

Each review `<article>` carries `data-rating`, optional `data-tonnage`, and optional `data-seer2` attributes so filtering is a single-pass CSS-style selector match in JS.

### 4. Pagination

Reviews are grouped 4-per-page via a `data-page` attribute stamped at render time. Page count is derived by JS from the actual number of matching articles (so filtering also collapses the page count correctly).

### 5. Write-a-review modal

Radio-star input (reverse-flex trick so `:checked ~ label` styles the selected star and everything below), title + name + email + body fields, client-side validation, success confirmation panel. On submit, the payload is POSTed to Judge.me's public form endpoint:

```js
fetch('https://judge.me/api/v1/widgets/product_review', {
  method: 'POST',
  body: formData   // includes shop_domain, product_id, rating, title, body, email
});
```

No API token is used — this is Judge.me's public storefront form endpoint (the same one Judge.me's own widget uses). The shop domain comes from Shopify's public `{{ shop.permanent_domain }}` object.

### 6. Helpful / Report

* **Helpful** — increments a client-side vote, persists to `localStorage` under a per-section key. Purely UX-side; not synced back to Judge.me.
* **Report** — opens a modal with categorized reasons (spam, offensive, off-topic, other), records the reported state in `localStorage` and swaps the button to a "Reported" pill.

### 7. Photo lightbox

Any `product.images` on the page render as 160×160 tiles. Clicking opens a full-screen lightbox with prev/next navigation, keyboard controls (`←` / `→` / `Esc`), and a `1 / N` counter. Purely self-contained — no lightbox library.

### 8. Accessibility

* All interactive controls are real `<button>` / `<a>` elements
* Progress bars use native `<progress>` for AT support
* Modal overlays trap `Escape` and click-outside dismissal
* All icons are inline SVG with `aria-hidden="true"`
* Star ratings expose `aria-label="X out of 5 stars"`
* Focus ring styles inherit from the browser default (no `outline: none` regressions)

---

## Installation

### Prerequisites
* A Shopify theme (Online Store 2.0 or Dawn-based)
* *Optional but recommended:* the [Judge.me Product Reviews app](https://apps.shopify.com/judgeme) installed on the store — the section will auto-mount its widget for submission flow

### Steps

1. Copy `sections/judgeme-reviews-section.liquid` into your theme's `sections/` folder.
2. Copy the two files in `snippets/` into your theme's `snippets/` folder (optional — only needed if you also want the card-level star badge or a minimalist Judge.me-only variant).
3. In the Shopify theme editor, open a product template, click **Add section**, and pick **Judge.me Reviews**.
4. In the section settings, toggle **Show reviews section** on (it's off by default so the section stays dormant until you're ready to launch).
5. Publish.

### Section settings

| Setting                       | Type      | Default | Purpose                                             |
| ----------------------------- | --------- | ------- | --------------------------------------------------- |
| Show reviews section          | checkbox  | `false` | Master on/off (kill switch)                         |
| Show 'Write a Review' button  | checkbox  | `true`  | Hide the CTA row if you're not accepting reviews yet|
| Top padding                   | range     | 36 px   | Vertical spacing above the section                  |
| Bottom padding                | range     | 36 px   | Vertical spacing below the section                  |

---

## Standalone mode (no Judge.me)

The section will render its full custom UI with **no external app** installed. In that mode:

* The rating summary, filters, pagination, review cards, and photo lightbox all work as-is
* The "Write a Review" modal will POST to `judge.me/api/v1/widgets/product_review` — if you have no Judge.me account this will fail silently on the network layer; hide the CTA via the `Show 'Write a Review' button` setting to avoid a broken flow
* Reviews are read from a Shopify metafield (`custom.product_reviews`) — populate that metafield with an array of `{ initials, name, location, rating, title, body, date, helpful }` objects to render your own content, or leave the fallback hardcoded review set in place

To wire your own review backend, replace the fetch URL in the write-review submit handler and adjust the payload shape to match your endpoint.

---

## What's *not* included

* **No API keys, tokens, or credentials of any kind.** All Judge.me widget hooks use the merchant's own public `shop.permanent_domain` — safe to commit.
* **No customer PII.** The hardcoded fallback review set uses first names + US-state locations only, mirroring what a public storefront would display.
* **No pricing / product data.** The template reads whatever `product` context it's rendered in.
* **No analytics / tracking scripts.**

---

## Browser support

Tested on evergreen Chrome, Firefox, Safari, and Edge. `<progress>` element styling uses vendor prefixes for WebKit/Blink and Gecko. No polyfills required.

---

## License

MIT — do whatever you like. Attribution appreciated but not required.
