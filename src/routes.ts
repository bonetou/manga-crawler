import { Dataset, KeyValueStore, createCheerioRouter } from 'crawlee';


export const router = createCheerioRouter();

router.addDefaultHandler(async ({ request, enqueueLinks }) => {
    await enqueueLinks({
        selector: '#chapters > div > a',
        label: 'CHAPTER-HANDLER',
        userData: {
            mangaTitle: request.url.split('/').pop() || 'manga',
        }
    });
});


router.addHandler('CHAPTER-HANDLER', async ({ $, log, request, sendRequest }) => {
    const mangaTitle = request.userData.mangaTitle;
    const chapterTitle = request.url.split('/').pop() || '';
    const chapterImages = $('img.js-page');
    const imageSources = chapterImages.map((i, chapterImage) => {
        return $(chapterImage).attr('data-src');
    }).toArray().sort();

    log.info(`Chapter ${chapterTitle}. Found ${imageSources.length} images`);

    await Dataset.pushData({
        title: chapterTitle,
        images: imageSources,
    })
    imageSources.forEach(async (imageSource) => {
        let response = await sendRequest({
            url: imageSource,
            responseType: 'buffer',
        })
        log.info(`Saving ${mangaTitle} chapter: ${chapterTitle}`);
        const mangaStorage = await KeyValueStore.open(`./${mangaTitle}/${chapterTitle}`);
        await mangaStorage.setValue(`${imageSources.indexOf(imageSource)}`, response.rawBody, {'contentType': 'image/jpeg'});
    });
});
