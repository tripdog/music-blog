# Signal & Noise: Project TODO

_Last updated: 2026-06-05_

Working doc for the Astro music blog. Grouped by effort and dependencies. Check items off as PRs merge to main.

---

## Today's targets

### Quick wins (small, isolated PRs)
- [ ] **Bug 1: Move the About page byline.** Pull `TOM PHILLIPS. SAN DIEGO. EST. 2026.` up so it sits above the "how it works" module. Pure markup reorder, no logic.
- [ ] **Bug 2: Orange background on "how it works".** Swap the current dark background for an amber/orange so it contrasts the black footer. Set it as a token (reuse the CCI amber range) rather than a one-off hex, so it stays on-system.

### Content-collection pair (build these together, shared sort logic)
- [ ] **Feature 3: Link "Latest" nav item to the newest feature post.** Query the posts collection, sort by date desc, grab the first entry, point the nav link at its slug.
- [ ] **Build 3: Archive page (chronological).** WordPress-style list of all articles, newest first. Reuse the same sort helper from Feature 3. Write the sort once, use it in both places.

### Layout (own PR, decision confirmed)
- [ ] **Bug 3: Sticky footer group, global.** Classic sticky-footer pattern (sits at viewport bottom on short pages, pushed down on long ones). The how-it-works module, subscribe module, and footer all ride together at the bottom as one group.
  - Pattern (lives in the base layout):
    ```css
    body { min-height: 100vh; display: flex; flex-direction: column; }
    main { flex: 1 0 auto; }        /* page content grows, pushes group down */
    .site-footer-group { flex-shrink: 0; }  /* how-it-works + subscribe + footer */
    ```
  - Confirm the how-it-works + subscribe + footer are wrapped in one container in the layout so they stay grouped.

---

## Blocked / needs input

- [ ] **Feature 1: Wire up subscribe module to Beehiiv.** Fast once I have the embed snippet (or API key) and which list/publication to point at. _Need: Beehiiv embed code or API details._
- [ ] **Feature 2: Add missing images to the feature article.** _Need: the article title (got cut off), plus the assets or a green light to generate them in the no-text, mid-century style._
- [ ] **Build 1: Contact page.** Form decision overlaps with how we handle Beehiiv/email, so cleaner to do after that's settled.

---

## Needs design / ideation before build

- [ ] **Build 2: Genres landing page.** Starter section ideas to react to:
  1. **Genre grid.** Cards for Punk, Reggae, Metal, Goth, Other. Each card = entry point with a post count.
  2. **Short editorial intro per genre.** A few lines in your voice on why the genre matters and your relationship to it.
  3. **Gateway records.** A "start here" pick or two per genre for newcomers.
  4. **Latest in each genre.** Most recent post per genre surfaced on the card.
  5. **"Never got their fair hearing."** A cross-genre rail of underrated picks, ties straight back to the About copy.
  - Decide which sections make the cut, then build.

---

## Carryover (fill at end of day)

_Anything not finished today moves here so it tracks in version control instead of the chat._

- [ ] ...

---

## Decisions log

- **2026-06-05:** Footer = classic sticky pattern (bottom of viewport on short pages, pushed down on long ones), NOT fixed/always-visible. How-it-works + subscribe + footer grouped together at the bottom.
- **2026-06-05:** "How it works" background to be a reusable orange/amber token, not a one-off value.
