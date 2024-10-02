import { FormContainer, PairRadio, RadioBigContainer, H4Form, GeneralInputs, GeneralSelects, RadioOuterContainer, ButtonConfirm} from "../../styledComponents/StyledForms";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRoom, roomDataSelect } from "../../features/roomOperations/roomSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AppDispatch } from "../../app/store";
import { Room as RoomClass } from "../../features/Types/typeInterfaces";
import { roomThunk } from "../../features/roomOperations/roomThunk";

const AddRoom = () : React.JSX.Element => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();
    const rooms: RoomClass[] = useSelector(roomDataSelect);   

    const [formData, setFormData] = useState({
        fotoLink: ["1"] as string[],
        number: 1,
        bedType: "Single bed",
        price: 1,
        offer: 1,
        amenities: ["0"] as string[],
        status: true
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
                    fotoLink: [...prevData.fotoLink, reader.result as string], 
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

            setFormData((prevData) => {
                let updatedAmenities;
                if (isChecked) {
                    updatedAmenities = [...prevData.amenities, amenityValue];
                } else {
                    updatedAmenities = prevData.amenities.filter((amenity) => amenity !== amenityValue);
                }
                return {
                    ...prevData,
                    amenities: updatedAmenities,
                };
            });
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
        dispatch(addRoom(formDataFinal));

        if (formData.number === 0){
            Swal.fire({
                title: "Error",
                text: "La habitacion debe tener un numero y ser diferente de 0",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: true
            });
            return;
        }
        
        try {
            const MIAPI = import.meta.env.VITE_MIAPI;
            console.log(formDataFinal)
            const response = await fetch(`${MIAPI}/rooms/newRoom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authorization')}`,
                },
                body: JSON.stringify(formDataFinal),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error al enviar la room a la API:', errorMessage);
            } else {
                console.log('Exito, room en a la API.');
                dispatch(roomThunk());
            }
        } catch (error) {
            console.error('Error enviando la room a la api:', error);
        }
      
        Swal.fire({
            title: "Good job!",
            text: "Room added successfully!",
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
                <H4Form>Room Pics</H4Form>
                <GeneralInputs type="file" name="fotoLink" onChange={handleFileChange} />
                <H4Form>Room Number</H4Form>
                <GeneralInputs type="text" name="number" value={formData.number} onChange={handleChange} />
                <H4Form>Room type</H4Form>
                <GeneralSelects name="bedType" onChange={handleChange}>
                    <option>Single bed</option>
                    <option>Double bed</option>
                    <option>Double superior</option>
                    <option>Suite</option>
                </GeneralSelects>                
                <H4Form>Room price</H4Form>
                <GeneralInputs type="number" name="price" onChange={handleChange} />
                <H4Form>Is there a discount?</H4Form>
                <GeneralSelects name="discount" onChange={handleChange}>
                    <option>Yes</option>
                    <option>No</option>
                </GeneralSelects>
                <H4Form>Offer</H4Form>
                <GeneralInputs type="number" name="offer" onChange={handleChange}/>
                <H4Form>Amenities</H4Form>
                <RadioOuterContainer>
                    <RadioBigContainer>
                        <PairRadio>
                            <label>AC</label>
                            <input type="checkbox" value="AC" onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>Shower</label>
                            <input type="checkbox" value="Shower" onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>Double Bed</label>
                            <input type="checkbox" value="Double Bed" onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>Towel</label>
                            <input type="checkbox" value="Towel" onChange={handleChange} />
                        </PairRadio>
                    </RadioBigContainer>
                    <RadioBigContainer>
                        <PairRadio>
                            <label>Bathup</label>
                            <input type="checkbox" value="Bathup" onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>Coffee Set</label>
                            <input type="checkbox" value="Coffee Set" onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>LED TV</label>
                            <input type="checkbox" value="LED TV" onChange={handleChange} />
                        </PairRadio>
                        <PairRadio>
                            <label>Wifi</label>
                            <input type="checkbox" value="Wifi" onChange={handleChange} />
                        </PairRadio>
                    </RadioBigContainer>
                </RadioOuterContainer>
                <ButtonConfirm type="submit" value="New room" />
            </form>
        </FormContainer>
    );
};

export default AddRoom;
