"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSentences = exports.getNextSentence = exports.createInitialLetterRevealState = exports.retrieveSentences = void 0;
var request_promise_1 = __importDefault(require("request-promise"));
var jsdom_1 = __importDefault(require("jsdom"));
var types_1 = require("./types");
var html_entities_1 = require("html-entities");
var defaultUrl = 'https://yle.fi/uutiset/18-220306';
var JSDOM = jsdom_1.default.JSDOM;
var sentences = [];
var retrieveSentences = function (url) {
    if (url === void 0) { url = defaultUrl; }
    (0, request_promise_1.default)(url).then(function (html) {
        var dom = new JSDOM(html);
        sentences = [];
        var ol = dom.window.document.getElementsByTagName("ol")[0];
        var lis = ol.getElementsByTagName("li");
        for (var i = 0; i < lis.length; i++) {
            var a = lis[i].getElementsByTagName("a")[0];
            var img = lis[i].getElementsByTagName("img")[0];
            sentences.push({
                text: decodeSentenceText(a.text.toUpperCase()),
                imageSrc: img.src
            });
        }
    })
        .catch(function (err) {
        console.log("Failed to get sentences: " + err);
    });
};
exports.retrieveSentences = retrieveSentences;
var decodeSentenceText = function (text) {
    return Array.from((0, html_entities_1.decode)(text)).filter(function (char) { return char.charCodeAt(0) !== 173; }).join('');
};
var isSpecialLetter = function (letter) {
    return !letter.match(/[A-ZÄÖ]/g);
};
var createInitialLetterRevealState = function (sencence) {
    var revealStates = [];
    for (var i = 0; i < sencence.length; i++)
        if (isSpecialLetter(sencence.charAt(i)))
            revealStates.push(types_1.LetterRevealState.REVEALED);
        else
            revealStates.push(types_1.LetterRevealState.UNREVEALED);
    return revealStates;
};
exports.createInitialLetterRevealState = createInitialLetterRevealState;
var sentenceIdx = 0;
var getNextSentence = function () {
    sentenceIdx++;
    if (sentenceIdx >= sentences.length)
        return { text: "", imageSrc: "" };
    return sentences[sentenceIdx];
};
exports.getNextSentence = getNextSentence;
var getSentences = function () {
    return __spreadArray([], sentences, true);
};
exports.getSentences = getSentences;
