import { Dataset, createCheerioRouter } from 'crawlee';
export const router = createCheerioRouter();
import fs from 'fs';

router.addDefaultHandler(async ({ enqueueLinks, log,  }) => {
    await enqueueLinks({
        selector: '#chapters > div > a',
        label: 'CHAPTER-HANDLER',
    });
});


router.addHandler('CHAPTER-HANDLER', async ({ $, log, request, sendRequest }) => {
    const chapterTitle = request.url.split('/').pop() || '';
    const chapterImages = $('img.js-page');
    const imageSources = chapterImages.map((i, chapterImage) => {
        return $(chapterImage).attr('data-src');
    }).toArray();

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
        const fileName = imageSource.split('/').pop()
        log.info(`Saving chapter: ${chapterTitle} - image: ${imageSource}, fileName: ${fileName}`)
        saveImage(response.rawBody, fileName, chapterTitle)
    });
});


let saveImage = async (imageBuffer: Buffer, fileName: string, chapterTitle: string) => {
    fs.mkdirSync(`./downloaded/${chapterTitle}`, { recursive: true });  
    const writer = fs.createWriteStream(`./downloaded/${chapterTitle}/${fileName}`);
    writer.write(imageBuffer);
    writer.end();
}