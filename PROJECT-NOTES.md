# Insight Tattoo - Project Notes

**Client:** Renee
**Website:** https://www.insighttattoo.co.nz/
**Hosting:** 1stdomains.nz (Plesk)
**Hosting Panel:** https://1stdomains.nz/client/account_manager.php
**WordPress:** 6.9.1
**PHP:** 8.1.32

---

## Work Completed

### 1. PHP Upgrade Fix (2026-03-03)

**Problem:** Site was returning a 500 Internal Server Error after PHP was upgraded from 7.3 to 8.1.

**Cause:** The **Slideshow plugin** (`slideshow-jquery-image-gallery` v2.3.1) was not compatible with PHP 8.x. The plugin used an old PHP 4 style constructor (`function SlideshowPluginWidget()`) which is not supported in PHP 8.

**Fix applied:**
- Initially disabled the plugin by renaming the folder to `slideshow-jquery-image-gallery.disabled` to get the site back online
- Then re-enabled the plugin and edited `SlideshowPluginWidget.php`
- Changed `function SlideshowPluginWidget()` to `function __construct()` on line 20

**Note:** This plugin is abandoned (no updates available). It works for now but should be replaced with a modern alternative (e.g. MetaSlider or Smart Slider 3) in the future.

### 2. Outstanding Plugin/Theme Updates

The following updates were pending as of 2026-02-28:

**Plugins:**
- WP STAGING (4.5.0 → 4.6.0)
- WP Go Maps (9.0.45 → 10.0.05)
- Plugin Compatibility Checker (7.0.3 → 7.0.4)
- Jetpack (14.7 → 15.5)
- Ibtana Visual Editor (1.2.5.2 → 1.2.5.6)
- Akismet (5.4 → 5.6)

**Themes:**
- VW Furniture Shop (1.1.8 → 1.3.3)
- Twenty Twenty-Five (1.2 → 1.4)

---

## Afterpay / Stripe Setup (In Progress)

### Background
Renee wants to accept online payments for tattoo services — both fixed voucher amounts ($500, $800) and custom quoted amounts. She doesn't have eftpos in store.

### Recommendation
Use **Stripe** (stripe.com/nz) as the payment provider with **Afterpay** enabled as a payment method (it's a toggle within Stripe — no separate Afterpay merchant account needed).

### How it works
- Renee (or her staff) creates a **payment link** in Stripe for a specific amount
- Texts/emails the link to the client
- Client pays via Afterpay (4 instalments) or card
- Money goes to the business bank account

### Fees (NZ)
| Transaction Type         | Fee                  |
|--------------------------|----------------------|
| Domestic cards (NZ)      | 2.7% + NZ$0.30      |
| International cards      | 3.7% + NZ$0.30      |
| Afterpay (through Stripe)| 6% + NZ$0.30       |

### Fee examples
| Voucher Amount | Paid by Card | Paid by Afterpay |
|----------------|--------------|------------------|
| $500           | $14.80 fee → receive $485.20 | $30.30 fee → receive $469.70 |
| $800           | $23.50 fee → receive $776.50 | $48.30 fee → receive $751.70 |
| $1,200         | $35.10 fee → receive $1,164.90 | $72.30 fee → receive $1,127.70 |

### Staff invoicing
- If staff are **employees**: One Stripe account, add each artist as a team member. All payments go to one business bank account.
- If staff are **independent contractors**: Each artist needs their own Stripe account so payments go to their own bank accounts.

### Status
- **Waiting on Renee** to:
  1. Sign up for Stripe at stripe.com/nz
  2. Confirm voucher amounts
  3. Clarify staff structure (employees vs contractors)
  4. Send Stripe API keys once set up

### Key decisions
- Square is NOT available in NZ — ruled out
- Afterpay doesn't offer standalone payment links — needs Stripe (or similar)
- Renee had started signing up for Afterpay merchant directly on Jason's phone — advised to hold off and use Stripe instead
- Renee is planning to build a new website soon — kept setup simple for now

### Useful links for Renee
- Stripe NZ pricing: https://stripe.com/nz/pricing
- Stripe local payment methods (Afterpay fees): https://stripe.com/nz/pricing/local-payment-methods
- How Afterpay works through Stripe: https://stripe.com/nz/payments/afterpay-clearpay
- Stripe NZ sign up: https://stripe.com/nz

---

## SEO & Traffic Growth Plan (started 2026-07-08)

**Goal:** Increase traffic from Google and AI/GPT search, primarily to drive **booking enquiries**.
**Approach:** Organic-first (paid ads TBD later). Renee already has a Google Business Profile.
**Context:** Local tattoo studio, Whangārei NZ. Artists: Renee, Ash, Fae. Phone: 09 971 9067.
For a local studio, most booking-intent traffic comes from local discovery (Google Maps / local
"3-pack" + "tattoo Whangārei"-type searches), so local SEO is the priority.
To be tracked on the INSIGHT-TATTOO StoryFlow board (SEO epic).

### Current SEO state (audited 2026-07-08)

**Already in place:**
- Root metadata: title "Insight Tattoo Studio | Whangarei, NZ" + good description (`src/app/layout.tsx`)
- Semantic HTML (H1–H3) across pages; 100% image alt-text coverage; `lang="en"`; ISR revalidate 60s
- Public routes: `/`, `/artists`, `/shop`, `/pricing`, `/contact`, `/location`
- favicon present

**Missing (all high-impact) — confirmed via live check (404s) + codebase audit:**
- `robots.txt` → 404 and `sitemap.xml` → 404 (no crawl map)
- No structured data (JSON-LD) — zero LocalBusiness/TattooParlor schema (biggest single gap for Google local + AI)
- No Open Graph / Twitter cards; no `metadataBase`; no canonical URLs
- No per-page metadata (only root layout has it)
- Homepage H1 is a logo image (no real text headline)
- No individual artist pages (artists are anchors on one `/artists` page)
- `next.config.ts` has `images: { unoptimized: true }` — disables image optimization (hurts Core Web Vitals). Revisit carefully; may have been set to dodge a deploy issue.

### Prioritised plan

**Tier 1 — highest leverage**
1. (Renee) **Google reviews engine** — highest ROI for bookings. One-tap review link; artists ask every happy client; aim for a few/week. Drives local-pack ranking + conversion.
2. (Renee) **Google Business Profile tune-up** — confirm category = Tattoo shop, add services, hours, booking link → `/contact`, post portfolio photos weekly, seed Q&A.
3. (Dev) **Technical SEO foundation** — see build checklist below.

**Tier 2 — content that captures booking intent**
- Individual artist pages (Renee / Ash / Fae) with styles + portfolio ("[artist] tattoo" searches)
- Style/service pages: fine-line, script, floral, cover-ups, Māori/kirituhi (if offered)
- FAQ page: pricing, deposits, booking, aftercare, minors policy — long-tail + AI-quotable format

**Tier 3 — GPT / AI search visibility (GEO)**
- JSON-LD + factual on-page content is the foundation (LLMs extract structured facts)
- Consistent name/address/phone across the web; presence on Google Business, NZ directories, socials, local "best of" listicles
- Allow AI crawlers (GPTBot, PerplexityBot, ClaudeBot) in robots.txt
- Reviews & third-party mentions feed the "consensus" AI answers draw on

**Tier 4 — measurement**
- Google Search Console + GA4; submit sitemap; track "tattoo Whangārei" terms + enquiry conversions

**Paid (optional accelerator, TBD):** Google Search ads on high-intent local terms can fill gaps while organic builds. Start organic given existing GBP + reviews push.

### Dev build checklist (Tier 1 technical)
- [ ] `src/app/sitemap.ts` — 6 public routes
- [ ] `src/app/robots.ts` — allow all incl. AI crawlers, block `/admin` + `/api`, link sitemap
- [ ] **TattooParlor / LocalBusiness JSON-LD** — NAP, hours, geo, artists, sameAs socials, priceRange, aggregateRating (needs real data: address + hours from `/location`, phone 09 971 9067, social links + review count from GBP — confirm before shipping)
- [ ] Root `metadataBase` (https://insighttattoo.co.nz) + Open Graph + Twitter cards + title template
- [ ] Per-page metadata: `/artists`, `/pricing`, `/location` (server) — and `/shop`, `/contact` (client components, need small refactor to add metadata)
- [ ] Real text H1 on homepage
- [ ] Register Google Search Console + submit sitemap (needs verification step from Renee/DNS)
- [ ] (Later, carefully) revisit `next.config` `images.unoptimized: true` with a test build

### Renee's action items
- [ ] Set up a Google review request flow; ask clients after each session
- [ ] Complete/optimise Google Business Profile (category, services, hours, booking link, weekly photos, Q&A)
- [ ] Provide: exact studio address + opening hours (confirm), social media links, current Google review count

**Note:** deploys are manual via `vercel --prod` (production does not auto-deploy from git).
