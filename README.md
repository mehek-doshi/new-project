# new-project

Static HTML, CSS and JavaScript frontends for three Neuleap products, built from their Figma files and sharing one design system.

| App | Folder | Start page |
| --- | --- | --- |
| Testing App (aptitude test, candidate flow) | `testing-app/` | `testing-app/index.html` |
| Talents Scooper (recruiter dashboard) | `talents-scooper/` | `talents-scooper/index.html` |
| Tech Radar (discovery + admin console) | `tech-radar/` | `tech-radar/index.html` |

Open `index.html` at the repository root for links to all three.

## Running

There is no build step. Either:

- open `index.html` directly in a browser, or
- serve the folder: `python3 -m http.server 8000` and visit <http://localhost:8000>.

## Structure

```
shared/
  css/tokens.css       design tokens (dark default, light via <html data-theme="light">)
  css/base.css         reset + type scale (Roboto)
  css/components.css   buttons, inputs, tabs, chips, cards, tables, modals, drawers…
  css/layout.css       sidebar + top bar app shell
  js/ui.js             theme toggle, icons, modals/drawers, toasts, tabs, sortable tables
  img/neuleap-mark.svg logo mark
  vendor/lucide/       icon library (ISC licence)
testing-app/           login, permissions, verify, intro, test, submitted, disqualified
talents-scooper/       dashboard, interview schedule, question banks, candidate
tech-radar/            sign in, dashboard, new use case, artifacts, admin-*.html
```

Each app's own `app.css` only handles layout. Colours, type, spacing and components all come from `shared/`, so the three apps stay consistent.

## Notes

- Data is sample data in each app's `data.js` / `questions.js`; there is no backend.
- Every screen supports dark and light themes (toggle in the header, remembered per browser).
- The Testing App uses your real camera if you allow it, otherwise a placeholder. Switching tabs during the test raises a proctoring warning; three warnings disqualify. Add `?demo=motion` to `test.html` to see the motion warning immediately.
- The Neuleap logo is a placeholder mark — swap `shared/img/neuleap-mark.svg` for the real asset.
