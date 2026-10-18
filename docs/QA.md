# Mellow — Verification record

Verified on 18 October 2026. Live site: https://mellow-food-delivery-app.netlify.app

## Executed checks

- **Production build:** `npm run build` passed.
- **Unit tests:** all **20 passed** with Node’s test runner. Coverage includes quantity calculations, rounding, tax after discount, capped percentage coupons, minimum thresholds, case-insensitive codes, free delivery, first-order restrictions, variant identity, checkout validation, tracking transitions and invalid saved cart data.
- **Browser verification:** **36 assertions passed** through the browser interface against the deployed Netlify site. The labels and viewport settings are recorded in [browser-checks.json](browser-checks.json).
- **Responsive review:** 320×740, 390×844, 768×1024 and 1440×1000 viewport settings. The home page had no page-level horizontal overflow at these sizes after fixes. The 768px checkout was also measured without horizontal overflow.
- **Runtime observations:** no browser console errors or warnings were observed during the recorded flows. Home images loaded successfully.
- **Deployment:** Netlify reported a published production deployment from the selected GitHub repository. Direct access to `/checkout` returned HTTP 200 through the SPA fallback.

## Browser flow coverage

| Area                 | Verified behavior                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Discovery            | Text search, vegetarian filter, rating filter, cuisine selection and price sorting            |
| Favorites            | Save restaurant and navigate to the saved list                                                |
| Location             | Select a neighborhood and retain it after reload                                              |
| Menu                 | Category filter, text search and dish customization                                           |
| Customization        | Large size + cheese changes a ₹299 pizza to ₹443                                              |
| Cart                 | Drawer, quantities, persistence after reload and removing the last item                       |
| Restaurant switching | A warning precedes replacement; only the new restaurant’s dish remains                        |
| Coupons              | Invalid code, minimum spend, ₹150 discount cap, free delivery and copy feedback               |
| Exact price check    | Two customized pizzas: ₹886 subtotal − ₹150 + ₹35 delivery + ₹5 platform + ₹37 tax = **₹813** |
| Form                 | Four required-field errors on empty submit and focus on the first invalid field               |
| Desktop order        | Validated fictional details create an order and clear the cart                                |
| Mobile order         | A second complete order with FREEDEL results in a ₹528 total                                  |
| Tracking             | All four statuses, preview progression and retained status after reload                       |
| History              | Two independent saved orders and successful reorder                                           |
| Keyboard             | Dialog dismissal with Escape and navigation with Enter                                        |
| Recovery             | Friendly unknown-page and unknown-restaurant states                                           |
| Responsive UI        | Mobile navigation, compact header, tablet checkout and desktop restaurant grid                |

## Fixes identified during browser review

1. Reduced compact header pressure and allowed the delivery label to truncate so the menu button stays inside narrow screens.
2. Removed the decorative circle’s unnecessary rotation, which enlarged its layout bounds on tablet screens.
3. Removed the body’s minimum width and corrected the category strip’s narrow-screen margins to accommodate the scrollbar at a 320px viewport.
4. Disabled Netlify’s optional injected badge through the project settings because it covered mobile controls.

## Screenshots

Captures are in [screenshots/](screenshots/). The browser excludes its surrounding app chrome and may exclude scrollbar space, so capture pixel dimensions differ slightly from the viewport settings.

- [Desktop home](screenshots/desktop-home.jpg) and [full page](screenshots/desktop-home-full.jpg)
- [Tablet home](screenshots/tablet-home.jpg)
- [Mobile home](screenshots/mobile-home.jpg)
- [Desktop menu](screenshots/desktop-menu.jpg)
- [Desktop cart](screenshots/desktop-cart.jpg) and [mobile cart](screenshots/mobile-cart.jpg)
- [Desktop checkout](screenshots/desktop-checkout.jpg), [tablet checkout](screenshots/tablet-checkout.jpg) and [mobile checkout](screenshots/mobile-checkout.jpg)
- [Desktop tracking](screenshots/desktop-tracking.jpg) and [mobile tracking](screenshots/mobile-tracking.jpg)
- [Mobile order history](screenshots/mobile-orders.jpg)

## Reproducibility and limits

The repository also includes a Playwright suite for desktop, tablet and mobile. That standalone suite was **supplied but not executed** in this handoff; the executed browser assertions used the connected browser interface. Run `npm run test:e2e` after installing Playwright’s Chromium to repeat the suite independently.

These checks used a Chromium-based browser with responsive viewport overrides. Physical iOS/Android devices, Safari and Firefox were not tested. Reduced-motion styles and focus handling are implemented; this is not a certified accessibility audit. Real payments, restaurant integrations, authentication and GPS tracking are outside the frontend assignment and are represented as labelled demo behavior.

The local preview stopped during an interruption, and its error page could not be reacquired under the app’s browser URL policy. Final browser verification used the published Netlify site instead.
