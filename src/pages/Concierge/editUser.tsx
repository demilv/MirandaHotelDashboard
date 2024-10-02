import { ButtonConfirm, FormContainer, GeneralInputs, GeneralSelects, H4Form, RadioOuterContainer } from "../../styledComponents/StyledForms";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { editUser, conciergeDataSelect } from "../../features/conciergeOperations/conciergeSlice";
import { AppDispatch } from "../../app/store";

interface ConciergeUser {
    _id: string;
    photo: string;
    name: string;
    job: string;
    email: string;
    phone: string;
    startDate: string;
    status: boolean;
    pass: string;
}

const EditUser = () : React.JSX.Element => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { userId } = useParams<{ userId: string }>();
    const users: ConciergeUser[] = useSelector(conciergeDataSelect);

    const userToEdit = users.find(user => user._id === userId);

    const [formData, setFormData] = useState({
        _id: userToEdit?._id,
        photo: userToEdit?.photo || "",
        name: userToEdit?.name || "",
        job: userToEdit?.job || "Manager",
        email: userToEdit?.email || "",
        phone: userToEdit?.phone || "",
        startDate: userToEdit?.startDate || "",
        status: userToEdit?.status ? "Yes" : "No",
        password: userToEdit?.pass || "",
    });

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                _id: userToEdit._id,
                photo: userToEdit.photo,
                name: userToEdit.name,
                job: userToEdit.job,
                email: userToEdit.email,
                phone: userToEdit.phone,
                startDate: userToEdit.startDate,
                status: userToEdit.status ? "Yes" : "No",
                password: userToEdit.pass,
            });
        }
    }, [userToEdit]);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            status: formData.status === "Yes",
        };
        console.log(updatedFormData)

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

        if (formData.password.toLowerCase() === "" || formData.password.toLowerCase() === "0"){
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


        dispatch(editUser(updatedFormData));

        try {
            const MIAPI = import.meta.env.VITE_MIAPI;
            const response = await fetch(`${MIAPI}/users/upUser/${formData._id}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authorization')}`,
                },
                body: JSON.stringify(updatedFormData),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error al actualizar el usuario en la API:', errorMessage);
            } else {
                console.log('Usuario actualizado en la API.');
            }
        } catch (error) {
            console.error('Error al actualizar usuario en la API:', error);
        }

        Swal.fire({
            title: "Good job!",
            text: "User updated successfully!",
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
                <GeneralInputs type="text" name="name" value={formData.name} onChange={handleChange} />
                <H4Form>Your Job</H4Form>
                <GeneralSelects name="job" value={formData.job} onChange={handleChange}>
                    <option>Manager</option>
                    <option>Reception</option>
                    <option>Room Service</option>
                </GeneralSelects>
                <H4Form>Your Email</H4Form>
                <GeneralInputs type="email" name="email" value={formData.email} onChange={handleChange} />
                <H4Form>Your Phone number</H4Form>
                <GeneralInputs type="text" name="phone" value={formData.phone} onChange={handleChange} />
                <H4Form>Start date</H4Form>
                <GeneralInputs type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                <H4Form>Are you currently active?</H4Form>
                <GeneralSelects name="status" value={formData.status} onChange={handleChange}>
                    <option>Yes</option>
                    <option>No</option>
                </GeneralSelects>
                <H4Form>Your password</H4Form>
                <GeneralInputs type="password" name="password" value={formData.password} onChange={handleChange} />
                <RadioOuterContainer></RadioOuterContainer>
                <ButtonConfirm type="submit" value="Update user" />
            </form>
        </FormContainer>
    );
};

export default EditUser;
