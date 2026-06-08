# Signal & Noise: Project TODO

*Last updated: 2026-06-08 (favicon, OG tags, and meta descriptions shipped; decisions log updated)*

Working doc for the Astro music blog. Grouped by effort and dependencies.

-----

## Shipped

### Media embeds capability (PR #8, merged 2026-06-07)

Any post can now embed an Apple Music player or a YouTube video. This is purely a capability: no schema change, no new collection, no new post type. Import the component in an `.mdx` post body and use it.

- [x] MDX and the `**/*.{md,mdx}` collection glob were ALREADY in place, so the planned "enable MDX" step was a no-op (good surprise).
- [x] `AppleMusic.astro` component. Props: `src` (full `embed.music.apple.com` URL) and optional `height` (default 450). Lazy iframe, max-width 660px, 12px radius, correct allow/sandbox attributes, no external script.
- [x] `@astro-community/astro-embed-youtube` installed. Use `<YouTube id="..." />` directly in post bodies (it lazy-loads a thumbnail until click). No wrapper component needed.
- [x] Embed/content spacing fix in `[...slug].astro`: `.post-prose > :global(*) { margin-bottom: 1.5rem }` plus a `:last-child` reset. Root cause was flush sibling embeds touching edge to edge (iframe + lite-youtube), NOT a height collapse. The general direct-child rule spaces all current and future embeds and content consistently.
- [x] Verified on the rendered page (YouTube plays, spacing clean). Throwaway test post deleted before the PR.

**Usage for real posts:**
- Apple Music: in the Music app or web player, Share > Embed, copy the `embed.music.apple.com` URL into `<AppleMusic src="..." />`. Use `height={175}` for a single track, leave default for an album/playlist.
- YouTube: the `id` is the part after `watch?v=` (or `videoseries?list=...` for a playlist).

**Still untested (low risk):** a LIVE Apple Music player was never confirmed in-render. We tested with a placeholder URL and confirmed YouTube + spacing. The component is a standard iframe with correct attributes, so risk is low, but the first real `embed.music.apple.com` URL you drop into a post is the final confirmation. Worth a glance the first time you use it for real.

### Sticky footer (PR #7, merged 2026-06-06)

- [x] Global flex sticky footer: `body` is a flex column, `main` is `flex: 1 0 auto`. Keyed on a top-level `<main>`, so it works on every page, not just the homepage.
- [x] `[...slug].astro` post wrapper renamed from `<div class="post-page">` to `<main class="post-page">`. It was the only page missing a real `main`, which is why the footer wouldn't stick on short posts. Also a free accessibility win (every page should have a `main` landmark).
- [x] `.gitignore` added to ignore `.claude/settings.local.json`, which stops the recurring local-settings leak into worktrees. Confirmed tracked via `git ls-files .gitignore` (proof, not summary).
- [x] Merged via the GitHub API (`gh pr merge` fails in the worktree layout). Branch retired.

Reality check vs. the original plan: the first plan assumed a shared layout footer group and a `.site-footer-group` wrapper. That was wrong. `BaseLayout.astro` is a bare shell (`<body><slot /></body>`), each page composes its own structure, how-it-works lives on the About page (not the footer), and the bottom group is just NewsletterSection + SiteFooter on the homepage. The wrapper turned out unnecessary. The sticky behavior is pure global CSS on `main`. The `<main>` audit confirmed index, about, archive, and category already use a top-level `main`, so `[...slug].astro` was the only rename needed.

### About byline + how-it-works background (PR #5, merged 2026-06-06)

- [x] Move the About page byline above the "how it works" module
- [x] Orange background on "how it works" (token-driven; eyebrow/heading/body flipped for contrast; eyebrow set to white as a deliberate call)
- [x] **CORRECTION:** this PR was NOT merged on 6-05, despite the old entry once claiming "merged + deployed." It sat OPEN until 6-06. The "byline regression" chased during the sticky-footer work was actually this fix never having shipped at all (production was serving the un-fixed page). Now merged, squashed as `b595440`.

### Favicon (PR #14, merged 2026-06-08)

- [x] All favicon files (ICO, PNG sizes, apple-touch-icon, android-chrome, site.webmanifest) copied to `/public` and wired into `BaseHead.astro`.

### Open Graph tags + meta description audit (PR #15, merged 2026-06-08)

- [x] `og:type`, `og:title`, `og:description`, `og:image`, `og:url`, and `twitter:card` added to `BaseHead.astro`. Default OG image at `/public/og-image.jpg` (committed directly to main after PR #15 merged).
- [x] Per-post pages override `og:image` with `heroImage` if present, falling back to `/og-image.jpg`. Wired in `[...slug].astro`.
- [x] `canonicalURL` prop added to `BaseHead` and forwarded through `BaseLayout`; each page computes and passes its own canonical URL explicitly.
- [x] All 6 pages (index, about, archive, genres, contact, `[...slug]`) now pass unique, explicit descriptions to `BaseHead`. Generic placeholder descriptions on `about` and `contact` replaced.

### Beehiiv newsletter embed (PR #13, merged 2026-06-08, `e49d215`)

- [x] Replaced static `<form>` + dead submit handler in `NewsletterSection.astro` with the live Beehiiv embed scripts (`loader.js` + `attribution.js`), using `is:inline` so Astro doesn't bundle them.
- [x] Removed all `.newsletter__form`, `.newsletter__input`, `.newsletter__btn` styles. Added `.newsletter__embed` container with matching width/responsive behaviour.
- [x] Added `:global()` CSS to constrain the injected iframe to `max-width: 100%` and `background: transparent`.
- [x] Footer has no newsletter signup — no footer changes needed.
- [x] Stale remote branches (`emdash/build-contact-page-xiz82`, `emdash/genres-landingpage-build-o9yvy`, `emdash/connect-newsletter-form-tbkfq`) deleted via API after merge.

### Contact page (PR #12, merged 2026-06-08)

- [x] `/contact` page with Web3Forms-powered email form, social icon links, and nav link added to Header.
- [x] Nav link wired in both desktop and mobile nav.

### Homepage post card grid gutter (PR #11, merged 2026-06-08)

- [x] Added 20px gutter to the homepage post card grid.

### Genres landing page (PR #10, merged 2026-06-08)

- [x] `/genres` page listing all genre categories with post counts.
- [x] Genres link added to nav.

### Latest + Archive feature (PR #6, merged 2026-06-06, `e11c1af`)

- [x] `getAllPosts()` helper in `src/lib/posts.ts` (blog collection, sorted by `pubDate` descending)
- [x] `getLatestPost()` helper (most recent `featured: true` post, returns undefined if none)
- [x] "Latest" nav wired to newest featured post, desktop and mobile, falls back to `/#latest` if none
- [x] `/archive` page: chronological post list, WordPress-style, matches About tokens, empty state handled, mobile breakpoint at 639px
- [x] "Archive" link added to both navs
- [x] Merged and deployed.

-----

## Next up

### Content

- [ ] **Write new posts.** Need at least one post per genre category to populate the genres landing page. Current featured post is the model. Goal: one solid review per genre before treating the blog as live.

### Roundup post format (PARKED: build only when you want LFAT-style roundups)

This is NOT the embed capability (that shipped in #8). This is the separate question of supporting a roundup-style post: many tracks, no single skull rating, spans every genre at once (think Letters From A Tapehead's monthly "Sorting Through Browser Tabs"). Only build this when you actually decide to publish that format. No new collection needed, just flags on the existing post type.

- [ ] **Schema: make `rating` optional.** `rating: z.number().min(0).max(5).optional()`, so a roundup can skip the skull score.
- [ ] **Schema: add a `format` discriminator.** `format: z.enum(['review', 'playlist']).default('review')`. Lets the layout branch and lets you filter later.
- [ ] **Layout: skip the skull component when there's no rating.** `{post.data.rating != null && <SkullRating value={post.data.rating} />}`. Optional small "Playlist" badge when `format === 'playlist'`.
- [ ] **DECIDE: genre-pill behavior for an everything-spanning post.** Options: (a) single "Playlist" pill (recommended: cleanest fit with the existing GOTH/PUNK/REGGAE/METAL/OTHER pills, signals "roundup" at a glance, avoids a wall of pills), (b) array of all genres covered, (c) show the series name instead. Left open; decide when you build this.
- [ ] **Sample roundup post** to exercise the above end to end.

Revisit a separate post type only if the roundup series grows its own identity (dedicated landing page, distinct archive card, own feed). The flag approach doesn't lock that out, and migrating later is cheap.

### Blocked on input

- [ ] **Feature: Missing feature-article images.** Need the article title (got cut off originally) and the assets, or a green light to generate in the no-text mid-century style.

### Deferred / needs design

- [ ] **Genres landing page: enrich per-genre cards.** The page shipped with genre list + post counts (#10). Potential next layers:
  1. Short editorial intro per genre in your voice
  1. Gateway/"start here" records per genre
  1. Latest post per genre on each card
  1. "Never got their fair hearing" cross-genre rail of underrated picks (ties to About copy)

-----

## Small polish (low priority)

- [x] Archive hero copy — keeping "Every post, newest first." as-is, no change needed.
- [x] Archive date format confirmed consistent with post pages.

-----

## Housekeeping debt

- [x] **`/blog` route cleanup.** Redirects `/blog` to `/archive` via `astro.config.mjs`. Stale starter page deleted. (PR #9, merged 2026-06-07)
- [x] **Retire spent remote branches.** All merged emdash branches deleted via `gh api … -X DELETE` after each PR merge. `main` is the only branch on remote as of 2026-06-08.
- [x] **Stale `implement-homepage-design` worktree** — resolved, clean.

-----

## Emdash / git workflow (corrected the hard way during the 2026-06-06 session)

That session burned a lot of cycles on worktree and branch confusion. These are the rules that actually hold:

- **`main` cannot be checked out in a worktree.** It is pinned to the parent repo at `/Users/tomphillips/music-blog`. The old "`git checkout main && git pull` before branching" ritual FAILS inside a worktree (exit 128, "main is already used by worktree"). The real refresh-main step is just pulling in the parent: `git -C /Users/tomphillips/music-blog pull`.
- **`gh pr merge` also fails in this layout** (it tries to update local main). Merge via the API instead: `gh api repos/tripdog/music-blog/pulls/N/merge -X PUT -f merge_method=squash`. Then delete the remote branch manually, since the API merge won't.
- **Always start new work through Emdash's new-task UI**, which cuts a fresh worktree off the current parent main. Do NOT reuse a leftover worktree. The footer work once landed in the old archive worktree and was one keystroke from being committed onto the wrong branch.
- **Before starting, read the worktree path in the prompt.** It is printed in every `Bash(git -C ...)` call. Confirm it is the NEW task's worktree, not a leftover one.
- **Trust the rendered page over git inference.** More than once, a short commit log led to "you're not missing anything" while the page showed otherwise. The render (and production) is ground truth. The byline "regression" was really an unshipped PR.
- **Stage deliberately. Never `git add .`** in these worktrees, or `.claude/settings.local.json` (and other local cruft) rides along. The `.gitignore` blocks that file going forward, but the habit stands.
- **Confirm fixes by proof, not by summary.** Use `git ls-files <file>` to confirm something is tracked, and the actual render to confirm a visual fix. End-of-turn summaries occasionally rationalized a loose end ("intentionally excluded") instead of closing it.

-----

## Decisions log

- **2026-06-08:** OG image is a static asset at `/public/og-image.jpg`. Per-post pages override with `heroImage` if present, falling back to the default. `og:site_name` added as a direct commit to main after PR #15.
- **2026-06-08:** `BaseHead.astro` is the correct place for all head metadata — not `BaseLayout.astro`, which is a bare shell. Adding tags to `BaseLayout` would create duplicates.
- **2026-06-08:** Beehiiv embed uses `is:inline` on both script tags so Astro doesn't bundle them; the loader injects the widget adjacent to the script tag. Styling is limited to the container (iframe boundary); tweak the widget's appearance in the Beehiiv dashboard.
- **2026-06-08:** Contact form uses Web3Forms (no server, no backend — pure HTML POST to Web3Forms endpoint). Chose it over a custom API route to keep the site fully static on Cloudflare Pages.
- **2026-06-08:** Remote branch cleanup is now a manual step after every API merge (`gh api repos/tripdog/music-blog/git/refs/heads/<branch> -X DELETE`). API merge does not auto-delete like `gh pr merge --delete-branch`.
- **2026-06-07:** Media embeds shipped as a UNIVERSAL capability (PR #8), explicitly separated from the roundup post format. Any post can embed Apple Music / YouTube via components in an `.mdx` body. No schema change, no new post type. The roundup format (optional rating, `format` flag, pills) is a separate, parked item under Next up.
- **2026-06-07:** MDX and the `{md,mdx}` collection glob were already configured; the planned "enable MDX" step was a no-op.
- **2026-06-07:** Embed spacing handled by a general `.post-prose > :global(*) { margin-bottom: 1.5rem }` rule (direct-child scoped), not per-component margins. Root cause was flush siblings, not a height collapse. One rule spaces all current and future embeds + content.
- **2026-06-06:** PR #5 (About byline + how-it-works orange) was never merged on 6-05; it sat open until 6-06. The old "merged + deployed" note was wrong and sent us chasing a phantom regression. Now merged (`b595440`).
- **2026-06-06:** Sticky footer = pure global CSS keyed on a top-level `<main>` (`body` flex column + `main { flex: 1 0 auto }`), NOT a `.site-footer-group` wrapper. `BaseLayout` is a bare shell; each page composes its own structure; how-it-works lives on About, not the footer.
- **2026-06-06:** Post pages now use `<main class="post-page">` instead of a `<div>`, so they get the sticky rule and a proper landmark.
- **2026-06-06:** `.gitignore` now ignores `.claude/settings.local.json` to stop the recurring local-settings leak into commits/worktrees.
- **2026-06-06:** Media embeds (Apple Music, YouTube) are plain iframes. No API, no server-side, no infra change on Cloudflare Pages. (Shipped 6-07, see above.)
- **2026-06-06:** If/when the roundup format is built, embeds go in the EXISTING post type via a `format` flag, NOT a new collection. Keeps Latest/Archive/RSS working for free.
- **2026-06-06:** `rating` becomes optional (for the roundup format) so those posts can skip the skull score (layout renders skulls only when a rating is present).
- **2026-06-06:** YouTube embeds use `@astro-community/astro-embed-youtube` (lazy-loads thumbnail until click) for performance; Apple Music uses a simple lazy iframe wrapper. Performance, not feasibility, is the real consideration on embed-heavy posts.
- **2026-06-05:** Footer = classic sticky pattern (bottom of viewport on short pages, pushed down on long), NOT fixed/always-visible. (Implementation detail corrected 6-06: no wrapper needed.)
- **2026-06-05:** "How it works" background = reusable orange token. Eyebrow set to white (deliberate, confirmed legible).
- **2026-06-05:** "Latest" nav = most recent `featured: true` post only (not any post). Falls back gracefully when no featured post exists.
- **2026-06-05:** Blog collection is named `blog` (not `posts`); date field is `pubDate` (not `date`). Post URLs are `/blog/<entry.id>`.
- **2026-06-05:** Sort logic lives once in `getAllPosts()`; Latest and Archive both build on it.
- **2026-06-05 (workflow, SUPERSEDED 6-06):** Old note said "`git checkout main && git pull` before cutting a new branch." That does not work in a worktree. See the corrected workflow section above.
