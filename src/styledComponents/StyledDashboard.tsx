import styled from "styled-components";

export const MainNavbar = styled.div`    
    padding-left: 11%;
    width: 100%;
`

export const NavbarContainer = styled.div`    
    width:100%;
    height: 7em;
    display: flex;
    flex-direction: row;
    position: relative;
`
export const NavbarBurger  = styled.button`
    border: none;
    background-color: transparent;
    margin-left: 2em;
    cursor: pointer;
`


export const NavbarMain = styled.div`    
    display: flex;
    flex-direction: row;
    background-color: rgb(247, 247, 247);    
    width: 100%;
    transition: margin-left 0.3s ease;
`

export const NavbarMainTitle = styled.h1`    
    margin: 1.1em 28em 0 2em;
`

export const StyledIcon = styled.div`
    color: #3498db; 
    font-size: 2em;
    & > * {
        margin: 1.2em 0 0 2.5em;
    }
`;

export const NavbarAside = styled.div<{isVisible: boolean}>`
  display: flex;
  position: absolute;
  left: -13.9em;
  transform: ${({ isVisible }) => (isVisible ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease;
  flex-direction: column;
  text-align: center;
  border: none;
  width: 13.8em;
  height: 100%;
  background-color: white;
  z-index: ${({ isVisible }) => (isVisible ? '0' : '-1')};
`;

export const NavbarAsideLogo = styled.img`
    width: 80%;
    margin-left:auto;
    margin-right:auto;
    margin-bottom:2em;
    border:none;
`
export const NavbarAsideImg = styled.img`
    width: 3.5em;
    margin-top: 8.3em;
    position: absolute;
    top: 21em;
    left: calc(50% - 1.75em);
`

export const NavbarAsideH2 = styled.h2`
    margin: 7em 0 3em 0;    
    font-size: 1em;
`

export const NavbarAsideMyData = styled.div`
    padding-top: 1.5em;
    width: 9em;
    margin-top: 10em;
    margin-left: auto;
    margin-right: auto;
    background-color: rgb(241, 241, 241);
    box-shadow: 0 0.85em 1.5em 0 #7777775c;
    border-radius: 0.8em;

`

export const NavbarAsideMyDataMail = styled.div`
    font-size: 0.5em;
    margin: 0.8em 0 1.5em;
`

export const NavbarAsideMyDataContact  = styled.button`
    border-radius: 0.8em;
    border: none;
    background-color: rgb(177, 242, 177);
    color: green;
    width: 7em;
    height: 2em;
    margin-bottom: 1.5em;
`

export const NavbarAsideH6 = styled.h6`
    margin-bottom: 1em;
    font-size:0.8em;
    color: #5b755b;
`

export const NavbarAsideH3 = styled.h3`
    font-size:1em;
`

export const OutletContainer = styled.div`    
    width:100%;
    padding: 2em;
    z-index:1;    
    min-height:52.55em;
    background-color: rgb(235, 235, 235);
`
