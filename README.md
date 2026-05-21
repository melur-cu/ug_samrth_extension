# UG Samarth Extension

A Chrome extension for Cotton University to assist with academic scrutiny and document verification on the Assam Higher Education Portal ([assam.samarth.ac.in](https://assam.samarth.ac.in)).

---

## Features

- **Admission Criteria Notice** — Automatically displays subject-wise eligibility criteria based on the applicant's category (General / ST / SC / OBC-NCL).
- **ST Relaxation Badge** — Highlights relaxed criteria for reserved category applicants.
- **Gap Year Warning** — Flags applicants with more than 3 years of study gap.
- **Document Reupload Autofill** — Auto-fills reupload remarks for each document type.
- **Table Enhancements** — Highlights rows by category, hides irrelevant columns, adds a summary bar, and fixes the table with a sticky header.
- **Remote Config** — All rules, remarks, subject info, and table config are fetched live from GitHub — no extension update needed when rules change.

---

## Project Structure

```
ug_samrth_extension/
├── manifest.json         # Extension manifest
├── content.js            # Main content script
├── styles.css            # Local base styles (optional)
└── configs/
    ├── subject_info.json # Subject eligibility rules (ot/st)
    ├── remarks.json      # Document reupload remarks
    └── table_config.json # Table column visibility and highlight config
```

---

## Remote Config Files

All config files are fetched from:

```
https://raw.githubusercontent.com/melur-cu/ug_samrth_extension/main/configs/
```

| File | Purpose |
|------|---------|
| `subject_info.json` | Eligibility criteria per subject for OT and ST categories |
| `remarks.json` | Auto-fill messages for document reupload requests |
| `table_config.json` | Column visibility, category colors, percentage threshold |

To update rules for all users, simply edit the relevant JSON file on GitHub and push. No extension reinstall needed.

---

## Installation (Local / Developer Mode)

Chrome does not allow installing extensions directly from a GitHub URL — you need to download the files first. Follow the steps below.

### Step 1 — Download the Extension

**Option A — Download ZIP**

1. Go to [https://github.com/melur-cu/ug_samrth_extension](https://github.com/melur-cu/ug_samrth_extension)
2. Click the green **Code** button
3. Click **Download ZIP**
4. Extract the ZIP to a folder on your computer (e.g. `Desktop/ug_samrth_extension`)

**Option B — Clone with Git**

```bash
git clone https://github.com/melur-cu/ug_samrth_extension.git
```

---

### Step 2 — Load in Chrome

1. Open Chrome and go to:
   ```
   chrome://extensions
   ```
2. Enable **Developer mode** using the toggle in the top-right corner
3. Click **Load unpacked**
4. Select the folder you extracted/cloned in Step 1
5. The extension will appear in your extensions list

---

### Step 3 — Pin the Extension (Optional)

1. Click the puzzle icon (🧩) in the Chrome toolbar
2. Find **UG Samarth Extension**
3. Click the pin icon to keep it visible in the toolbar

---

## Updating the Extension

### If config/rules changed (JSON files only)
No action needed — the extension fetches the latest JSON from GitHub on every page load.

### If the extension code changed (JS/manifest)

1. Re-download or pull the latest code from GitHub
2. Go to `chrome://extensions`
3. Click the **reload** button (↻) on the extension card

---

## Permissions

| Permission | Reason |
|------------|--------|
| `https://assam.samarth.ac.in/*` | Inject scripts into the portal |
| `https://raw.githubusercontent.com/*` | Fetch remote config JSON and CSS files |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Extension not working on a page | Check `chrome://extensions` — make sure it is enabled |
| Notice box not appearing | Open DevTools (F12) → Console and check for errors |
| Rules not updating | Hard refresh the page (`Ctrl + Shift + R`) to bypass cache |
| Category relaxation not applied | Open Console and check `RAW CATEGORY:` log to verify the exact string |
| Table not fixed | Ensure you are on the Academic Scrutiny list page |

---

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Push and open a Pull Request

---

## Maintainer

**Cotton University — Programmer **
[melur.phangcho@cottonuniversity.ac.in](mailto:melur.phangcho@cottonuniversity.ac.in)
[saurav.sarma@cottonuniversity.ac.in](mailto:saurav.sarma@cottonuniversity.ac.in)

---

© 2026 Cotton University. Built for internal use on the Assam Higher Education Samarth Portal.
