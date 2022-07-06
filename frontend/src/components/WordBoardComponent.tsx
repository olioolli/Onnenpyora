import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { LetterRevealState } from '../types/types';
import { useGameState } from '../util/GameStateProvider';
import { getCurrentPlayerName } from '../util/utils';
import { LetterSelectComponent } from './LetterSelectComponent';
import { LetterTileComponent } from './LetterTileComponent';
import { PlayerInfo } from './PlayerInfoComponent';

export const WordBoardComponent = () => {

    const { 
        isLetterAtIndexRevealed,
        currentSentence,
        gameState,
        revealWord,
     } = useGameState();

    const getLetterAt = useCallback( (idx : number) => {

        const letter = currentSentence.text[idx];
        return isLetterAtIndexRevealed(idx) ? letter : '';
    },[isLetterAtIndexRevealed, currentSentence])

    const getIsLastRevealed = useCallback( (idx: number) => {
        return gameState.letterRevealState[idx] === LetterRevealState.REVEALED_LAST_TURN;
    },[gameState]);

    const isCurrentPlayerActive = useCallback(() => {
        return getCurrentPlayerName() === gameState.turnOfPlayer;
    }, [gameState, getCurrentPlayerName]);

    return (
        <MainDiv>
            {
                isCurrentPlayerActive() ? <></> : <InactivePlayerBlocker>Not your turn</InactivePlayerBlocker>
            }
            <LetterContainer>
            {
                Array.from(currentSentence.text).map( (character, idx) => (
                    <LetterTileComponent 
                    letter={getLetterAt(idx)}
                    isLastRevealed={getIsLastRevealed(idx)}
                    isRevealed={isLetterAtIndexRevealed(idx)}
                    ></LetterTileComponent>
                ))
            }
            </LetterContainer>
            <Image src={currentSentence.imageSrc}></Image>
            <LetterSelectComponent revealWord={revealWord}/>
            <PlayerInfoContainer>
                {
                    gameState.playerStates.map( playerState => (
                        <PlayerInfo isActive={false} name={playerState.name} points={playerState.points} ></PlayerInfo>   
                    ))
                }
            </PlayerInfoContainer>
        </MainDiv>
    );
}

const PlayerInfoContainer = styled.div`
    position: fixed;
    right: 30px;
`;

const Image = styled.img`
    width: 300px;
    border: 3px solid #54575b;
    border-radius: 2px;
    padding: 2px;
`;

const LetterContainer = styled.div`
    width: 80%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background: #506aa385;
    margin-bottom: 46px;
    padding-top: 34px;
    padding-left: 27px;
    padding-bottom: 6px;
`;

const MainDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-content: center;
    align-items: center;
`;

const InactivePlayerBlocker = styled.div`
  width: 100%;
  height: 100%;
  z-index: 10000;
  background: #762f2f;
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 0.6;
`;