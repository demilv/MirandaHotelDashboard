import styled from "styled-components";

export const TextNumberBig = styled.h2`
    font-size:1em;
    font-weight:700
`

export const TextH5Light = styled.h5`
    font-size:0.85em;
    font-weight:400;
`

export const TextColorful = styled.p`
    border:none;
    font-weight:700;
    padding: 0.5em 2em 1em 2em;
    max-width: 10em;
    color: ${props => {
        if (props.color === 'green') return 'green';
        if (props.color === 'red') return 'red';
        if (props.color === 'yellow') return 'yellow';
        return 'grey';
    }};
    background-color: ${props => {
        if (props.color === 'green') return 'rgb(177, 242, 177);';
        if (props.color === 'red') return 'rgb(231, 138, 138)';
        if (props.color === 'yellow') return 'grey';
        return 'grey';
    }};
`

export const TextColorfulNoBackground = styled.p`
    border:none;
    font-weight:700;
    color: ${props => {
        if (props.color === 'green') return 'green';
        if (props.color === 'red') return 'red';
        return 'grey';
    }};    
`