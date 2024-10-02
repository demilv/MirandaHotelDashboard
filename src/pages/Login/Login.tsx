import React from 'react'
import './Login.css'
import { useState } from "react";
import { useLocation } from "react-router-dom"

interface UserData {
    name: string;
    pass: string;
}

interface LoginProps {
    loginUser: (formData: UserData, prevRoute: string | null) => void;
}

const datos_user = {
    name: "",
    pass: ""
}

const Login: React.FC<LoginProps> = ({ loginUser }) => {    const location = useLocation()
    const { state } = location
    console.log(location)

    const [formData, setFormData] = useState(datos_user)
    
    const changeInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = ev.target;
        console.log(name, value)
        setFormData({ ...formData, [name]: value })
    }
    const submitForm = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        console.log("se han enviado los datos");
        loginUser(formData, state ? state.prevRoute : null)
        setFormData(datos_user);
    }

    return (<form className="form-container" onSubmit={submitForm}>
        <label htmlFor="name">
            Username
            <input type="name" name="name" id="name" onChange={changeInput} />
        </label>
        <label htmlFor="pass">
            Password
            <input type="password" name="pass" id="pass" onChange={changeInput}
                value={formData.pass} />
        </label>
        <div>
            <button className="submit-bttn" type="submit">Log in</button>
        </div>
        <p className="hint"> Una pequeña pista. Si aún no creaste tu propio usuario para entrar o simplemente es tu primera vez, introduce
            el usuario "demilv" y la password "Pass123" sin las comillas para poder entrar. Difruta de la página
        </p>
    </form>)
}
export default Login