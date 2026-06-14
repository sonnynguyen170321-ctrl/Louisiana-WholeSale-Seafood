---
paths:
  - "**/*.html"
  - "**/*.css"
  - "**/*.js"
---

# Development, Quality & Formatting Rules

This rule enforces coding standards, syntax preferences, and custom performance constraints.

### Formatting Conventions
- **Indentation:** Always use exactly 4 spaces. Do not use tab characters.
- **Quotes:** Use double quotes (`"`) for HTML tag attributes, and single quotes (`'`) for JavaScript string literals.
- **Spacing:** Every file must end with a single trailing empty newline.

### Architecture & Quality Standards
- **Vanilla-First:** Always write vanilla HTML, CSS, and JS. Do not introduce styling libraries (Tailwind, Bootstrap) or compiler runtimes unless explicitly requested.
- **Self-Contained Icons:** Use raw inline SVG blocks in HTML instead of external webfont icon sets (like FontAwesome) to optimize page loads and prevent rendering blockers.
- **Preserve Variable Rules:** Always utilize HSL/HEX variables defined in `:root` inside `style.css` for styling values (radii, shadows, colors, speeds) rather than hardcoding values.
- **Form Submissions:** The contact/RFQ forms must validate inputs on the front-end before displaying success confirmation banners.
- **Scroll Reveal Triggers:** Add the `.reveal-on-scroll` class to page sections to hook them into the `IntersectionObserver` scroll animation.
