import puppeteer from "@cloudflare/puppeteer";

export default {
	async fetch(request: Request, env: Env) {
		let browser;

		try {
			browser = await puppeteer.launch(env.BROWSER);
			const auth = request.headers.get("Authorization");
			if (!auth || auth !== `Bearer ${env.SECRET_KEY}`) {
				return new Response("Unauthorized", { status: 401 });
			}

			const json = await request.json() as { document: string };
			if (!json.document || typeof json.document !== 'string') {
				return new Response("Missing or invalid document", { status: 400 });
			}

			const page = await browser.newPage();
			await page.setContent(json.document);
			const pdf = await page.pdf({ printBackground: true });

			return new Response(pdf, {
				headers: {
					"cache-control": "private, max-age=0",
					"content-type": "application/pdf",
				},
			});
		} catch (error: any) {
			console.error('PDF generation error:', error);
			return new Response(
				JSON.stringify({
					error: "PDF generation failed",
					message: error.message
				}),
				{
					status: 500,
					headers: { "content-type": "application/json" }
				}
			);
		} finally {
			await browser?.close();
		}
	},
};
