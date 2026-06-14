# SKILL.md - Developer Playbook & Operations

This document defines task-specific workflows (skills) for managing, updating, and extending the Louisiana Wholesale Seafood codebase. Follow these step-by-step procedures to ensure styling consistency and code safety.

---

## 📅 Skill: Seasonality Calendar Sourcing Update

Use this skill when you need to change seafood harvest statuses, modify descriptions, adjust sizing options, or add a new seafood type to the interactive homepage calendar.

### Workflow Steps:
1. **Modify Database Object in `app.js`:**
   Locate the `seasonalityData` object. Each seafood is a key containing parameters:
   ```javascript
   seafood_key: {
       title: "Common Name",
       scientific: "Scientific Name",
       status: "Peak Season / Limited Availability / Out of Season",
       statusClass: "peak / limited", // Controls status banner color
       desc: "Detailed sensory and culinary description...",
       source: "Harvest location, State",
       sizing: "Grades and sizing details",
       months: {
           // 1: Out (Gray), 2: Limited (Gold Accent), 3: Peak (Green)
           1: 2, 2: 3, 3: 3, 4: 1, ...
       }
   }
   ```
2. **Add Sidebar Trigger Button in `index.html` (if adding a new species):**
   Add a new button element inside the `#seasonalityControls` container, matching the key used in `app.js`:
   ```html
   <button class="season-btn" data-seafood="seafood_key">
       <div>
           <h4>Common Name</h4>
           <p>Peak: Month - Month</p>
       </div>
       <span class="season-indicator">&rarr;</span>
   </button>
   ```
3. **Verify Calendar Rendering:**
   Run the local server (`python -m http.server 8000`), open `index.html`, and click the new selection button. Ensure description updates correctly and month blocks display the appropriate green/gold/gray colors.

---

## 🍽️ Skill: Restaurant Menu Management

Use this skill to update pricing, add menu highlights, insert custom promotional badges, or swap dishes in the Fat Oysters Seafood restaurant menu.

### Workflow Steps:
1. **Locate Category Blocks in `restaurant.html`:**
   Navigate to the `<section id="menu">` block. Sections are grouped under category headers:
   ```html
   <h3 class="menu-category-title">Category Title</h3>
   <div class="menu-grid"> ... </div>
   ```
2. **Add or Modify a Menu Item Card:**
   Insert a block with this format:
   ```html
   <div class="menu-item">
       <div class="menu-item-info">
           <div class="menu-item-header">
               <span class="menu-item-name">Dish Name</span>
               <!-- Optional Badge (remove if not needed) -->
               <span class="menu-item-badge">New / Signature / Spicy</span>
           </div>
           <p class="menu-item-desc">A brief, sensory description of the dish components and plating.</p>
       </div>
       <span class="menu-item-price">$Price or Mkt Price</span>
   </div>
   ```
3. **Menu Aesthetics Checks:**
   Verify that pricing is properly right-aligned, names use the `'Cormorant Garamond'` serif font, descriptions use the lighter `'Inter'` sans-serif, and the dotted leader-line connects them symmetrically.

---

## 🦐 Skill: Wholesale Catalog Product Addition & Tagging

Use this skill when you need to introduce a new seafood product (e.g. Redfish, Snow Crab, Crawfish Tails) to the B2B catalog on the wholesale page.

### Workflow Steps:
1. **Open `wholesale.html` and Locate `#catalogGrid`:**
   Find the list of products in the catalog container.
2. **Add a Product Card Block:**
   Insert a new product card. Pay close attention to the **`data-category`** tags.
   ```html
   <div class="product-card" data-category="category_tag1 category_tag2">
       <div class="product-img-wrapper">
           <img src="assets/image_name.png" alt="Detailed description of seafood" class="product-img">
           <span class="product-tag">Status Tag (e.g., Seasonal / Wild Catch)</span>
       </div>
       <div class="product-info">
           <h3 class="product-title">Product Name</h3>
           <p class="product-desc">Brief commercial description outlining grade, pack size, and freshness details.</p>
           <div class="product-meta">
               <span class="product-origin">Sourcing: <strong>Harvest Location, LA</strong></span>
               <a href="#inquiry" class="product-action">Inquire &rarr;</a>
           </div>
       </div>
   </div>
   ```
3. **Mapping Category Tags:**
   Ensure the `data-category` attribute contains the appropriate space-separated values:
   * Use **`shellfish`** for oysters, crabs, crawfish, shrimp.
   * Use **`finfish`** for snapper, redfish, drum.
   * Use **`live`** for live items shipped in sacks/bushels (crawfish, blue crab).
   * Use **`fresh`** for processed/filleted fresh or frozen items (snapper fillets, shucked oysters).
   * If a card does not have the correct tag matching the header buttons, it will not appear when filters are clicked.

---

## 📝 Skill: B2B Quote Inquiry Expansion

Use this skill when the marketing team requests new B2B form capturing parameters (e.g. adding Delivery ZIP Code, Tax ID number, or Preferred Sourcing Method).

### Workflow Steps:
1. **Add Form Input Fields in `wholesale.html`:**
   Locate the `<form id="wholesaleForm">` block. Create a new `.form-group` or insert a row using `.form-group-row`:
   ```html
   <div class="form-group">
       <label for="inputFieldId" class="form-label">Field Label *</label>
       <input type="text" id="inputFieldId" class="form-control" required placeholder="Example placeholder text">
   </div>
   ```
2. **Add Validation Controls in `app.js`:**
   Navigate to section `5. B2B QUOTE REQUEST FORM SUBMISSION`. Add your field variables to the validation checks:
   ```javascript
   const inputField = document.getElementById('inputFieldId').value;
   if (!inputField) {
       alert("Please fill out the field label.");
       return;
   }
   ```
3. **Update Console Log / Form Handler Dispatch:**
   Include the new field value in the submission data payload log (or network fetch dispatch):
   ```javascript
   console.log("Wholesale Inquiry Submitted:", {
       ...
       newField: inputField
   });
   ```
4. **Test Form Failure and Success:**
   Attempt to submit the form without the new field to ensure standard front-end validation alerts fire, then fill out all fields and verify the form hides, the success banner displays, and page scrolls smoothly to the confirmation.

---

## 🖼️ Skill: Media Asset Deployment & WebP Optimization

Use this skill when saving new food, kitchen, or wholesale images to the codebase to maintain high page load speed.

### Workflow Steps:
1. **Convert to WebP or Compressed PNG:**
   * Do not upload raw camera `.HEIC` or high-resolution JPEGs directly.
   * Convert new files to WebP format if possible, or run them through compression tools (such as TinyPNG) for standard PNG/JPG files.
   * Target file size: **Under 250 KB** for card images, and **Under 500 KB** for full-width banners.
2. **Standardize Dimensions:**
   * Hero Background / Large Banners: Maximum width **1920px** at 72dpi.
   * Product / Card Graphics: Square **800x800px** or landscape **800x600px** at 72dpi.
3. **Move Asset into directory:**
   Save the image file in the `assets/` subdirectory. Use lowercase snake_case naming (e.g. `assets/boiled_crawfish_platter.png`).

---

## 🔍 Skill: Local SEO Compliance Checklist

Use this skill before releasing any code updates to staging or production, to ensure maximum search authority for local Plano/Dallas searches.

### Compliance Checklist:
* [ ] **Descriptive Title Tags:** Check that every `<title>` element is under 60 characters and includes relevant local search terms (e.g. "Louisiana Wholesale Seafood | Sourcing & Raw Bar Plano TX").
* [ ] **Single H1 Tag:** Verify there is exactly one `<h1>` element per page.
* [ ] **Semantic HTML5:** Confirm that content is structured using semantic tags (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`) instead of generic nested `<div>` wrappers.
* [ ] **Accessibility (Alt tags):** Ensure all `<img>` elements have a descriptive `alt` attribute. Alt text for seafood items should integrate location indicators (e.g. "Fresh shucked Louisiana gulf oysters on ice served at Fat Oysters in Plano TX").
* [ ] **Unique IDs:** Ensure any interactive selectors (filter tabs, navigation toggles, seasonality triggers) have unique and descriptive IDs to prevent duplicate actions.
