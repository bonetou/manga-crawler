import fs from 'fs';

let createImageDirectory = (dir: string) => {
    fs.mkdir(`./images/${dir}/`, { recursive: true }, (err) => {
        if (err) throw err;
    });
}

let saveImage = async (imageSource: string, mangaTitle: string) => {
    let response = await sendRequest({
        url: imageSource,
        responseType: 'buffer',
    })
    const fileName = imageSource.split('/').pop();
    const writer = fs.createWriteStream(`./images/${mangaTitle}/${fileName}`);
    writer.write(response.rawBody);
}