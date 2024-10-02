import styled from "styled-components";

export const CajaMainContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-left:auto;
    margin-right:auto;
    margin-bottom:3em;
    justify-content:center;
    width:100%;
`;

export const CajaImg = styled.div<{isSelected : boolean}>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 6em;
    height: 6em;
    background-color: ${({ isSelected }) => (isSelected ? 'rgb(200, 50, 50)' : 'rgb(255, 99, 99)')};
    margin-right: 1em;
    transition: background-color 0.3s;
`;

export const CajaStyled = styled.div`
    border-radius: 0.4em;
    border: none;
    padding: 2em 1.2em;
    width: 20em;
    height:10em;
    display: flex;
    flex-direction: row;
    border: none;
    margin:5em 2em 5em 0;
    background-color: white;
`;

export const CajaDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

export const CajaSwiperContainer = styled.div`
    background-color:white;
    padding: 2.5em 1em 5em 1em;
    border-radius: 0.5em;
    margin: 0 3em;
`

export const SwiperTitle = styled.h2`
    font-size:1em;
    margin-bottom:2em;
`
