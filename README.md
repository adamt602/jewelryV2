# Jenny's Radiant Jewelry — cleaned project

This is the modular version of the site, split from the original single-file `index.html`.

## Folder structure

```
jewelryV2-clean/
├── index.html                  ← page structure only
├── README.md
├── assets/
│   ├── css/
│   │   └── styles.css          ← all styling
│   ├── js/
│   │   ├── images.js           ← embedded base64 product images
│   │   ├── data.js             ← products (CATALOG) + journal posts (JOURNAL)
│   │   └── app.js              ← all interactive behavior
│   └── img/                    ← (optional) external image files
└── docs/
```

## How to preview

Open `index.html` in your browser. All three JS files must be in `assets/js/`.

## How to edit products

Open `assets/js/data.js` and edit the `CATALOG` object.
Each entry has: `name`, `coll`, `verse`, `ins`, `price`, `edN`, `edOf`, `img`, `cat`, `desc`, `stones`, `storyName`, `story`.

## How to add a product image

1. Add a base64-encoded JPEG to `assets/js/images.js` as a new key on `window.IMGS`
2. Reference that key name in your product's `img` field in `data.js`

## How to edit journal posts

Open `assets/js/data.js` and edit the `JOURNAL` array.
Each post has: `id`, `cat`, `date`, `read`, `title`, `exc` (excerpt), `body` (HTML string).

## How to edit the design

Open `assets/css/styles.css`.

## How to edit behavior

Open `assets/js/app.js`. The file is structured with section comments:
- Reveal animations
- Page routing
- Cart
- Wishlist
- Product card builder
- Shop grid / filters / sort
- Product modal
- Search
- Testimonials
- Stats counter
- Journal
- Gift guide tabs
- Mobile menu
- FAQ
- Newsletter
- Contact / Custom forms
- Stone Finder
- Floating UX

## Script load order (important)

```html
<script src="assets/js/images.js"></script>   ← must be first (defines window.IMGS)
<script src="assets/js/data.js"></script>      ← second (defines window.CATALOG, window.JOURNAL)
<script src="assets/js/app.js"></script>       ← last (reads IMGS, CATALOG, JOURNAL)
```
