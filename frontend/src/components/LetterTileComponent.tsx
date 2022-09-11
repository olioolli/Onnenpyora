import { useEffect } from 'react';
import styled from 'styled-components';

export type LetterProps = {
    letter : string;
    isLastRevealed: boolean;
    isRevealed: boolean;
};

let idCounter = 0;

export const LetterTileComponent = (props : LetterProps) => {
    
    let borderstyle = props.isLastRevealed ? {
        border: "2px solid rgb(18, 255, 69)",
        color: "white",
        fontWeight: "bold" as 'bold'
    } : {};

    let bgColor = props.letter === '' ? "yellow" : props.letter === ' ' ? "#d7bebe" : "white";
    if( props.isLastRevealed )
        bgColor = "#042c09";
        
    const style = { ...borderstyle, background: bgColor };

    return (
        <div style={ style } className={"letterTile"} >
            {props.letter}
        </div>
    );
};