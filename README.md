# Futuristic Cyber Forensics Lab (FCFL) website

One-page website for the Futuristic Cyber Forensics Lab, National Forensic
Sciences University, Gandhinagar, funded under ISEA Phase-III, MeitY.

Plain **HTML, CSS and JavaScript**. No frameworks, no database, no build step.

---

## Run it on Ubuntu 24.04

```bash
unzip fcfl-website.zip
cd fcfl-website
chmod +x run.sh
./run.sh
```

The site opens at **http://localhost:8000**. Press `Ctrl+C` in the terminal to
stop it. If port 8000 is busy, run `./run.sh 8080`.

You can also just double-click `index.html` to open it in Firefox or Chrome.

---

## Folder structure

```
fcfl-website/
├── index.html              all page content (you will edit this most)
├── css/style.css           colours, fonts, layout
├── js/main.js              menu, research tabs, filters, publication search,
│                           BibTeX copy, contact form, dot-wave animation
├── run.sh                  starts a local server (Ubuntu)
└── assets/img/
    ├── fcfl-logo.png       lab logo, navy + gold text (header, light background)
    ├── fcfl-logo-dark.png  lab logo, white + gold text (footer, navy background)
    ├── fcfl-logo-gold.png  lab logo, all-gold text (spare, not used on the page)
    ├── favicon.png         browser tab icon (NFSU crest)
    ├── logo-nfsu.png       NFSU logo with name (top section, under the buttons)
    ├── logo-nfsu-crest.png NFSU crest (footer)
    ├── logo-mha.png        Ministry of Home Affairs
    ├── logo-meity.png      Ministry of Electronics and Information Technology
    ├── logo-isea.png       ISEA
    └── team/               put team photos here
```

---

## Editing the content

Each section of `index.html` begins with a comment block, for example:

```html
<!-- ===================================================================
     PROJECTS
     data-status must be "ongoing" or "completed" ...
     =================================================================== -->
```

Search for the section name and replace everything in `[square brackets]`.
To add an item, copy an existing block and change the text.

| Section        | How it works |
|----------------|--------------|
| Home (hero)    | Headline, intro paragraph, the white logo panel (Hosted at: MHA, NFSU; Funded by: MeitY, ISEA) and the three "Latest from the lab" items |
| About          | Short lab description (SCSDF, established 2024), vision, mission, the Swami Vivekananda message card with Dr. Parag Rughani's note, and four key facts |
| Research areas | Eight focus areas, one tab each (robotics, metaverse, physical AI, cyber-physical, IoT, memory and malware, storage, vehicles and drones). Each tab is one `<button role="tab">` plus one `<div role="tabpanel">`; keep the ids paired (`rt-rob` controls `rp-rob`). Each panel has two focus columns (for example Security and Forensics) and a Methods row |
| Projects       | One `<li class="project">` per project (currently SPARC IV(A) and ISEA Phase-III), newest first: status, scheme and year on the left; title, sponsor and key facts on the right |
| Team           | Current members are portrait cards, four in a row: avatar, role tag, name, designation or dates, research thrust and links (copy a `<li class="tport-card">` to add someone). Replace the `href="#"` Google Scholar and LinkedIn links of the PhD scholars with their real URLs. Alumni are rows in the table, with role tags `role-phd`, `role-postdoc` or `role-ra`. See "Team photos" below |
| Publications   | One `<li class="pub" data-type="journal">` per paper, inside the right year. Types: `journal`, `conference`, `chapter`, `patent`. Put lab members' names in `<b>...</b>`. The BibTeX block is optional |
| Facilities     | Six facilities, each one `<li class="facility">` with an icon, a name and one line |
| Activities     | Six activity types (students first, then academic events, then outreach), then dated events, newest first. `data-filter-value` is `bootcamp`, `hackathon`, `workshop`, `talk` or `awareness`. Only 3 events show until **View all** is pressed; change `data-limit="3"` on the list to show more |
| Contact        | Address (2nd Floor, IFS Building), email pi_isea3@nfsu.ac.in, office hours, map and the enquiry form (all fields required) |
| Footer         | Links, social media URLs (replace `href="#"`), partner logos, copyright |

### Team photos

Save a square photo (about 400 × 400 px) in `assets/img/team/`, then replace

```html
<span class="avatar" aria-hidden="true">RS</span>
```

with

```html
<img class="avatar" src="assets/img/team/firstname-lastname.jpg" alt="">
```


### Logo

The header uses `fcfl-logo.png` (navy and gold text, for the white header) and
the footer uses `fcfl-logo-dark.png` (white and gold text, for the navy footer).
To update the logo, replace those files and keep the same names.

### Partner logos

The MHA, NFSU, MeitY and ISEA logos appear in two places: the white panel
under the buttons in the top section, and the white panel in the footer. To swap one, replace the
file in `assets/img/` and keep the same name. The MHA and MeitY files were
converted to black ink on a transparent background so they sit cleanly on
any light colour.

### Colours and fonts

The site uses a light theme built from the NFSU colours in the lab logo. All
colours are at the top of `css/style.css` under `:root`:

| Token | Colour | Used for |
|-------|--------|----------|
| `--nfsu-navy` | #322B6A | headings, menu, buttons, links, icons |
| `--nfsu-navy-dark` | #221C4F | footer, button hover, code blocks |
| `--nfsu-gold` | #D6B45A | accents: active menu underline, section bars, card top edges, footer headings |
| `--nfsu-gold-ink` | #85651A | small gold text on white (dates, event types) |
| `--nfsu-red` | #C02222 | university line in the top section, "Upcoming" badge, link hover |
| `--ink` / `--slate` | #1D1A3B / #5A5774 | body text / secondary text |
| `--paper` | #F6F5FA | alternate section background |

The dot-wave colours are set in `WAVE_SETTINGS` in `js/main.js`
(`from` = far rows, `to` = near rows).

Fonts are **Exo 2** (headings, matches the logo) and **Source Serif 4**
(reading text), loaded from Google Fonts. Without internet the site falls back
to the fonts installed on the computer, and the layout still works.

### Contact form

The form checks the fields (name, email, organisation and message are
required), then opens the visitor's own email app with the enquiry filled in,
so it works on any server with no setup. It sends to the address in
`data-mailto="pi_isea3@nfsu.ac.in"` on the `<form>`. The "Nature of enquiry"
options are in the `<select id="cf-topic">` list.

To receive messages directly instead, use a form service (such as Formspree)
or your own backend: add `action="..." method="POST"` to the `<form>`, remove
`novalidate`, and delete the `initContactForm();` line at the end of `js/main.js`.

### Dot-wave animation

The animated dots in the hero, facilities and footer are drawn by
`DotWave` in `js/main.js`. Change their shape and colours in `WAVE_SETTINGS`. They pause
when off screen and stay still for visitors who turn on "reduce motion" in their system settings.
To remove one, delete its `<canvas class="dotwave">` line in `index.html`.

---

## Publish on a server (Ubuntu 24.04)

### Apache

```bash
sudo apt update && sudo apt install -y apache2
sudo mkdir -p /var/www/fcfl
sudo cp -r ~/fcfl-website/* /var/www/fcfl/
sudo chown -R www-data:www-data /var/www/fcfl
```

Point `DocumentRoot` in `/etc/apache2/sites-available/000-default.conf` to
`/var/www/fcfl`, then `sudo systemctl reload apache2`.

### Nginx

```bash
sudo apt update && sudo apt install -y nginx
sudo cp -r ~/fcfl-website/* /var/www/html/
sudo systemctl reload nginx
```

### University web server

Upload the whole folder, keeping `css`, `js` and `assets` next to
`index.html`, to the location the IT team gives you, for example
`https://nfsu.ac.in/fcfl/`.

---

## Before going live

- [ ] Replace every `[square bracket]` placeholder
- [ ] Add social media links in the footer
- [ ] Confirm the funding acknowledgement wording and logo use with your project office
