"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGameState = exports.LetterRevealState = exports.letterPoints = void 0;
var dataFetcher_1 = require("./dataFetcher");
exports.letterPoints = {};
exports.letterPoints["A"] = 1;
exports.letterPoints["B"] = 10;
exports.letterPoints["C"] = 10;
exports.letterPoints["D"] = 7;
exports.letterPoints["E"] = 2;
exports.letterPoints["F"] = 8;
exports.letterPoints["G"] = 4;
exports.letterPoints["H"] = 3;
exports.letterPoints["I"] = 2;
exports.letterPoints["J"] = 3;
exports.letterPoints["K"] = 3;
exports.letterPoints["L"] = 3;
exports.letterPoints["M"] = 2;
exports.letterPoints["N"] = 2;
exports.letterPoints["O"] = 2;
exports.letterPoints["P"] = 4;
exports.letterPoints["Q"] = 10;
exports.letterPoints["R"] = 4;
exports.letterPoints["S"] = 3;
exports.letterPoints["T"] = 3;
exports.letterPoints["U"] = 5;
exports.letterPoints["V"] = 5;
exports.letterPoints["X"] = 10;
exports.letterPoints["Y"] = 3;
exports.letterPoints["Z"] = 10;
var LetterRevealState;
(function (LetterRevealState) {
    LetterRevealState[LetterRevealState["UNREVEALED"] = 0] = "UNREVEALED";
    LetterRevealState[LetterRevealState["REVEALED"] = 1] = "REVEALED";
    LetterRevealState[LetterRevealState["REVEALED_LAST_TURN"] = 2] = "REVEALED_LAST_TURN";
})(LetterRevealState = exports.LetterRevealState || (exports.LetterRevealState = {}));
var createGameState = function (sentence) {
    return {
        currentSentence: sentence,
        playerStates: [],
        turnOfPlayer: '',
        letterRevealState: (0, dataFetcher_1.createInitialLetterRevealState)(sentence.text)
    };
};
exports.createGameState = createGameState;
