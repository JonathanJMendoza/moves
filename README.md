# Moves

A responsive, local prototype for spontaneous hangouts: post what you're doing now, let friends join, and make guest expectations clear.

## Run

Requires Node.js 20 or newer. No package installation or credentials required.

```sh
npm start
```

The server uses port 3000 by default (`PORT` overrides it). Run `npm run check` for JavaScript syntax validation.

## Try it

Browse sample friends’ plans, filter for happening-now plans, tap “I'm in,” and check “I'm going.” Post a new Move with a location, duration, and guest rule. End your own Move when finished. Plans expire automatically. Changes persist in this browser's local storage; clearing site data resets the demo.

This prototype has no authentication, real friends, notifications, live tracking, or shared backend. Locations are descriptive labels. All responses and new plans stay on this device; avoid entering sensitive addresses. Next steps include friend permissions, invitation delivery, server persistence, and private location access.
