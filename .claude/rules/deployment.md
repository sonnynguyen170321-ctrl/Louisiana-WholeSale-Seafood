# Target Hosting & Deployment Guidelines

This rule defines static configuration details for deploying to Netlify or Vercel hosting engines.

- **Routing Configurations:**
  - Netlify: Place a `_redirects` file in the project root if custom path routers are introduced.
  - Vercel: Place a `vercel.json` file in the project root if custom rewrites, headers, or redirects are needed.
- **Relative Path Resolving:** Always use relative paths (e.g. `assets/...` rather than absolute `/assets/...`) to ensure image and script assets resolve correctly on dynamic branch deployment previews.
