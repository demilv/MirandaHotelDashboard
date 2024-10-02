import React, { useState, useEffect } from "react";
import { CajaDiv, CajaStyled, CajaMainContainer, CajaImg, CajaSwiperContainer, SwiperTitle } from "../../styledComponents/StyledCajasHome";
import { TextH5Light, TextNumberBig } from "../../styledComponents/TextStyled";
import { LuBedDouble, LuCalendarCheck2 } from "react-icons/lu";
import { FaDoorOpen, FaDoorClosed } from "react-icons/fa6";
import styled from "styled-components";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import roomReviews from '../../data/roomReview.json';
import RecentReviews from "../../components/ReviewsSlider/RecentReviews";

import { useDispatch, useSelector } from "react-redux";
import { reviewDataSelect, reviewErrorSelect, reviewStatusSelect } from "../../features/reviewOperations/reviewSlice";
import { reviewThunk } from "../../features/reviewOperations/reviewThunk";
import { Review as ReviewClass } from "../../features/Types/typeInterfaces";
import { AppDispatch } from "../../app/store";

const Home = () : React.JSX.Element => {
    const [selectedBox, setSelectedBox] = useState<number>();
    const dispatch = useDispatch<AppDispatch>();
    const reviewDataSinMapear = useSelector(reviewDataSelect);
    const reviewStatus = useSelector(reviewStatusSelect);
    const reviewError = useSelector(reviewErrorSelect);
    const [loading, setLoading] = useState<boolean>(true);
    const [reviewData, setReviewData] = useState<ReviewClass[]>([]);

    const handleBoxClick = (boxId : number) => {
        setSelectedBox(boxId);
    };

    console.log(roomReviews)
    const latestReviews = reviewData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    useEffect(() => {
        if (reviewData.length === 0) {
            if (reviewStatus === "idle") {
                dispatch(reviewThunk());
            } else if (reviewStatus === "pending") {
                setLoading(true);
            } else if (reviewStatus === "fulfilled") {
                setLoading(false);                
                let reviewsMapeadas : ReviewClass[] = []
                reviewDataSinMapear.forEach((review) => {
                    const añadirReview: ReviewClass = {
                    _id: review._id,
                    date: review.date,
                    hora: review.hora,
                    customerName: review.customerName,
                    email: review.email,
                    stars: review.stars,
                    review: review.review,
                    status: review.status,
                    phone: review.phone
                }
                reviewsMapeadas.push(añadirReview)
                });
                setReviewData(reviewsMapeadas);
            } else if (reviewStatus === "rejected") {
                setLoading(false);
                console.log(reviewError); 
            }
        }
    }, [reviewStatus, reviewDataSinMapear, reviewError]);

    const RedBedIcon = styled(LuBedDouble)`
        width:4em;
        height:4em;
    `

    const RedCalendar = styled(LuCalendarCheck2)`
        width:4em;
        height:4em;
    `

    const RedDoorOpen = styled(FaDoorOpen)`
        width:4em;
        height:4em;
    `

    const RedDoorClosed = styled(FaDoorClosed)`
        width:4em;
        height:4em;
    `

    return (
        <>
            {loading ? (
                    <p>wait a moment please</p>
            ) : (
                <>
                    <CajaMainContainer>
                        <CajaStyled onClick={() => handleBoxClick(1)}>
                            <CajaImg isSelected={selectedBox === 1}><RedBedIcon /></CajaImg>
                            <CajaDiv>
                                <TextNumberBig>8461</TextNumberBig>
                                <TextH5Light>New Booking</TextH5Light>
                            </CajaDiv>
                        </CajaStyled>
                        <CajaStyled onClick={() => handleBoxClick(2)}>
                            <CajaImg isSelected={selectedBox === 2}><RedCalendar/></CajaImg>
                            <CajaDiv>
                                <TextNumberBig>963</TextNumberBig>
                                <TextH5Light>Scheduled Room</TextH5Light>
                            </CajaDiv>
                        </CajaStyled>
                        <CajaStyled onClick={() => handleBoxClick(3)}>
                            <CajaImg isSelected={selectedBox === 3}><RedDoorOpen /></CajaImg>
                            <CajaDiv>
                                <TextNumberBig>753</TextNumberBig>
                                <TextH5Light>Check In</TextH5Light>
                            </CajaDiv>
                        </CajaStyled>
                        <CajaStyled onClick={() => handleBoxClick(4)}>
                            <CajaImg isSelected={selectedBox === 4}><RedDoorClosed /></CajaImg>
                            <CajaDiv>
                                <TextNumberBig>516</TextNumberBig>
                                <TextH5Light>Check Out</TextH5Light>
                            </CajaDiv>
                        </CajaStyled>
                    </CajaMainContainer>
                    <CajaSwiperContainer>
                        <SwiperTitle>Latest Reviews by Customers</SwiperTitle>
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={50}
                            slidesPerView={3}
                            navigation={true}
                        >
                            {latestReviews.map(review => (
                                <SwiperSlide key={review._id}>
                                    <RecentReviews 
                                        review={review.review}
                                        customerName={review.customerName}
                                        date={review.date}
                                    />
                                </SwiperSlide>
                            ))}                
                        </Swiper>
                    </CajaSwiperContainer>
                </>
            )}
        </>
    );
};

export default Home;

