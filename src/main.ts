import { CheerioCrawler, KeyValueStore, log } from 'crawlee';
import { router } from './routes.js';

const userInput = await KeyValueStore.getInput()

const startUrls = userInput.mangaUrls || []

const crawler = new CheerioCrawler({
    requestHandler: router,
});

await crawler.run(startUrls);
