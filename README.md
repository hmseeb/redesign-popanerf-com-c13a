# Pop-A-Nerf Entertainment — Website Redesign

A complete, from-scratch redesign of the Pop-A-Nerf Entertainment site — a mobile
Nerf war arena business that builds a fully enclosed battle arena at the
customer's location.

**Design direction:** modern, bold, high-energy. Dark tactical base, oversized
condensed display typography, Nerf-orange / electric-lime accent palette, a
scrolling venue ticker, animated stat counters and an interactive group-size
pricing calculator.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies, no external
APIs and no environment variables.

```
index.html    entry point — all page content, meta tags, JSON-LD
styles.css    design system (tokens, components, responsive layers)
script.js     nav, scroll reveal, stat counters, pricing calculator
```

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Sections

- Hero — business name, tagline and the four headline stats
- The Experience — enclosed arena, stocked armory, dedicated referee, any location
- Where We Play — Parks, Back Yards, Corporate Events, Youth Groups galleries
- What's Included — the full Standard Event Package checklist
- Pricing — all published tiers plus a live group-size calculator
- Upgrades — all thirteen published add-ons with real pricing
- Reviews — link to the business's Google reviews
- Contact — phone, online booking, contact form, service area, Spanish site

## Content & imagery

All copy, pricing and contact details come from the existing Pop-A-Nerf
Entertainment site. Every photograph is an original image from that site —
the company logo, real arena builds at parks, backyards, corporate events and
youth-group events, and the company's own upgrade promo artwork. No stock
photography was substituted, because none of the source imagery was stock.

**Phone:** 786-671-NERF (786-671-6373)

**Service area:** Tampa Bay, Florida — fully mobile, we come to you.

## Accessibility

Semantic landmarks, skip link, labelled navigation, visible focus rings,
descriptive alt text on every image, `aria-expanded` on the mobile menu and
full `prefers-reduced-motion` support (reveals, counters, ticker and smooth
scrolling all stand down).
