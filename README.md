# Jadvenia — Bengaluru's Peer-to-Peer Parking Network

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm start
```

App runs at http://localhost:3000

---

## 📁 Project Structure

```
src/
├── App.js                    # Router + layout
├── index.js                  # Entry point
├── index.css                 # Global styles + CSS variables
├── data.js                   # Mock data (replace with API calls)
│
├── context/
│   └── AuthContext.js        # Google OAuth + email auth state
│
├── components/
│   ├── Navbar.js             # Sticky nav with user menu
│   ├── Navbar.module.css
│   ├── ListingCard.js        # Reusable listing card
│   ├── ListingCard.module.css
│   ├── Footer.js
│   └── Footer.module.css
│
└── pages/
    ├── Home.js               # Landing page with hero, search, earning calc
    ├── Home.module.css
    ├── Login.js              # Sign in (Google + email)
    ├── Signup.js             # Registration with role picker
    ├── Auth.module.css       # Shared auth styles
    ├── SearchPage.js         # Listings search with sidebar filters
    ├── SearchPage.module.css
    ├── ListingDetail.js      # Spot detail + booking widget
    ├── ListingDetail.module.css
    ├── KYC.js                # 5-step KYC flow
    ├── KYC.module.css
    ├── Dashboard.js          # User bookings dashboard
    ├── Dashboard.module.css
    ├── HostDashboard.js      # Host earnings + listings management
    ├── HostDashboard.module.css
    ├── ListSpot.js           # 4-step spot listing flow
    └── ListSpot.module.css
```

---

## 🔑 Pages & Routes

| Route             | Page            | Description                              |
|-------------------|-----------------|------------------------------------------|
| `/`               | Home            | Landing page, hero search, categories    |
| `/login`          | Login           | Email + Google sign in                   |
| `/signup`         | Signup          | Registration with role selection         |
| `/search`         | Search          | Listings with filters and sorting        |
| `/listing/:id`    | ListingDetail   | Spot detail page with booking widget     |
| `/kyc`            | KYC             | 5-step KYC verification flow             |
| `/dashboard`      | Dashboard       | User bookings and quick links            |
| `/host-dashboard` | HostDashboard   | Host listings, earnings, payouts         |
| `/list-spot`      | ListSpot        | 4-step spot listing wizard               |

---

## 🔌 Backend Integration Points

### Replace mock data in `src/data.js` with API calls:

```js
// Example: fetch listings
const listings = await fetch('/api/listings?area=Indiranagar').then(r => r.json());
```

### Auth — connect Google OAuth:
In `src/context/AuthContext.js`, replace `loginWithGoogle()` with your Spring Boot OAuth2 redirect:
```js
window.location.href = 'http://localhost:8080/oauth2/authorization/google';
```

### API base URL — create `.env`:
```
REACT_APP_API_URL=http://localhost:8080/api
```

---

## 🎨 Design System

Fonts: **Syne** (display/headings) + **DM Sans** (body)

Colors (CSS variables in `index.css`):
- `--green-400: #1D9E75` — primary brand
- `--green-900: #0a1f17` — dark hero backgrounds
- `--amber-400: #EF9F27` — ratings, highlights

---

## 📦 Dependencies

- `react` + `react-dom` v18
- `react-router-dom` v6 — routing
- `lucide-react` — icons

No UI library used — fully custom CSS Modules.

---

## 🏗️ Spring Boot Microservices (Backend)

Suggested services to build:

| Service              | Responsibility                          |
|----------------------|-----------------------------------------|
| `user-service`       | Auth, profile, Google OAuth2            |
| `listing-service`    | CRUD listings, geo-search (PostGIS)     |
| `booking-service`    | Booking logic, availability, duration   |
| `kyc-service`        | Document upload, DigiLocker API         |
| `payment-service`    | Razorpay, 88/12 split, payouts          |
| `notification-service` | SMS (Fast2SMS), email, push           |
| `admin-service`      | KYC approval, listing moderation        |

---

Built with ♥ for Bengaluru
