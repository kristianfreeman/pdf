# pdf

Generate PDFs using Cloudflare's [Browser Rendering API](https://developers.cloudflare.com/browser-rendering/).

## Deployment

```bash
$ git clone https://github.com/kristianfreeman/pdf.git
$ cd pdf
$ npm install
$ npm run deploy
$ echo "YOUR_SECRET" | npx wrangler secret put SECRET_KEY
```

## Usage

```bash
$ curl -X POST \
  -H "Authorization: Bearer SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"document": "<html><body><h1>Hello, world!</h1></body></html>"}' \
  https://pdf.signalnerve.workers.dev # sub in your custom deployment
```
