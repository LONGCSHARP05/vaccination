# Quick Start Guide - Vaccine Search Feature

## Prerequisites
- Node.js (v14+)
- npm or yarn
- Backend server running on `http://localhost:8000`

## Installation

### 1. Install Dependencies
```bash
cd vaccine-frontend-repo
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will open at `http://localhost:5173` (or another port if 5173 is busy)

## Usage Flow

### 1. Login Screen
- Navigate to `http://localhost:5173` or `http://localhost:5173/login`
- Enter your email/username and password
- Click "Đăng nhập" button
- ✓ Token is saved automatically

### 2. Dashboard
- After login, you're redirected to `/dashboard`
- See the main navigation menu
- Click "Tra cứu Vaccine" card to start

### 3. Vaccine Search
- **URL:** `http://localhost:5173/vaccines`
- **Search:** Type to filter vaccines by name, code, or manufacturer
- **View Details:** Click "Xem chi tiết" on any vaccine card
- **Back:** Click "Quay lại" to return to list
- **Logout:** Click "Đăng xuất" button in header

## Project Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## Project Structure

```
vaccine-frontend-repo/
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Home.jsx        # Dashboard
│   └── VaccineSearch.jsx # Vaccine search page
├── components/         # Reusable components
│   ├── InputField.jsx  # Input field component
│   └── VaccineList.jsx # Vaccine list display
├── services/          # API services
│   ├── authService.js  # Auth API calls
│   └── vaccineService.js # Vaccine API calls
├── hooks/             # Custom hooks
│   └── useAuth.js     # Authentication hook
├── assets/            # Styles
│   ├── login.css
│   ├── home.css
│   ├── vaccine-search.css
│   └── vaccine-list.css
├── utils/             # Helper functions
│   └── storage.js     # Token management
├── routes/            # Route definitions
│   └── AppRoutes.jsx  # App router setup
├── layouts/           # Layout components
│   └── AuthLayout.jsx
└── main.jsx          # Entry point
```

## File Changes Summary

### New Files Created
1. `pages/VaccineSearch.jsx` - Primary vaccine search interface
2. `components/VaccineList.jsx` - Vaccine card display component
3. `services/vaccineService.js` - Vaccine API service
4. `assets/vaccine-search.css` - Vaccine search styles
5. `assets/vaccine-list.css` - Vaccine list styles
6. `assets/home.css` - Home/dashboard styles
7. `pages/Home.jsx` - Dashboard landing page (now has content)
8. `VACCINE_SEARCH_GUIDE.md` - Detailed feature documentation

### Modified Files
1. `routes/AppRoutes.jsx` - Added new routes and ProtectedRoute
2. `components/InputField.jsx` - Made props more flexible
3. `package.json` - Added prop-types dependency

## API Endpoints Used

The vaccine feature makes requests to:

```
GET  /api/v1/vaccines          # Get all vaccines
GET  /api/v1/vaccines/:id      # Get vaccine details
GET  /api/v1/vaccines/lots/:id # Get vaccine lots (future)
```

**Base URL:** `http://localhost:8000/api/v1`

## Authentication

- Login saves JWT token to `localStorage` as `token`
- Token is sent with every API request in the `Authorization: Bearer <token>` header
- Routes `/dashboard` and `/vaccines` are protected - require valid token
- Invalid or missing token redirects to `/login`

## Styling

All styles are written in pure CSS with:
- Gradient backgrounds (purple/blue color scheme)
- Flexbox & CSS Grid layouts
- Responsive design (mobile-first approach)
- Smooth transitions and animations
- Breakpoints: 1200px (desktop), 768px (tablet), 480px (mobile)

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Backend not connecting
- Verify backend is running: `http://localhost:8000`
- Check backend CORS settings
- Check API endpoint URLs in `services/vaccineService.js`

### Token not persisting
- Check browser's localStorage is enabled
- Clear localStorage: `localStorage.clear()` in console
- Re-login

### Styles not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server: `npm run dev`

### Port already in use
```bash
# If 5173 is busy, Vite will use the next available port
npm run dev
# Check the console output for the actual URL
```

## Next Steps

1. ✓ Frontend vaccine search feature is complete
2. Next: Implement vaccine appointment booking
3. Then: Add patient management features
4. Finally: Add reporting/analytics

## Documentation

For more detailed information, see:
- [VACCINE_SEARCH_GUIDE.md](./VACCINE_SEARCH_GUIDE.md) - Feature documentation
- [README.md](./README.md) - Project overview

## Support

If you encounter issues:
1. Check the browser console for errors (F12)
2. Check the backend logs
3. Verify API endpoints are correct
4. Ensure token is valid and not expired

---

**Happy coding!** 🎉

Last Updated: March 2026
