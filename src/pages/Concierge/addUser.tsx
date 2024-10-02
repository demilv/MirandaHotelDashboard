import { ButtonConfirm, FormContainer, GeneralInputs, GeneralSelects, H4Form, RadioOuterContainer } from "../../styledComponents/StyledForms";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, conciergeDataSelect } from "../../features/conciergeOperations/conciergeSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AppDispatch } from "../../app/store";
import { conciergeUsersThunk } from "../../features/conciergeOperations/conciergeUsersThunk";

const AddUser = () : React.JSX.Element => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const users = useSelector(conciergeDataSelect);


    const [formData, setFormData] = useState({
        photo: "0",
        name: "0",
        job: "Manager",
        email: "a@gmail.com",
        phone: "0",
        startDate: "0",
        status: true,
        pass: "0"
    });


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { 
                alert('Tu archivo es muy grande');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    photo: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "status" ? value === "yes" : value,
            [name]: name === "startDate" ? new Date(value).toDateString() : value,
        }));
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {   
        e.preventDefault();
        if (formData.name.toLowerCase() === "" || formData.name.toLowerCase() === "0"){
            Swal.fire({
                title: "Error",
                text: "No puedes dejar el usuario vacío",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: true
            });
            return;
        }

        if (formData.name.toLowerCase() === "demilv") {
            Swal.fire({
                title: "Error",
                text: "no puedes ponerte de nombre demilv.",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: true
            });
            return;
        }

        if (formData.pass.toLowerCase() === "" || formData.pass.toLowerCase() === "0"){
            Swal.fire({
                title: "Error",
                text: "No puedes dejar la pass vacía",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: true
            });
            return;
        }

        

        dispatch(addUser(formData));           
        
        try {
            const MIAPI = import.meta.env.VITE_MIAPI;
            console.log(formData)
            const response = await fetch(`${MIAPI}/users/newUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authorization')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error al enviar el usuario a la API:', errorMessage);
            } else {
                console.log('Exito usuario enviado a la API.');
                dispatch(conciergeUsersThunk())
            }
        } catch (error) {
            console.error('Error enviando nuevo usuario a la api:', error);
        }


        Swal.fire({
            title: "Good job!",
            text: "User added successfully!",
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: true
        }).then(() => {
            navigate("/concierge");
        });
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <H4Form>Your Image</H4Form>
                <GeneralInputs type="file" name="photo" onChange={handleFileChange} />
                <H4Form>Your Name</H4Form>
                <GeneralInputs type="text" name="name" onChange={handleChange} />
                <H4Form>Your Job</H4Form>
                <GeneralSelects name="job" onChange={handleChange}>
                    <option>Manager</option>
                    <option>Reception</option>
                    <option>Room Service</option>
                </GeneralSelects>
                <H4Form>Your Email</H4Form>
                <GeneralInputs type="email" name="email" onChange={handleChange} />
                <H4Form>Your Phone number</H4Form>
                <GeneralInputs type="text" name="phone" onChange={handleChange} />
                <H4Form>Start date</H4Form>
                <GeneralInputs type="date" name="startDate" onChange={handleChange} />
                <H4Form>Are you currently active?</H4Form>
                <GeneralSelects name="status" onChange={handleChange}>
                    <option>Yes</option>
                    <option>No</option>
                </GeneralSelects>
                <H4Form>Your password</H4Form>
                <GeneralInputs type="pass" name="pass" onChange={handleChange} />
                <RadioOuterContainer></RadioOuterContainer>
                <ButtonConfirm type="submit" value="New user" />
            </form>
        </FormContainer>
    );
};

export default AddUser;
