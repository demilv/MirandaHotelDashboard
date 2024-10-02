import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CiMail, CiBellOn } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { GiCancel, GiExitDoor } from "react-icons/gi";
import { ButtonAside } from "../../styledComponents/StyledButton";
import { MainNavbar, NavbarContainer, OutletContainer, NavbarBurger, NavbarMain, NavbarMainTitle, StyledIcon, NavbarAside, NavbarAsideLogo, NavbarAsideImg, NavbarAsideH2, NavbarAsideMyData, NavbarAsideMyDataMail, NavbarAsideMyDataContact, NavbarAsideH6, NavbarAsideH3 } from "../../styledComponents/StyledDashboard";
import { UserContextType } from "../../features/Types/typeInterfaces";
import { Context } from "react";

const Dashboard = () : React.JSX.Element => {
  const [isAsideVisible, setIsAsideVisible] = useState<boolean>(true);
  const [active, setActive] = useState<string>("");
  const [location, setLocation] = useState<string>("Home")
  const { state, dispatch } = useContext(UserContext as Context<UserContextType>);
  const navigate = useNavigate();
  const currentLocation = useLocation(); 

  useEffect(() => {
    const path = currentLocation.pathname;
    //aunque ya se la ruta mediante los botones esto me ayuda para cambiar el active si el usuario refresca la página
    if (path.includes("/room")) {
      setLocation("Rooms");
      setActive("Room");
    } else if (path.includes("/booking")) {
      setLocation("Bookings");
      setActive("Bookings");
    } else if (path.includes("/reviews")) {
      setLocation("Reviews");
      setActive("Contact");
    } else if (path.includes("/concierge")) {
      setLocation("Concierge");
      setActive("Concierge");
    } else {
      setLocation("Home");
      setActive("Dashboard");
    }
  }, [currentLocation]);

  useEffect(() => {
    console.log('Esto es el contxt en Dashboard:', state);
  }, [state]);

  const toggleAside = () => {
    setIsAsideVisible(!isAsideVisible);
  };

  const logoutUser = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
    localStorage.setItem("isLogged", "false");
    navigate('/login');
  };

  return (
    <>
      <MainNavbar>
        <NavbarContainer>
          <NavbarAside isVisible={isAsideVisible}>
            <NavbarAsideLogo src="./logoDash.png" alt="Logo" />
            <ButtonAside active={active === "Dashboard"} onClick={() => { setActive("Dashboard"); navigate('/home'); setLocation("Home") }}>Home</ButtonAside>
            <ButtonAside active={active === "Room"} onClick={() => { setActive("Room"); navigate('/room'); setLocation("Rooms") }}>Rooms</ButtonAside>
            <ButtonAside active={active === "Bookings"} onClick={() => { setActive("Bookings"); navigate('/booking'); setLocation("Bookings") }}>Bookings</ButtonAside>
            <ButtonAside active={active === "Contact"} onClick={() => { setActive("Contact"); navigate('/reviews'); setLocation("Reviews") }}>Reviews</ButtonAside>
            <ButtonAside active={active === "Concierge"} onClick={() => { setActive("Concierge"); navigate('/concierge'); setLocation("Concierge") }}>Concierge</ButtonAside>
            <NavbarAsideImg src="./IMG_20191223_131827 (2) Grande.jpg" alt="Profile" />
            <NavbarAsideMyData>
              <NavbarAsideH3>{state.user.name}</NavbarAsideH3>
              <NavbarAsideMyDataMail>{state.user.email}</NavbarAsideMyDataMail>
              <NavbarAsideMyDataContact onClick={() => navigate('/editUserOnContext')}>Modify data</NavbarAsideMyDataContact>
            </NavbarAsideMyData>
            <NavbarAsideH2>Hotel Admin Dashboard</NavbarAsideH2>
            <NavbarAsideH6>@ 2024 All Rights Reserved</NavbarAsideH6>
            <NavbarAsideH6>Made with &hearts; by Gonzalo</NavbarAsideH6>
          </NavbarAside>           
          <NavbarMain>
            <NavbarBurger data-testid="navbar-burger" onClick={toggleAside}>
              {isAsideVisible ? <GiCancel /> : <RxHamburgerMenu />}
            </NavbarBurger>
            <NavbarMainTitle>{location}</NavbarMainTitle>
            <StyledIcon>
              <CiMail />
              <CiBellOn />
              <GiExitDoor  onClick={logoutUser}/>
            </StyledIcon>
          </NavbarMain>
        </NavbarContainer>
        <OutletContainer>
          <Outlet />
        </OutletContainer>
      </MainNavbar>
    </>
  );
}

export default Dashboard;

