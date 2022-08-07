import rp from 'request-promise';
import jsdom from 'jsdom';
import { LetterRevealState, Sentence } from './types';
import {decode} from 'html-entities';

const defaultUrl = 'https://yle.fi/uutiset/18-220306';
const { JSDOM } = jsdom;

let sentences : Sentence[] = [];

export const retrieveSentences = (url = defaultUrl) => {

    rp(url).then(function(html){
        const dom = new JSDOM(html);
        sentences = [];

        let ol = dom.window.document.getElementsByTagName("ol")[0];

        let lis = ol.getElementsByTagName("li");
        for(let i = 0; i < lis.length; i++) {

            try {
                let a = lis[i].getElementsByTagName("a")[0];
                let img = lis[i].getElementsByTagName("img")[0];

                sentences.push({
                    text: decodeSentenceText(a.text.toUpperCase()),
                    imageSrc: img? img.src : ''
                });
            }
            catch(e) {
                console.log("Failed to parse a sentence: "+e);
            }
        }
    })
    .catch(function(err){
        console.log("Failed to get sentences: "+err);
    });
}

const decodeSentenceText = (text : string ) => {
    return Array.from(decode(text)).filter( (char) => char.charCodeAt(0) !== 173 ).join('');
}

const isSpecialLetter = (letter: string) => {
    return !letter.match(/[A-ZÄÖ]/g)
};

export const createInitialLetterRevealState = (sencence: string) => {
    const revealStates = [];
    for(let i = 0; i < sencence.length; i++)
        if( isSpecialLetter(sencence.charAt(i) ) )
            revealStates.push(LetterRevealState.REVEALED);
        else
            revealStates.push(LetterRevealState.UNREVEALED);
    return revealStates;
}

let sentenceIdx = 0;

export const getNextSentence = () => {
    sentenceIdx++;
    if( sentenceIdx >= sentences.length )
        return {text: "", imageSrc: ""};
    
    return sentences[sentenceIdx];
}

export const getSentences = () => {
    return [...sentences];
};
