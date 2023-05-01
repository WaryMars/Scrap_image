
import { parseCSV } from './csv-parser.js'
import Scraper from 'images-scraper';
import { createObjectCsvWriter } from "csv-writer";

const products = await parseCSV('VITA_2.csv');

const search = products.map((product) => {
    return product;
});

const chunk = (array, size) => {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
    }
    return chunked_arr;
};

let chunked_arr = chunk(search, 5);

const google = new Scraper({
    puppeteer: {
        headless: true,
    },
});

const finalArray = [];

const image_results = async () => {

    for (let index = 0; index < chunked_arr.length; index++) {
        const results = await google.scrape(chunked_arr[index], 1);

        console.log(index + " / " + chunked_arr.length)

        for (let result of results) {

            setTimeout(() => {
                if (result.images[0].url !== undefined || result.images[0].url !== null || result.images[0].url !== "") {
                    const product = {
                        Titre: result.query,
                        ImageSrc: result.images[0].url
                    }
                    finalArray.push(product);
                    console.log(result);
                }
            }, 1500);
        }
    }

};

image_results().then(() => {

    const csvWriter = createObjectCsvWriter({
        path: "product_VITA_2.csv",
        header: [
            { id: "Titre", title: "Titre" },
            { id: "ImageSrc", title: "ImageSrc" },
        ],
    });

    csvWriter.writeRecords(finalArray).then(() => {
        console.log("...Done");
    });
})


console.log(finalArray);
console.log('Réussie');





/*

import { parseCSV } from './csv-parser.js'
import Scraper from 'images-scraper';
import { createObjectCsvWriter } from "csv-writer";

const products = await parseCSV('VITA_2.csv');

const search = products.map((product) => {
    return product ;
});

const chunk = (array, size) => {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
    }
    return chunked_arr;
};

let chunked_arr = chunk(search, 4);

const google = new Scraper({
    puppeteer: {
        headless: true,
    },
});

const finalArray = [];

const image_results = async () => {
    for (let index = 0; index < chunked_arr.length; index++) {
        const results = await google.scrape(chunked_arr[index], 1);

        console.log(index + " / " + chunked_arr.length)

        for (let result of results) {
            if (result.images[0].url !== undefined || result.images[0].url !== null || result.images[0].url !== "") {
                const product = {
                    Titre: result.query,
                    ImageSrc: result.images[0].url
                }
                finalArray.push(product);
                 console.log(result);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
};

(async () => {
    await image_results();

    const csvWriter = createObjectCsvWriter({
        path: "product_VITA_2.csv",
        header: [
            { id: "Nom", title: "Nom" },
            { id: "Images", title: "Images" },
        ],
    });

    await csvWriter.writeRecords(finalArray);
    console.log(finalArray);
    console.log('Réussie');
})();
*/