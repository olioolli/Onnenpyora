import { useEffect } from 'react';
import styled from 'styled-components';

export type LetterProps = {
    letter : string;
    isLastRevealed: boolean;
    isRevealed: boolean;
};

let idCounter = 0;

export const LetterTileComponent = (props : LetterProps) => {

    let borderstyle = props.isLastRevealed ? {border: "2px solid #12ff45"} : {};
    const style = { ...borderstyle, background: props.letter === '' ? "yellow" : props.letter === ' ' ? "#d7bebe" : "white" };

    return (
        <div style={ style } className={"letterTile"} >
            {props.letter}
        </div>
    );
};