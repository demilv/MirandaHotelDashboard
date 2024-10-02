import { ButtonConfirm, FormContainer, GeneralInputs, GeneralSelects, H4Form, PairRadio, RadioBigContainer, RadioOuterContainer } from "../../styledComponents/StyledForms";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { editRoom, roomDataSelect } from "../../features/roomOperations/roomSlice";
import { AppDispatch } from "../../app/store";
import { Room as RoomClass } from "../../features/Types/typeInterfaces";

const EditRoom = () : React.JSX.Element => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { roomId } = useParams();
    const rooms: RoomClass[] = useSelector(roomDataSelect);

    const roomToEdit = rooms.find(room => room._id === roomId);

    const [formData, setFormData] = useState({
        _id: roomToEdit?._id,
        fotoLink: roomToEdit?.fotoLink || "",
        number: roomToEdit?.number ? Number(roomToEdit.number) : 0,
        bedType: roomToEdit?.bedType || "",
        price: roomToEdit?.price || 0,
        offer: roomToEdit?.offer || 0,
        discount: "",
        amenities: roomToEdit?.amenities || "",
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
        const { name, value, type } = e.target;

         if (name === "number") {
        const valor = Number(value);

        if (valor < 1) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: 1,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: valor,
            }));
        }
    } else if (type === "number") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: Number(value),
            }));
        } 
        else if (name === "offer") {
            const offerValue = Number(value);
            const updatedOffer = offerValue > formData.price ? formData.price : offerValue;
    
            setFormData((prevData) => ({
                ...prevData,
                [name]: updatedOffer,
            }));
        } else if (type === "checkbox") {
            const isChecked = (e.target as HTMLInputElement).checked;
            const amenityValue = value;

            if (isChecked) {
                setFormData((prevData) => ({
                    ...prevData,
                    amenities: prevData.amenities ? prevData.amenities + ", " + amenityValue : amenityValue, 
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    amenities: prevData.amenities.split(" ").filter((amenity) => amenity !== amenityValue).join(" "), 
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let destination = 0
        if (formData.number < 10){
            destination = 1
        }else{
            destination = Math.floor(formData.number / 10);
        }
        const floor = destination
        const formDataFinal = {
            ...formData,
            floor: floor,
        };
        dispatch(editRoom(formDataFinal));    
        
        try {
            const MIAPI = import.meta.env.VITE_MIAPI;
            const response = await fetch(`${MIAPI}/rooms/upRoom/${formDataFinal._id}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authorization')}`,
                },
                body: JSON.stringify(formDataFinal),
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
            text: "Room updated successfully!",
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: true
        }).then(() => {
            navigate("/room");
        });
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <H4Form>Room pics</H4Form>
                <GeneralInputs type="file" name="fotoLink" onChange={handleFileChange} />
                <H4Form>Room Number</H4Form>
                <GeneralInputs type="text" name="number" value={formData.number} onChange={handleChange} />
                <H4Form>Room type</H4Form>
                <GeneralSelects name="bedType" value={formData.bedType} onChange={handleChange}>
                    <option>Single bed</option>
                    <option>Double bed</option>
                    <option>Double superior</option>
                    <option>Suite</option>
                </GeneralSelects>
                <H4Form>Room price</H4Form>
                <GeneralInputs type="number" name="price" value={formData.price} onChange={handleChange} />
                <H4Form>Is there a discount?</H4Form>
                <GeneralSelects name="discount" value={formData.discount} onChange={handleChange}>
                    <option>Yes</option>
                    <option>No</option>
                </GeneralSelects>
                <H4Form>Offer</H4Form>
                <GeneralInputs type="number" name="offer" value={formData.offer} onChange={handleChange} disabled={formData.discount === "No"} />
                <H4Form>Amenities</H4Form>
                <RadioOuterContainer>
                    <RadioBigContainer>
                        <PairRadio>
                            <label>AC</label>
                            <input type="checkbox" value="AC" checked={formData.amenities.includes("AC")} onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>Shower</label>
                            <input type="checkbox" value="Shower" checked={formData.amenities.includes("Shower")} onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>Double Bed</label>
                            <input type="checkbox" value="Double Bed" checked={formData.amenities.includes("Double Bed")} onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>Towel</label>
                            <input type="checkbox" value="Towel" checked={formData.amenities.includes("Towel")} onChange={handleChange} />
                        </PairRadio>
                    </RadioBigContainer>
                    <RadioBigContainer>
                        <PairRadio>
                            <label>Bathup</label>
                            <input type="checkbox" value="Bathup" checked={formData.amenities.includes("Bathup")} onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>Coffee Set</label>
                            <input type="checkbox" value="Coffee Set" checked={formData.amenities.includes("Coffee Set")} onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>LED TV</label>
                            <input type="checkbox" value="LED TV" checked={formData.amenities.includes("LED TV")} onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>Wifi</label>
                            <input type="checkbox" value="Wifi" checked={formData.amenities.includes("Wifi")} onChange={handleChange} />
                        </PairRadio>
                    </RadioBigContainer>
                </RadioOuterContainer>
                <ButtonConfirm type="submit" value="Update room" />
            </form>
        </FormContainer>
    );
};

export default EditRoom;