import React, { useEffect, useState, useContext } from "react";
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from "./pages/Home/Home";
import Room from "./pages/Room/Room";
import Booking from "./pages/Bookings/Booking";
import Concierge from "./pages/Concierge/Concierge";
import AddUser from "./pages/Concierge/addUser";
import AddRoom from "./pages/Room/AddRoom";
import EditRoom from "./pages/Room/EditRoom";
import CheckRoom from "./pages/Room/CheckRoom";
import EditUserOnContext from "./pages/Dashboard/editUserOnContext";
import EditUser from "./pages/Concierge/editUser";
import CheckUser from "./pages/Concierge/CheckUser";
import EditDocumentBooking from "./pages/Bookings/editDocumentBooking";
import { UserContext } from './context/userContext'; 
import Reviews from "./pages/Reviews/Reviews";
import { PrivateRoutes } from './AuthProvider/PrivateRoutes';
import { LoginAPI } from "./validators/LoginAPI";
import { ConciergeUsers as ConciergeUserClass} from "./features/Types/typeInterfaces";
import {  useDispatch, useSelector } from "react-redux";
import {  conciergeStatusSelect, conciergeErrorSelect, conciergeDataSelect} from "./features/conciergeOperations/conciergeSlice";
import { AppDispatch } from "./app/store";
import { conciergeUsersThunk } from "./features/conciergeOperations/conciergeUsersThunk";

//////

function App() {

  const conciergeDataSinMapear = useSelector(conciergeDataSelect);
  const [usersMostrar, setUsersMostrar] = useState<ConciergeUserClass[]>([]);
  const conciergeStatus = useSelector(conciergeStatusSelect);
  const conciergeError = useSelector(conciergeErrorSelect);
  const dispatch = useDispatch<AppDispatch>();
  const [conciergeData, setConciergeData] = useState<ConciergeUserClass[]>([]);
  const [loginAttempt, setLoginAttempt] = useState<boolean>(false)


  interface Form {
    name:string,
    pass:string
}

useEffect(() => {
  const login = async () => {
      await LoginAPI();
      const storedUser = localStorage.getItem('user');
      console.log(storedUser);
      console.log(userContext?.state);
      if (storedUser && userContext) {
        userContext.dispatch({ type: 'SET_USERDATA', payload: JSON.parse(storedUser) });
      }
      console.log(userContext?.state);
      setLoginAttempt(true)
    }
    login();
  }, []);

useEffect(() => {
  if(loginAttempt){
      if (usersMostrar.length === 0) {
        if (conciergeStatus === "idle") {
          dispatch(conciergeUsersThunk());
        } else if (conciergeStatus === "fulfilled") {
          let conciergeDataMapeado: ConciergeUserClass[] = [];
          conciergeDataSinMapear.forEach((user) => {
            const añadirConciergeUser: ConciergeUserClass = {
              photo: user.photo,
              _id: user._id,
              name: user.name,
              job: user.job,
              startDate: user.startDate,
              phone: user.phone,
              status: user.status,
              email: user.email,
              pass: user.pass,
            };
            conciergeDataMapeado.push(añadirConciergeUser);
          });
          setConciergeData(conciergeDataMapeado);
          console.log(conciergeData)
        } else if (conciergeStatus === "rejected") {
          console.log(conciergeError);
        }
      }
    };
  }, [loginAttempt, usersMostrar, conciergeStatus, conciergeDataSinMapear, conciergeError]);

  const userContext = useContext(UserContext);
  const navigate = useNavigate()



  const loginUser = async (formData: Form) => {
    console.log("hola, entramos a lafuncion loginUser")
    const auth = `${import.meta.env.VITE_MIAPI}/auth`;
    const token = localStorage.getItem('authorization');
    const response = await fetch(auth, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        pass: formData.pass,
      }),
    });

    if (!response.ok) {
      console.log('Error de autenticación: Credenciales inválidas');
      return;
    }
    const data = await response.json();

    const existsUser = conciergeData.find((user) => user.name === formData.name);

    if (data.success && existsUser) {
      const { email, pass, name } = existsUser;
      if (userContext) {
        userContext.dispatch({ type: 'SET_USERDATA', payload: { email, pass, name } });
        localStorage.setItem('user', JSON.stringify({ email, pass, name }));
        localStorage.setItem("isLogged", "true");
        navigate('/home');
      }
    }else {
      if (userContext) {
        userContext.dispatch({ type: 'LOGOUT' });
      }
    }
  };

  return (
    <Routes>
      <Route path="/login" element={userContext?.state.user.autenticado ? <Navigate to="/" /> : <Login loginUser={loginUser} />} />
      <Route path="/" element={
        <PrivateRoutes>
          <Dashboard />
        </PrivateRoutes>
      }>
        <Route path="/home" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/editBooking/:bookingId" element={<EditDocumentBooking />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/concierge" element={<Concierge />} />
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/editUser/:userId" element={<EditUser />} />
        <Route path="/checkUser/:userId" element={<CheckUser />} />
        <Route path="/addRoom" element={<AddRoom />} />
        <Route path="/editRoom/:roomId" element={<EditRoom />} />
        <Route path="/checkRoom/:roomId" element={<CheckRoom />} />
        <Route path="/editUserOnContext" element={<EditUserOnContext />} />
      </Route>
    </Routes>
  );
}

export default App;
