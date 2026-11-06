# Aone Development website

Edit the site at **https://aonedevelopment.com/admin** (sign in with GitHub).

- Projects, pages, downloads, homepage text, menu and contact info are all edited there.
- Every Publish saves to this GitHub repository, and Netlify rebuilds the site in about a minute.
- Form submissions: Netlify → your project → Forms. Email alerts: Forms → Form notifications.

For developers: Eleventy 3 static site. `npm install`, then `npm start`. Content lives in `src/_data`, `src/projects`, `src/pages`, `src/downloads`. Admin panel config: `src/admin/config.yml` (Sveltia CMS).
