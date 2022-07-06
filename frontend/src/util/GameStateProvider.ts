import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BE_URL, BE_WS_URL } from "../state";
import { letterPoints, LetterRevealState, PlayerState, GameState, copyGameState, createDummyGameState } from "../types/types";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { getCurrentPlayerName } from "./utils";

export const useGameState = () => {

    const [gameState, setGameState ] = useState<GameState>(createDummyGameState({text: "", imageSrc: ""}));

    const isLetterAtIndexRevealed = (idx: number) => {
        return gameState.letterRevealState[idx] > LetterRevealState.UNREVEALED;
    }

    const clearLastTurnReveal = (newLetterRevealState) => {
        for (let i = 0; i < gameState.currentSentence.text.length; i++)
            if (gameState.letterRevealState[i] === LetterRevealState.REVEALED_LAST_TURN)
                newLetterRevealState[i] = LetterRevealState.REVEALED;
        return newLetterRevealState;
    }

    const updateGameState = (newLetterRevealState?, newPlayerStates?, turnOfPlayer? : string) => {
        const newState = copyGameState({
            ...gameState,
            letterRevealState: newLetterRevealState ? newLetterRevealState : gameState.letterRevealState,
            playerStates: newPlayerStates ? newPlayerStates : gameState.playerStates,
            turnOfPlayer: turnOfPlayer ? turnOfPlayer : gameState.turnOfPlayer,
        });
        return newState;
    }

    const revealWord = (word: string) => {

        const newLetterRevealState = clearLastTurnReveal([...gameState.letterRevealState]);

        let idx = gameState.currentSentence.text.indexOf(word);
        let totalPoints = 0;

        while (idx >= 0) {

            for (var i = idx; i < idx + word.length; i++) {
                if (gameState.letterRevealState[i] === LetterRevealState.UNREVEALED) {
                    const points = letterPoints[gameState.currentSentence.text[i]];
                    totalPoints += points;
                    newLetterRevealState[i] = LetterRevealState.REVEALED_LAST_TURN;
                }
                else
                    break;
            }

            idx = gameState.currentSentence.text.indexOf(word, idx+word.length);
        }

        const newPlayerStates = [...gameState.playerStates];
        const playerIdx = newPlayerStates.findIndex( player => player.name === getCurrentPlayerName() );
        newPlayerStates[playerIdx].points += totalPoints;
        
        sendGameStateToBE(updateGameState(newLetterRevealState, newPlayerStates,getNextPlayer()));
    };

    const getPlayers = (): string[] => gameState.playerStates.map( ps => ps.name );

    const getNextPlayer = () => {
        const players = getPlayers();
        let currentPlayerIdx = players.findIndex( (player) => player === gameState.turnOfPlayer );
        currentPlayerIdx++;
        if( currentPlayerIdx >= players.length )
            currentPlayerIdx = 0;
        return players[currentPlayerIdx];
    }

    const sendGameStateToBE = async (state: GameState) => {
        const resp = await axios.post(BE_URL + "/game", { game: state });
        setGameState(resp.data);
    };

    const fetchGameStateFromBe = useCallback(() => {
        axios.get(BE_URL + "/game").then((resp) => {
            setGameState(resp.data);
        })
    }, []);

    useEffect(() => {

        let client = new W3CWebSocket(BE_WS_URL);

        client.onopen = () => {};

        client.onmessage = (message) => {

            const newGameState = JSON.parse(message.data as string);
            if (newGameState)
                setGameState(newGameState);
        };

        fetchGameStateFromBe();
    }, [fetchGameStateFromBe]);

    return {
        isLetterAtIndexRevealed: isLetterAtIndexRevealed,
        gameState: gameState,
        currentSentence: gameState.currentSentence,
        revealWord: revealWord,
    };
}