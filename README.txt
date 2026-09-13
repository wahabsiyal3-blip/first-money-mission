FIRST MONEY MISSION V4 — LAUNCH-READY STARTER

WHAT'S NEW
- Premium landing page
- No fake probability percentages
- Server-side mission endpoint
- Safe place to connect a real AI service later
- $1.99 checkout button ready for a hosted checkout URL
- Demo mission generation works without any external account
- Mobile responsive

HOW TO RUN ON A COMPUTER
1. Install Node.js.
2. Open a terminal in this folder.
3. Run: npm install
4. Copy .env.example to .env
5. Run: npm start
6. Open http://localhost:3000

PAYMENTS
When you have a legitimate hosted checkout page from your payment provider:
- Put its URL in .env as CHECKOUT_URL=...
- Restart the server.
The buy button will then redirect to it.

REAL AI
The server is built so a real AI backend can be connected without putting private keys in the browser.
Set AI_WEBHOOK_URL to a server endpoint that accepts the mission inputs and returns JSON with:
title, price, routes, offer, sample, customer, firstMessage, followUp, objection, days.

IMPORTANT
This is a launch-ready starter, not a fully deployed internet business yet.
Production launch still needs:
- domain/hosting
- real payment account
- secure payment verification/webhook before unlocking paid content
- privacy policy / terms
- real AI service connection if desired
- testing with real users
