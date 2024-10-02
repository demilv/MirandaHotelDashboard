import { CheckContainer, MainCheckContainer, CheckImg, CheckContainer2, CheckContainerImg, CheckH2 } from "../../styledComponents/StyledCheckPages";
import React from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { roomDataSelect } from "../../features/roomOperations/roomSlice";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Room as RoomClass } from "../../features/Types/typeInterfaces";
import { H4Form } from "../../styledComponents/StyledForms";

const CheckRoom = () : React.JSX.Element => {
    const navigate = useNavigate();
    const { roomId } = useParams<{roomId: string}>();
    const rooms: RoomClass[] = useSelector(roomDataSelect);

    const roomToCheck = rooms.find(room => room._id === roomId);

    const roomData = {
        _id: roomToCheck?._id,
        fotoLink: roomToCheck?.fotoLink || [],
        number: roomToCheck?.number || "",
        bedType: roomToCheck?.bedType || "",
        floor: roomToCheck?.floor || 0,
        price: roomToCheck?.price || 0,
        offer: roomToCheck?.offer || 0,
        status: roomToCheck?.status || true,
        amenities: roomToCheck?.amenities || ""
    };

    return (
        <>
            <MainCheckContainer>
                <CheckContainer>    
                    <CheckH2>Room Number</CheckH2>
                    <H4Form>{roomData.number}</H4Form>
                    <CheckH2>Room type</CheckH2>
                    <H4Form>{roomData.bedType}</H4Form>
                    <CheckH2>Room floor</CheckH2>
                    <H4Form>{roomData.floor}</H4Form>
                    <CheckH2>Room price</CheckH2>
                    <H4Form>{roomData.price}</H4Form>
                    <CheckH2>Offer</CheckH2>
                    <H4Form>{roomData.offer}</H4Form>
                    <CheckH2>Status</CheckH2>
                    <H4Form>{roomData.status ? "Activo" : "Inactivo"}</H4Form>
                    <CheckH2>Amenities</CheckH2>
                    <H4Form>{roomData.amenities}</H4Form>
                </CheckContainer>
                <CheckContainer2>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation={true}
                    >
                        {Array.isArray(roomData.fotoLink) && roomData.fotoLink.map((url: string, index: number) => ( 
                            <SwiperSlide key={index} >
                                <CheckContainerImg>
                                    <CheckImg src={url} />
                                </CheckContainerImg>
                            </SwiperSlide>
                        ))}         
                    </Swiper>
                </CheckContainer2>
            </MainCheckContainer>
        </>
    );
};

export default CheckRoom;