import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlinePhone } from "react-icons/md";
import { ButtonNewRoom, ButtonSort, ButtonNextBack, ButtonPage, ButtonUnseen } from "../../styledComponents/StyledButton";
import { IconContainer, TableColumnFlexMain, TableColumnMain, TableContainIdName, TableFirstRow, TableIdNameContainer, TableImg, TableRoomData, TableRow } from "../../styledComponents/StyledTabla";
import { TextColorfulNoBackground } from "../../styledComponents/TextStyled";
import { conciergeDataSelect, conciergeStatusSelect, conciergeErrorSelect, deleteUser } from "../../features/conciergeOperations/conciergeSlice";
import { conciergeUsersThunk } from "../../features/conciergeOperations/conciergeUsersThunk";
import { FaTrashAlt } from "react-icons/fa";
import { FaPencil, FaRegEye } from "react-icons/fa6";
import { AppDispatch } from "../../app/store";
import { ConciergeUsers as ConciergeUserClass} from "../../features/Types/typeInterfaces";
import Swal from "sweetalert2";

const Concierge = () : React.JSX.Element => {
    type ConciergeUserKeys = keyof ConciergeUserClass;
    const [active, setActive] = useState<string>("All Employee");
    const [sorting, setSorting] = useState<ConciergeUserKeys>("startDate");
    const [page, setPage] = useState<number>(0);
    const [sortedUsers, setSortedUsers] = useState<ConciergeUserClass[]>([]);
    const [usersMostrar, setUsersMostrar] = useState<ConciergeUserClass[]>([]);
    const [isDisabledBack, setIsDisabledBack] = useState<boolean>();
    const [isDisabledNext, setIsDisabledNext] = useState<boolean>();
    const [maxPages, setMaxPages] = useState<number>(0);
    const dispatch = useDispatch<AppDispatch>();
    const conciergeDataSinMapear = useSelector(conciergeDataSelect);
    const conciergeStatus = useSelector(conciergeStatusSelect);
    const conciergeError = useSelector(conciergeErrorSelect);
    const [loading, setLoading] = useState<boolean>(true);
    const [conciergeData, setConciergeData] = useState<ConciergeUserClass[]>([]);

    const big1: "big1" | "" = "big1"
    const big2: "big2" | "" = "big2"
    const big3: "big3" | "" = "big3"
    const first: "first" | "" = "first"
    const margin: boolean = true
    const navigate = useNavigate();

    const editUser = (userId: string) => {

        const user = conciergeData.find(user => user._id === userId);
        console.log(user)
        if (user && user.name.toLowerCase() === "demilv") {
            Swal.fire({
                title: "Error",
                text: "no puedes cambiar el usuario demilv.",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: true
            });
            return;
        }

        navigate(`/editUser/${userId}`);
    };
    
    const addUser = () => {
        navigate("/addUser");
    };

    const checkUser = (userId: string) => {
        navigate(`/checkUser/${userId}`)
    }

    const handlePageClick = (index: number) => {
        setPage(index);
    };

    const handleChangeSort = (type: ConciergeUserKeys) => {
        setSorting(type);
    };
    
    useEffect(() => {
        if (usersMostrar.length === 0) {
            if (conciergeStatus === "idle") {
                dispatch(conciergeUsersThunk());
            } else if (conciergeStatus === "pending") {
                setLoading(true);
            } else if (conciergeStatus === "fulfilled") {
                setLoading(false);
                let conciergeDataMapeado : ConciergeUserClass[] = [];
                conciergeDataSinMapear.forEach((user) => 
                {
                    const añadirConciergeUser: ConciergeUserClass = {
                         photo: user.photo, _id: user._id, name: user.name, job: user.job, startDate: user.startDate, phone: user.phone, status: user.status, email: user.email, pass: user.pass
                         }
                         conciergeDataMapeado.push(añadirConciergeUser);
                });
                setConciergeData(conciergeDataMapeado);
                setMaxPages(Math.ceil(conciergeDataMapeado.length / 10));
            } else if (conciergeStatus === "rejected") {
                setLoading(false);
                console.log(conciergeError);
            }
        }
    }, [conciergeStatus, conciergeDataSinMapear, conciergeError]);

    useEffect(() => {
        let filteredUsers = conciergeData;

        if (active === "Active") {
            filteredUsers = filteredUsers.filter(user => user.status);
        } else if (active === "Inactive") {
            filteredUsers = filteredUsers.filter(user => !user.status);
        }

        filteredUsers.sort((a, b) => {
            if (a[sorting] < b[sorting]) return -1;
            if (a[sorting] > b[sorting]) return 1;
            return 0;
        });

        setSortedUsers(filteredUsers);
        setPage(0);

        const newMaxPages = Math.ceil(filteredUsers.length / 10);
        setMaxPages(newMaxPages);
    }, [sorting, active, conciergeData]);

    useEffect(() => {
        const registros = page * 10;
        setUsersMostrar(sortedUsers.slice(registros, registros + 10));
    }, [page, sortedUsers]);

    useEffect(() => {
        if (page === 0) {
            setIsDisabledBack(true);
            setIsDisabledNext(false);
            if (page + 1 === maxPages) {
                setIsDisabledNext(true);
            }
        } else if (page + 1 === maxPages) {
            setIsDisabledBack(false);
            setIsDisabledNext(true);
        } else {
            setIsDisabledBack(false);
            setIsDisabledNext(false);
        }
    }, [page, maxPages]);

    const handleDeleteUser = async (userId: string) => {
        const user = conciergeData.find(user => user._id === userId);
        console.log(user)
        if (user && user.name.toLowerCase() === "demilv") {
            Swal.fire({
                title: "Error",
                text: "no puedes borrarme a demilv.",
                icon: "error",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: true
            });
            return;
        }

        dispatch(deleteUser(userId));
        const updatedConciergeData = conciergeData.filter(user => user._id !== userId);
        setConciergeData(updatedConciergeData);
        const MIAPI = import.meta.env.VITE_MIAPI;

        try {
            const response = await fetch(`${MIAPI}/users/delUser/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authorization')}`,
                },
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error eliminando el usuario en la API:', errorMessage);
            } else {
                console.log('Usuario eliminado de la API.');
            }
        } catch (error) {
            console.error('Error en la llamada a la API:', error);
        }
    };

    const colorText = (status: boolean) => {
        if (status === true){        
            return <TextColorfulNoBackground color={"green"}>Active</TextColorfulNoBackground>
        } else {
            return <TextColorfulNoBackground color={"red"}>Inactive</TextColorfulNoBackground>
        }
    }

    return (
        <>
            {loading ? (
                <p>wait a moment please</p>
            ) : (
                <>
                    <TableFirstRow>
                        <TableRow first={first}>
                            <ButtonSort active={active === "All Employee"} onClick={() => setActive("All Employee")}>All Employee</ButtonSort>
                            <ButtonSort active={active === "Active"} onClick={() => setActive("Active")}>Active</ButtonSort>
                            <ButtonSort active={active === "Inactive"} onClick={() => setActive("Inactive")}>Inactive</ButtonSort>
                        </TableRow>
                        <ButtonNewRoom onClick={addUser}>+ New User</ButtonNewRoom>
                    </TableFirstRow>
                    <TableRoomData>
                        <TableRow>
                            <TableColumnMain big={big1}><ButtonUnseen onClick={() => handleChangeSort("_id")}>Name</ButtonUnseen></TableColumnMain>
                            <TableColumnMain big={big3}>Job Desk</TableColumnMain>
                            <TableColumnMain>Schedule</TableColumnMain>
                            <TableColumnMain big={big2}>Contact</TableColumnMain>
                            <TableColumnMain>Status</TableColumnMain>
                        </TableRow>
                        {usersMostrar.map(user => (
                            <TableRow key={user._id}>
                                <TableColumnFlexMain>
                                    <TableImg margin={margin} src={user.photo} alt={`User ${user._id}`} />
                                    <TableContainIdName>
                                        <TableIdNameContainer>
                                            {user.name}
                                        </TableIdNameContainer>
                                        <TableIdNameContainer>
                                            #{user._id.slice(0, 8)}...
                                        </TableIdNameContainer>
                                        <TableIdNameContainer>
                                            Joined in {user.startDate}
                                        </TableIdNameContainer>
                                    </TableContainIdName>
                                </TableColumnFlexMain>
                                <TableColumnMain big={big3}>{user.job}</TableColumnMain>
                                <TableColumnMain> Schedule</TableColumnMain>
                                <TableColumnMain big={big2}><MdOutlinePhone />{user.phone}</TableColumnMain>
                                <TableColumnMain>{colorText(user.status)}</TableColumnMain>
                                <TableColumnMain>
                                    <IconContainer><FaTrashAlt onClick={() => handleDeleteUser(user._id)}/></IconContainer>
                                    <IconContainer><FaPencil onClick={() => editUser(user._id)}/></IconContainer>
                                    <IconContainer><FaRegEye onClick={() => checkUser(user._id)}></FaRegEye></IconContainer>
                                </TableColumnMain>
                            </TableRow>
                        ))}
                    </TableRoomData>
                    <ButtonNextBack first={first} onClick={() => setPage(page - 1)} disabled={isDisabledBack}>Back</ButtonNextBack>
                    {Array.from({ length: maxPages }, (_, index) => (
                        <ButtonPage key={index + 1} active={index === page} onClick={() => handlePageClick(index)}>{index + 1}</ButtonPage>
                    ))}
                    <ButtonNextBack onClick={() => setPage(page + 1)} disabled={isDisabledNext}>Next</ButtonNextBack>
                </>
            )}
        </>
    );
};

export default Concierge;
