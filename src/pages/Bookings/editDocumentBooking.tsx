import { ButtonConfirm, FormContainer, GeneralInputs, GeneralSelects, H4Form, RadioOuterContainer } from "../../styledComponents/StyledForms";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { editBooking, bookingsDataSelect } from "../../features/bookingsOperations/bookingsSlice";
import { AppDispatch } from "../../app/store";


const EditDocumentBooking = () : React.JSX.Element => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { bookingId } = useParams<{bookingId: string}>();
    const bookings = useSelector(bookingsDataSelect);

    const bookingToEdit = bookings.find(booking => booking._id === bookingId);

    const [formData, setFormData] = useState({
        _id: bookingToEdit?._id,
        fotoLink: bookingToEdit?.fotoLink || "",
        guest: bookingToEdit?.guest || "",
        orderDate: bookingToEdit?.orderDate || "",
        checkInDate: bookingToEdit?.checkInDate || "",
        checkOutDate: bookingToEdit?.checkOutDate || "",
        specialRequest: bookingToEdit?.specialRequest || "",
        status: bookingToEdit?.status || "In Progress",
    });

    useEffect(() => {
        if (bookingToEdit) {
            setFormData({
                _id: bookingToEdit._id,
                fotoLink: bookingToEdit.fotoLink,
                guest: bookingToEdit.guest,
                orderDate: bookingToEdit.orderDate,
                checkInDate: bookingToEdit.checkInDate,
                checkOutDate: bookingToEdit.checkOutDate,
                specialRequest: bookingToEdit.specialRequest,
                status: bookingToEdit.status,
            });
        }
    }, [bookingToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "orderDate" ? new Date(value).toDateString() : value,
            [name]: name === "checkInDate" ? new Date(value).toDateString() : value,
            [name]: name === "checkOutDate" ? new Date(value).toDateString() : value,
        }));
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            guest: {value : string},
            orderDate: {value: string},
            checkInDate: {value: string},
            checkOutDate: {value: string},
            specialRequest: {value: string},
            status: {value: string}
        }

        const updatedFormData = {
            _id: formData._id,
            guest : target.guest.value,
            orderDate : target.orderDate.value,
            checkInDate : target.checkInDate.value,
            checkOutDate : target.checkOutDate.value,
            specialRequest : target.specialRequest.value,
            status : target.status.value
        }

        console.log(updatedFormData._id)
        dispatch(editBooking(updatedFormData));

        try {
            const MIAPI = import.meta.env.VITE_MIAPI;
            const response = await fetch(`${MIAPI}/bookings/upBooking/${formData._id}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authorization')}`,
                },
                body: JSON.stringify(updatedFormData),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error al actualizar el booking en la API:', errorMessage);
            } else {
                console.log('Booking actualizado en la API.');
            }
        } catch (error) {
            console.error('Error al actualizar booking en la API:', error);
        }

        Swal.fire({
            title: "Good job!",
            text: "Booking updated successfully!",
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: true
        }).then(() => {
            navigate("/booking");
        });
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <H4Form>Guest</H4Form>
                <GeneralInputs type="text" name="guest" value={formData.guest} onChange={handleChange} />
                <H4Form>Order Date</H4Form>
                <GeneralInputs type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} />
                <H4Form>Check-in Date</H4Form>
                <GeneralInputs type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} />
                <H4Form>Check-out Date</H4Form>
                <GeneralInputs type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} />
                <H4Form>Special Request</H4Form>
                <GeneralInputs type="text" name="specialRequest" value={formData.specialRequest} onChange={handleChange} />
                <H4Form>Status</H4Form>
                <GeneralSelects name="status" value={formData.status} onChange={handleChange}>
                    <option>In Progress</option>
                    <option>Check In</option>
                    <option>Check Out</option>
                </GeneralSelects>
                <RadioOuterContainer></RadioOuterContainer>
                <ButtonConfirm type="submit" value="Update Booking" />
            </form>
        </FormContainer>
    );
};

export default EditDocumentBooking;
