import { CheerioCrawler, KeyValueStore } from 'crawlee';
import { router } from './routes.js';

const userInput = await KeyValueStore.getInput()

const startUrls = userInput.mangaUrls || []

const crawler = new CheerioCrawler({
    requestHandler: router,
    maxRequestRetries: 5,
    navigationTimeoutSecs: 30,
});

await crawler.run(startUrls);
