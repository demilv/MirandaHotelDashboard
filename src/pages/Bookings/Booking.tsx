import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ButtonNewRoom, ButtonSort, ButtonNextBack, ButtonPage, ButtonUnseen, ButtonGreen} from "../../styledComponents/StyledButton";
import { IconContainer, TableColumnFlexMain, TableColumnMain, TableContainIdName, TableFirstRow, TableIdNameContainer, TableImg, TableRoomData, TableRow } from "../../styledComponents/StyledTabla";
import { TextColorful } from "../../styledComponents/TextStyled";
import Popup from "../../components/Popup/Popup";
import { bookingsDataSelect, bookingsStatusSelect, bookingsErrorSelect, deleteBooking, editBooking } from "../../features/bookingsOperations/bookingsSlice";
import { bookingsThunk } from "../../features/bookingsOperations/bookingsThunk";
import { FaTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { AppDispatch } from "../../app/store";
import { Booking as BookingClass} from "../../features/Types/typeInterfaces";

const Booking = () : React.JSX.Element => {
    type BookingKeys = keyof BookingClass;
    const [active, setActive] = useState<string>("All")
    const [sorting, setSorting] = useState<BookingKeys>("_id")
    const [page, setPage] = useState<number>(0)
    const [sortedBookings, setSortedBookings] = useState<BookingClass[]>([])
    const [bookingsMostrar, setBookingsMostrar] = useState<BookingClass[]>([])
    const [isDisabledBack, setIsDisabledBack] = useState<boolean>()
    const [isDisabledNext, setIsDisabledNext] = useState<boolean>()
    const [maxPages, setMaxPages] = useState<number>(0)
    const dispatch = useDispatch<AppDispatch>();
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<string>("");
    const bookingsDataSinMapear = useSelector(bookingsDataSelect);
    const bookingsStatus = useSelector(bookingsStatusSelect);
    const bookingsError = useSelector(bookingsErrorSelect);
    const [loading, setLoading] = useState<boolean>(true);
    const [bookingsData, setBookingsData] = useState<BookingClass[]>([]);


    const big1: "big1" | "" = "big1"
    const big2: "big2" | "" = "big2"
    const first: "first" | "" = "first"
    const navigate = useNavigate();

    const editBooking = (bookingId: string) => {
        navigate(`/editBooking/${bookingId}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
          case 'Check In':
            return 'green';
          case 'Check Out':
            return 'red';
          case 'In Progress':
            return 'yellow';
          default:
            return 'grey';
        }
      };
      

    const handlePageClick = (index: number) =>{
        setPage(index)
    }

    const handleChangeSort = (type: BookingKeys) =>{
        setSorting(type)
    }

    useEffect(() => {
        if (bookingsMostrar.length === 0) {
            if (bookingsStatus === "idle") {
                dispatch(bookingsThunk());
            } else if (bookingsStatus === "pending") {
                setLoading(true);
            } else if (bookingsStatus === "fulfilled") {
                setLoading(false);
                let bookingsDataMapeado : BookingClass[] = [];
                bookingsDataSinMapear.forEach((booking) => {
                    const añadirBooking: BookingClass = { fotoLink: booking.fotoLink, _id: booking._id, guest: booking.guest, orderDate: booking.orderDate, checkInDate: booking.checkInDate, checkOutDate: booking.checkOutDate, specialRequest: booking.specialRequest,status: booking.status }
                    bookingsDataMapeado.push(añadirBooking);
                });
                setBookingsData(bookingsDataMapeado);
                setMaxPages(Math.ceil(bookingsDataMapeado.length / 10));
            } else if (bookingsStatus === "rejected") {
                setLoading(false);
                console.log(bookingsError);
            }
        }
    }, [bookingsStatus, bookingsDataSinMapear, bookingsError]);

    useEffect(() => {
        let filteredBookings = bookingsData;

        if (active === "checkingIn") {
            filteredBookings = filteredBookings.filter(booking => booking.status === "Check In");
        } else if (active === "checkingOut") {
            filteredBookings = filteredBookings.filter(booking => booking.status === "Check Out");
        } else if (active === "inProgress") {
            filteredBookings = filteredBookings.filter(booking => booking.status === "In Progress");
        }
        
        filteredBookings.sort((a, b) => {
            if (a[sorting] < b[sorting]) return -1;
            if (a[sorting] > b[sorting]) return 1;
            return 0;
        });

        setSortedBookings(filteredBookings);
        setPage(0);

        const newMaxPages = Math.ceil(filteredBookings.length / 10);
        setMaxPages(newMaxPages);
    }, [sorting, active, bookingsData]);

      useEffect(() => {        
        const registros = page*10;
        setBookingsMostrar (sortedBookings.slice(registros, registros+10))
      }, [page, sortedBookings, sorting, active]);

      useEffect(() =>{
        if (page === 0){
            setIsDisabledBack(true)
            setIsDisabledNext(false)
            if(page+1 === maxPages){
                setIsDisabledNext(true)
            }
        }else if(page+1 === maxPages){
            setIsDisabledBack(false)
            setIsDisabledNext(true)
        }else{
            setIsDisabledBack(false)
            setIsDisabledNext(false)
        }
      }, [page,  sortedBookings])

    const handleSpecialRequest = (specialRequest: string) => {
    setSelectedRequest(specialRequest);
    setPopupVisible(true);
    };

    const closePopup = () => {
    setPopupVisible(false);
    setSelectedRequest("");
    };

    const handleDeleteBooking = async (bookingId: string) => {
        dispatch(deleteBooking(bookingId));
        const updatedBookingsData = bookingsData.filter(booking => booking._id !== bookingId);
        setBookingsData(updatedBookingsData);
        const MIAPI = import.meta.env.VITE_MIAPI;

        try {
            const response = await fetch(`${MIAPI}/bookings/delBooking/${bookingId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authorization')}`,
                },
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error eliminando el booking en la API:', errorMessage);
            } else {
                console.log('Booking eliminado de la API.');
            }
        } catch (error) {
            console.error('Error en la llamada a la API:', error);
        }
    };


    return (
        <>     
            {loading ? (
                <p>wait a moment please</p>
            ) : (
                <> 
                    <TableFirstRow>
                        <TableRow first={first}>
                            <ButtonSort active={active === "All"} onClick={() => setActive("All")}>All Bookings</ButtonSort>
                            <ButtonSort active={active === "checkingIn"} onClick={() => setActive("checkingIn")}>Checking In</ButtonSort>
                            <ButtonSort active={active === "checkingOut"} onClick={() => setActive("checkingOut")}>Checking Out</ButtonSort>
                            <ButtonSort active={active === "inProgress"} onClick={() => setActive("inProgress")}>In Progress</ButtonSort>
                        </TableRow>
                    </TableFirstRow>
                    <TableRoomData>
                        <TableRow>
                            <TableColumnMain big={big1}><ButtonUnseen onClick={()=> handleChangeSort("guest")}>Guest</ButtonUnseen></TableColumnMain>
                            <TableColumnMain><ButtonUnseen onClick={()=> handleChangeSort("orderDate")}>Order Date</ButtonUnseen></TableColumnMain>
                            <TableColumnMain><ButtonUnseen onClick={()=> handleChangeSort("checkInDate")}>Check in</ButtonUnseen></TableColumnMain>
                            <TableColumnMain><ButtonUnseen onClick={()=> handleChangeSort("checkOutDate")}>Check out</ButtonUnseen></TableColumnMain>
                            <TableColumnMain>Special Request</TableColumnMain>
                            <TableColumnMain big={big1}>Room Type</TableColumnMain>
                            <TableColumnMain>Status</TableColumnMain>
                        </TableRow>
                        {bookingsMostrar.map(booking => (
                            <TableRow key={booking._id}>
                                <TableColumnFlexMain>
                                    <TableImg src={booking.fotoLink} alt={`Room ${booking._id}`}/>
                                    <TableContainIdName>
                                        <TableIdNameContainer>
                                            {booking.guest}
                                        </TableIdNameContainer>
                                        <TableIdNameContainer>
                                            #{booking._id.slice(0, 8)}...
                                        </TableIdNameContainer>
                                    </TableContainIdName>
                                </TableColumnFlexMain>
                                <TableColumnMain>{booking.orderDate}</TableColumnMain>
                                <TableColumnMain>{booking.checkInDate}</TableColumnMain>
                                <TableColumnMain>{booking.checkOutDate}</TableColumnMain>
                                <TableColumnMain><ButtonGreen onClick={() => handleSpecialRequest(booking.specialRequest)}>View Notes</ButtonGreen></TableColumnMain>
                                <TableColumnMain big={big1}>Deluxe - {booking._id}</TableColumnMain>
                                <TableColumnMain big={big1}><TextColorful color={getStatusColor(booking.status)}>{booking.status}</TextColorful></TableColumnMain>
                                <TableColumnMain>
                                    <IconContainer><FaTrashAlt onClick={() => handleDeleteBooking(booking._id)}/></IconContainer>
                                    <IconContainer><FaPencil onClick={() => editBooking(booking._id)}/></IconContainer>
                                </TableColumnMain>
                            </TableRow>
                        ))}         
                    </TableRoomData>  
                    <ButtonNextBack first={first} onClick={() =>setPage(page-1)} disabled={isDisabledBack}>Back</ButtonNextBack>
                    {Array.from({ length: maxPages }, (_, index) => (
                            <ButtonPage key={index+1} active={index === page}  onClick={() => handlePageClick(index)}>{index + 1}</ButtonPage>
                        ))}
                    <ButtonNextBack onClick={() =>setPage(page+1)} disabled={isDisabledNext}>Next</ButtonNextBack>  
                    {popupVisible && <Popup specialRequest={selectedRequest} onClose={closePopup} />}   
                    </>
            )}    
        </>
    )
}

export default Booking