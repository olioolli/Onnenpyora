export const letterPoints: Record<string, number> = {};
letterPoints["A"] = 1;
letterPoints["B"] = 10;
letterPoints["C"] = 10;
letterPoints["D"] = 7;
letterPoints["E"] = 2;
letterPoints["F"] = 8;
letterPoints["G"] = 4;
letterPoints["H"] = 3;
letterPoints["I"] = 2;
letterPoints["J"] = 3;
letterPoints["K"] = 3;
letterPoints["L"] = 3;
letterPoints["M"] = 2;
letterPoints["N"] = 2;
letterPoints["O"] = 2;
letterPoints["P"] = 4;
letterPoints["Q"] = 10;
letterPoints["R"] = 4;
letterPoints["S"] = 3;
letterPoints["T"] = 3;
letterPoints["U"] = 5;
letterPoints["V"] = 5;
letterPoints["X"] = 10;
letterPoints["Y"] = 3;
letterPoints["Z"] = 10;
letterPoints["Ä"] = 5;
letterPoints["Ö"] = 5;

export enum LetterRevealState {
    UNREVEALED = 0,
    REVEALED = 1,
    REVEALED_LAST_TURN = 2
}

export type Sentence = {
    text: string;
    imageSrc: string;
}

export type PlayerState = {
    name: string;
    points: number;
}

export type GameState = {
    letterRevealState: LetterRevealState[];
    playerStates : PlayerState[];
    turnOfPlayer: string;
    currentSentence: Sentence;
}

export const copyGameState = (gameState : GameState) => {
    const letterRevealState = [...gameState.letterRevealState];
    const playerStates = [...gameState.playerStates];
    return {
        letterRevealState,
        playerStates,
        turnOfPlayer: gameState.turnOfPlayer,
        currentSentence: gameState.currentSentence
    };
}

export const createDummyGameState = (sentence: Sentence) => {

    const playerStates = [
        {name: "", points: 0},
        {name: "", points: 0}
    ];

    return {
        currentSentence: sentence,
        playerStates,
        turnOfPlayer : playerStates[0].name,
        letterRevealState : []
    };
}