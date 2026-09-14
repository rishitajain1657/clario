# Clario backend

## Run locally

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and add `GEMINI_API_KEY` for real multimodal organization.
4. Start with `npm start`.
5. Open `http://localhost:3000/assistant.html`.

`POST /api/organize` accepts a `text` field and/or a multipart `file` field. Without a Gemini key, it returns a local preview result. With a key, Gemini can organize text, PDFs, screenshots, and supported file types. The browser never receives the API key.
