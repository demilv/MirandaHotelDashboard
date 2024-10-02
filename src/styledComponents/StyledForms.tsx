import styled from "styled-components";

export const FormContainer = styled.div`
    display: flex;
    border:1px solid;
    flex-direction: column;
    margin: 0 auto;
    margin-top:2em;
    padding-top:0.8em;
    padding-bottom:1.8em;
    justify-content: center; 
    justify-content: center;
    align-items: center;
    width:45em;
    max-width:60em;
    border: none;
    border-radius: 0.25em;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.6); 
    background-color: rgb(247, 247, 247);  
`

export const RadioOuterContainer = styled.div`
    display:flex;
    flex-direction:row;
`

export const RadioBigContainer = styled.div`
    display:flex;
    flex-direction:column;
    margin-right:3em;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
`

export const PairRadio = styled.div`
    display:inline-flex;
    padding:0.5em;    
    gap:0.7em;
    margin: 0.2em 0 0.2em 1.2em;

`

export const H4Form = styled.h4`
    padding: 0.2em 0 0.2em 0.5em;
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size:1.5em;
    color: rgb(98, 93, 0);
`

export const GeneralInputs = styled.input`
    padding: 0.5em 0 0.5em 0.8em;
    width:25em;
    margin: 0.2em 0 0.2em 1.2em;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
`

export const GeneralSelects = styled.select`
    padding: 0.5em 0 0.5em 0.8em;
    width:25em;
    margin: 0.2em 0 0.2em 1.2em;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
`

export const ButtonConfirm = styled.input`
    margin: 1em 0 0 7em; 
    align-items: center;
    background-color: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: .25rem;
    box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.85);
    cursor: pointer;
    display: inline-flex;
    font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 16px;
    font-weight: 600;
    justify-content: center;
    line-height: 1.25;
    min-height: 3rem;
    padding: calc(.875rem - 1px) calc(1.5rem - 1px);
    position: relative;
    text-decoration: none;
    transition: all 250ms;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
    width: auto;
    
    &:hover,
    &:focus {
        border-color: rgba(0, 0, 0, 0.15);
        box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
        color: rgba(0, 0, 0, 0.65);
        transform: translateY(-1px);
    }

    &:active {
        background-color: #F0F0F1;
        border-color: rgba(0, 0, 0, 0.15);
        box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
        color: rgba(0, 0, 0, 0.65);
        transform: translateY(0);
    }
`