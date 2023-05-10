import { CheerioCrawler } from 'crawlee';
import { router } from './routes.js';

const startUrls = ['https://www.mangapill.com/manga/3069/naruto'];

const crawler = new CheerioCrawler({
    requestHandler: router,
});

await crawler.run(startUrls);
