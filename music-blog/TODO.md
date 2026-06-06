# Signal & Noise: Project TODO

*Last updated: 2026-06-06 (sticky footer shipped; PR #5 finally merged after sitting open)*

Working doc for the Astro music blog. Grouped by effort and dependencies.

-----

## Shipped

### Sticky footer (PR #7, ready to merge)

- [x] Global flex sticky footer: `body` is a flex column, `main` is `flex: 1 0 auto`. Keyed on a top-level `<main>`, so it works on every page, not just the homepage.
- [x] `[...slug].astro` post wrapper renamed from `<div class="post-page">` to `<main class="post-page">`. It was the only page missing a real `main`, which is why the footer wouldn't stick on short posts. Also a free accessibility win (every page should have a `main` landmark).
- [x] `.gitignore` added to ignore `.claude/settings.local.json`, which stops the recurring local-settings leak into worktrees. Confirmed tracked via `git ls-files .gitignore` (proof, not summary).
- [ ] **Merge PR #7** (squash, delete the `emdash/sticky-footer-taks-vslf3` branch), then refresh the parent: `git -C /Users/tomphillips/music-blog pull`.

Reality check vs. the original plan: the first plan assumed a shared layout footer group and a `.site-footer-group` wrapper around how-it-works + subscribe + footer. That was wrong. `BaseLayout.astro` is a bare shell (`<body><slot /></body>`), each page composes its own structure, how-it-works lives on the About page (not the footer), and the bottom group is just NewsletterSection + SiteFooter on the homepage. The wrapper turned out unnecessary. The sticky behavior is pure global CSS on `main`. The `<main>` audit confirmed index, about, archive, and category already use a top-level `main`, so `[...slug].astro` was the only rename needed.

### About byline + how-it-works background (PR #5, merged 2026-06-06)

- [x] Move the About page byline above the "how it works" module
- [x] Orange background on "how it works" (token-driven; eyebrow/heading/body flipped for contrast; eyebrow set to white as a deliberate call)
- [x] **CORRECTION:** this PR was NOT merged on 6-05, despite the old entry here claiming "merged + deployed." It sat OPEN until 6-06. The "byline regression" we chased during the sticky-footer work was actually this fix never having shipped at all (production was serving the un-fixed page). Now merged, squashed as `b595440`.

### Latest + Archive feature (PR #6, merged 2026-06-06, `e11c1af`)

- [x] `getAllPosts()` helper in `src/lib/posts.ts` (blog collection, sorted by `pubDate` descending)
- [x] `getLatestPost()` helper (most recent `featured: true` post, returns undefined if none)
- [x] "Latest" nav wired to newest featured post, desktop and mobile, falls back to `/#latest` if none
- [x] `/archive` page: chronological post list, WordPress-style, matches About tokens, empty state handled, mobile breakpoint at 639px
- [x] "Archive" link added to both navs
- [x] Merged and deployed.

-----

## Next up

### Media embeds: Apple Music + YouTube (decision made, ready to build)

Reference: Letters From A Tapehead monthly playlist posts (Apple Music + YouTube + Bandcamp iframes). Every embed is a plain iframe. No API, no server-side, no infra change on Cloudflare Pages.

**Decision: implement in the EXISTING post type, not a new collection.** The roundup look lives in the MDX body (embeds + track list), so the template barely changes and Latest, Archive, and RSS keep working for free.

- [ ] **Prereq: enable MDX** if it isn't already: `npx astro add mdx`. Embeds go in `.mdx` post bodies as components.
- [ ] **Component: `AppleMusic.astro`.** Wraps the embed.music.apple.com iframe. Prop `src` (full embed URL from Apple's Share > Embed), optional `height` (450 for a playlist/album, 175 for a single track). Set `loading="lazy"`, max-width 660px, rounded corners.
- [ ] **YouTube: use `@astro-community/astro-embed-youtube`** (`npm i @astro-community/astro-embed-youtube`), NOT a hand-rolled iframe. It lazy-loads (thumbnail until click), which is the whole point on a post stacked with embeds. Prop `id` (video id, or `videoseries?list=...` for a playlist).
- [ ] **Schema: make `rating` optional.** A roundup has no single skull score. `rating: z.number().min(0).max(5).optional()`.
- [ ] **Schema: add a `format` discriminator.** `format: z.enum(['review', 'playlist']).default('review')`. Lets the layout branch now and lets us filter on it later.
- [ ] **Layout: skip the skull component when there's no rating.** `{post.data.rating != null && <SkullRating value={post.data.rating} />}`. Optional: small "Playlist" badge when `format === 'playlist'`.
- [ ] **DECIDE: genre-pill behavior for roundups.** Options: (a) allow an array of genres, (b) add a MIXED / PLAYLIST pill, (c) just show the series name. Small design call, make it on purpose.
- [ ] **Sample post.** Build one `.mdx` roundup that exercises all of the above end to end.

Suggested as ONE Emdash branch: schema change + layout conditionals + both components + sample post.

Revisit a separate post type later only if the roundup series grows its own identity (dedicated landing page, distinct archive card, own feed). Starting with the flag doesn't lock that out, and migrating later is cheap.

### Blocked on input

- [ ] **Feature 1: Beehiiv subscribe wiring.** Need the embed snippet (or API key) and which publication/list.
- [ ] **Feature 2: Missing feature-article images.** Need the article title (got cut off originally) and the assets, or a green light to generate in the no-text mid-century style.

### Deferred / needs design

- [ ] **Build 1: Contact page.** Cleaner after the Beehiiv/email decision since the form approach overlaps.
- [ ] **Build 2: Genres landing page.** Starter section ideas:
1. Genre grid (Punk, Reggae, Metal, Goth, Other) with post counts
1. Short editorial intro per genre in your voice
1. Gateway/"start here" records per genre
1. Latest post per genre on each card
1. "Never got their fair hearing" cross-genre rail of underrated picks (ties to About copy)

-----

## Small polish (low priority)

- [ ] Archive hero h1 currently reads "Every post, newest first." Consider a voicier rewrite to match the About hero.
- [ ] Confirm the archive date format (`Jan 12, 2026`) matches how dates render on individual post pages.

-----

## Housekeeping debt

- [ ] **`/blog` route cleanup.** `blog/index.astro` is a leftover Astro starter page: its own `<html>`/`<body>` shell, the old Header/Footer components, not on the design system at all, currently live at `/blog`. Replace it with a redirect `/blog` to `/archive` (one line in `astro.config` redirects), since `/archive` serves the same purpose. Do NOT just delete it (that leaves `/blog` as a 404).
- [ ] **Clean up the `archive-page` worktree** (`.../emdash/archive-page-smjds`). Its work is merged (PR #6), so it's done. NOTE: this is the leftover worktree the sticky-footer work accidentally landed in today, which kicked off the whole afternoon's confusion. Retire it.
- [ ] **Stale `implement-homepage-design` worktree:** 8 uncommitted leftover files (settings.local.json, Masthead.astro, [...slug].astro, index.astro, global.css, plus SVGs/components). Decide keep vs. discard, then clean up. (The settings.local.json part is now covered by the new `.gitignore` going forward, but these specific leftovers still need a call.)

-----

## Emdash / git workflow (corrected the hard way, 2026-06-06)

Today burned a lot of cycles on worktree and branch confusion. These are the rules that actually hold:

- **`main` cannot be checked out in a worktree.** It is pinned to the parent repo at `/Users/tomphillips/music-blog`. The old "`git checkout main && git pull` before branching" ritual FAILS inside a worktree (exit 128, "main is already used by worktree"). The real refresh-main step is just pulling in the parent: `git -C /Users/tomphillips/music-blog pull`.
- **Always start new work through Emdash's new-task UI**, which cuts a fresh worktree off the current parent main. Do NOT reuse a leftover worktree. Today's footer work landed in the old archive worktree and was one keystroke from being committed onto the wrong branch.
- **Before starting, read the worktree path in the prompt.** It is printed in every `Bash(git -C ...)` call. Confirm it is the NEW task's worktree, not a leftover one.
- **Trust the rendered page over git inference.** Twice today the assistant concluded "you're not missing anything" from a short commit log while the page showed otherwise. The render (and production) is ground truth. The byline "regression" was really an unshipped PR.
- **Stage deliberately. Never `git add .`** in these worktrees, or `.claude/settings.local.json` (and other local cruft) rides along. The new `.gitignore` blocks that file going forward, but the habit stands.
- **Confirm fixes by proof, not by summary.** Use `git ls-files <file>` to confirm something is tracked, and the actual render to confirm a visual fix. End-of-turn summaries occasionally rationalized a loose end ("intentionally excluded") instead of closing it.

-----

## Decisions log

- **2026-06-06:** PR #5 (About byline + how-it-works orange) was never merged on 6-05; it sat open until today. The old "merged + deployed" note here was wrong and sent us chasing a phantom regression. Now merged (`b595440`). Lesson logged in the workflow section above.
- **2026-06-06:** Sticky footer = pure global CSS keyed on a top-level `<main>` (`body` flex column + `main { flex: 1 0 auto }`), NOT a `.site-footer-group` wrapper. `BaseLayout` is a bare shell; each page composes its own structure; how-it-works lives on About, not the footer.
- **2026-06-06:** Post pages now use `<main class="post-page">` instead of a `<div>`, so they get the sticky rule and a proper landmark.
- **2026-06-06:** `.gitignore` now ignores `.claude/settings.local.json` to stop the recurring local-settings leak into commits/worktrees.
- **2026-06-06:** Media embeds (Apple Music, YouTube) are plain iframes. No API, no server-side, no infra change on Cloudflare Pages.
- **2026-06-06:** Embeds go in the EXISTING post type via a `format` flag, NOT a new collection. Keeps Latest/Archive/RSS working for free. Revisit a separate type only if the roundup series grows its own identity.
- **2026-06-06:** `rating` becomes optional so roundup/playlist posts can skip the skull score (layout renders skulls only when a rating is present).
- **2026-06-06:** YouTube embeds use `@astro-community/astro-embed-youtube` (lazy-loads thumbnail until click) for performance; Apple Music uses a simple lazy iframe wrapper. Performance, not feasibility, is the real consideration on embed-heavy posts.
- **2026-06-05:** Footer = classic sticky pattern (bottom of viewport on short pages, pushed down on long), NOT fixed/always-visible. (Implementation detail corrected 6-06: see above, no wrapper needed.)
- **2026-06-05:** "How it works" background = reusable orange token. Eyebrow set to white (deliberate, confirmed legible).
- **2026-06-05:** "Latest" nav = most recent `featured: true` post only (not any post). Falls back gracefully when no featured post exists.
- **2026-06-05:** Blog collection is named `blog` (not `posts`); date field is `pubDate` (not `date`). Post URLs are `/blog/<entry.id>`.
- **2026-06-05:** Sort logic lives once in `getAllPosts()`; Latest and Archive both build on it.
- **2026-06-05 (workflow, SUPERSEDED 6-06):** Old note said "`git checkout main && git pull` before cutting a new branch." That does not work in a worktree. See the corrected workflow section above: pull the parent, and let Emdash create the worktree off current main.
