import { Dataset, createCheerioRouter, extractUrls } from 'crawlee';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        selector: '#chapters > div > a',
        label: 'chapter-handler',
    });
});


router.addHandler('chapter-handler', async ({ request, $, log, enqueueLinks }) => {
    const chapterTitle = $('#top').text();
    const chapterImages = $('img.js-page');
    const imageSources = chapterImages.map((i, chapterImage) => {
        return $(chapterImage).attr('data-src');
    }).toArray();

    log.info(`Chapter ${chapterTitle}. Found ${imageSources.length} images`);

    await Dataset.pushData({
        title: chapterTitle,
        images: imageSources,
    })
});
