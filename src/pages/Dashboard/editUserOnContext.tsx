import { ButtonConfirm, FormContainer, GeneralInputs, H4Form } from "../../styledComponents/StyledForms";
import React, {useContext, useState, useEffect} from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { conciergeDataSelect } from "../../features/conciergeOperations/conciergeSlice";
import { useSelector } from "react-redux";

const EditUserOnContext = () : React.JSX.Element => {

    const navigate = useNavigate()
    const users = useSelector(conciergeDataSelect)

    const user = {
        name:"",
        pass:"",
        email:""
    }

    const [values, setValues] = useState(user);
    const userContext = useContext(UserContext);
    const userModify = users.find(user => user.email === userContext?.state.user?.email);

    useEffect(() => {
        if (userContext?.state.user) {
            setValues({
                email: userContext.state.user.email || "",
                pass: userContext.state.user.pass || "",
                name: userContext.state.user.name || ""
            });
        }
    }, [userContext]);


    const edit = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {value, name} = e.target
        setValues({...values, [name]: value})
    }    

    const submitEditedUser= async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        const {email, pass, name} = values

        if (values.name.toLowerCase() === "demilv") {
            Swal.fire({
                title: "Error",
                text: "No puedes cambiarte el nombre a 'demilv'.",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: true
            });
            return;
        }

        if (userContext?.state.user?.name?.toLowerCase() === "demilv") {
            Swal.fire({
                title: "Error",
                text: "No puedes modificar el usuario 'demilv'.",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: true
            });
            return;
        }

        if (userContext) {
            userContext.dispatch({ type: 'SET_USERDATA', payload: { email, pass, name } });
            localStorage.setItem('user', JSON.stringify({ email, pass, name }));
            console.log(userContext.state);
        }

        try {
            const MIAPI = import.meta.env.VITE_MIAPI;
            const response = await fetch(`${MIAPI}/users/upUser/${userModify?._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authorization')}`,
                },
                body: JSON.stringify({ email, pass, name }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error al actualizar el usuario en la API:', errorMessage);
                return;
            }

            console.log('Usuario actualizado en la API.');
        } catch (error) {
            console.error('Error al actualizar usuario en la API:', error);
        }

        navigate("/home")
    }

    return(
        <FormContainer>
            <form onSubmit={submitEditedUser}>
                <H4Form>Your new name</H4Form>
                <GeneralInputs type="text" name="name" onChange={edit} value={values.name}/>
                <H4Form>Your new Email</H4Form>
                <GeneralInputs type="email" name="email" onChange={edit} value={values.email}/>
                <H4Form>Your new Password</H4Form>
                <GeneralInputs type="password" name="pass" onChange={edit} />
                <H4Form>Recuerda, esto cambia tu login</H4Form>
                <ButtonConfirm type="submit" value="New edited user"/>
            </form>
        </FormContainer>
    )
}

export default EditUserOnContext