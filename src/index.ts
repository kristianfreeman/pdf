import puppeteer from "@cloudflare/puppeteer";

export default {
	async fetch(request: Request, env: Env) {
		try {
			const auth = request.headers.get("Authorization");
			if (!auth || auth !== `Bearer ${env.SECRET_KEY}`) {
				return new Response("Unauthorized", { status: 401 });
			}

			const browser = await puppeteer.launch(env.BROWSER);
			const json = await request.json() as { document: string };
			const { document } = json;

			const page = await browser.newPage();
			await page.setContent(document);
			const pdf = await page.pdf({ printBackground: true });

			await browser.close();

			return new Response(pdf, {
				headers: {
					"content-type": "application/pdf",
				},
			});
		} catch (error: any) {
			return new Response(error.message, { status: 500 });
		}
	},
};
