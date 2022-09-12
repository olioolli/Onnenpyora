import { LetterRevealState, Sentence } from './types';
import { decode } from 'html-entities';
import puppeteer from 'puppeteer';

const defaultUrl = 'https://yle.fi/uutiset/18-220306';

let sentences: Sentence[] = [];

export const retrieveSentences = async (url = defaultUrl) => {

    await parseYleHTMLPuppeteer(url);
}

const parseYleHTMLPuppeteer = async (url: string) => {
    const browser = await puppeteer.launch({args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true});
    const page = await browser.newPage();
    console.log("Loading page: "+url);
    await page.goto(url, {
        waitUntil: 'networkidle2',
    });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.evaluate(() => {
        window.scrollTo(0,2000);
    });

    await page.evaluate(() => {
        window.scrollTo(0,4000);
    });

    await page.evaluate(() => {
        window.scrollTo(0,6000);
    });

    await page.evaluate(() => {
        window.scrollTo(0,8000);
    });

    await page.evaluate(() => {
        window.scrollTo(0,10000);
    });

    await page.waitForTimeout(1000);
    console.log("Loading sentences..");
    //await page.$$eval('body', t => { window.scrollTo(0,1000000) });
    const sentencesJson = await page.$$eval('ol', ols => {

        const retArr = [];
        const lis = ols[0].getElementsByTagName("li");
        for (let i = 0; i < lis.length; i++) {
            try {
                let a = lis[i].getElementsByTagName("a")[0];
                let img = lis[i].getElementsByTagName("img")[0];

                if( img )
                    retArr.push({
                        text: a.text.toUpperCase(),
                        imageSrc: img.src
                    });
            }
            catch (e) {
                console.log("Failed to parse a sentence: " + e);
            }
        }

        return JSON.stringify(retArr);
    });

    await browser.close();

    const sentenceArr = JSON.parse(sentencesJson);
    sentences = parsePuppeteerSentences(sentenceArr);
    console.log("Amount of sentences: "+sentenceArr.length);
}

const parsePuppeteerSentences = (sentenceArr : Sentence[]) => {
    return sentenceArr.map( sentence => (
        {
            text : decodeSentenceText(sentence.text.toUpperCase()),
            imageSrc: sentence.imageSrc
        }
    ));
}

const decodeSentenceText = (text: string) => {
    return Array.from(decode(text)).filter((char) => char.charCodeAt(0) !== 173).join('');
}

const isSpecialLetter = (letter: string) => {
    return !letter.match(/[A-ZÄÖ]/g)
};

export const createInitialLetterRevealState = (sencence: string) => {
    const revealStates = [];
    for (let i = 0; i < sencence.length; i++)
        if (isSpecialLetter(sencence.charAt(i)))
            revealStates.push(LetterRevealState.REVEALED);
        else
            revealStates.push(LetterRevealState.UNREVEALED);
    return revealStates;
}

let sentenceIdx = 0;

export const getNextSentence = () => {
    sentenceIdx++;
    if (sentenceIdx >= sentences.length)
        return { text: "", imageSrc: "" };

    return sentences[sentenceIdx];
}

export const getSentences = () => {
    return [...sentences];
};
