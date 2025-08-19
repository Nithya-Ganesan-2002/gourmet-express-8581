# Food Delivery Frontend (React)

This project is the React-based user interface for the Gourmet Express food delivery application.

## Features Implemented

- User registration and login (JWT)
- Browse restaurants and menus
- Cart management (add, update, remove, clear)
- Checkout to create orders
- Order history and real-time tracking UI (polling)
- User profile view and update
- Light/Dark theme toggle
- Responsive, clean layout without heavy UI frameworks

## Environment

Copy `.env.example` to `.env` and set:

- `REACT_APP_API_BASE_URL` — base URL for the backend API (e.g. http://localhost:3001)

## Scripts

- `npm start` — start dev server
- `npm test` — run tests
- `npm run build` — production build

## Pages and Routes

- `/` — Home
- `/restaurants` — Browse restaurants
- `/restaurants/:id` — Restaurant detail and menu
- `/cart` — Cart view
- `/orders` — My orders (requires login)
- `/orders/:id` — Order tracking (requires login)
- `/profile` — My profile (requires login)
- `/login` and `/register` — Auth

## Notes

- Backend integration adheres to the provided OpenAPI endpoints.
- Real-time tracking is implemented via periodic polling of order status.
