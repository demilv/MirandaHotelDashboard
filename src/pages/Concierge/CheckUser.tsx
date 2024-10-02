import { CheckContainer, MainCheckContainer, CheckImg, CheckH2, CheckContainer2 } from "../../styledComponents/StyledCheckPages";
import React from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { conciergeDataSelect } from "../../features/conciergeOperations/conciergeSlice";
import { H4Form } from "../../styledComponents/StyledForms";

const CheckUser = () : React.JSX.Element => {
    const navigate = useNavigate();
    const { userId } = useParams<{userId: string}>();
    const users = useSelector(conciergeDataSelect);

    const userToCheck = users.find(user => user._id === userId);

    const userData = {
        id: userToCheck?._id,
        photo: userToCheck?.photo || "",
        name: userToCheck?.name || "",
        job: userToCheck?.job || "",
        email: userToCheck?.email || "",
        phone: userToCheck?.phone || 0,
        startDate: userToCheck?.startDate || "No",
        status: userToCheck?.status || "",
    };

    console.log(userToCheck)

    return (
        <>
            <MainCheckContainer>
                <CheckContainer>    
                   <CheckH2>Username</CheckH2>
                    <H4Form>{userData.name}</H4Form>
                    <CheckH2>User job</CheckH2>
                    <H4Form>{userData.job}</H4Form>
                    <CheckH2>User email</CheckH2>
                    <H4Form>{userData.email}</H4Form>
                    <CheckH2>User phone</CheckH2>
                    <H4Form>{userData.phone}</H4Form>
                    <CheckH2>User starting date</CheckH2>
                    <H4Form>{userData.startDate}</H4Form>
                    <CheckH2>User current status</CheckH2>
                    <H4Form>{userData.status ? "Activo" : "Inactivo"}</H4Form>
                </CheckContainer>
                <CheckContainer2>                    
                    <CheckImg src={userData.photo} />                          
                </CheckContainer2>
            </MainCheckContainer>
        </>
    );
};

export default CheckUser;