export interface Booking {
    _id: string,
    fotoLink: string,
    guest: string,
    orderDate: string,
    checkInDate: string,
    checkOutDate: string,
    specialRequest: string,
    status: string
}

export interface ConciergeUsers {
    _id: string,
    photo: string,
    name: string,
    startDate: string,
    email: string,
    job: string,
    phone: string,
    status: boolean,
    pass: string
}

export interface Review {
    _id: string,
    date: string,
    hora: string,
    customerName: string,
    email: string,
    stars: number,
    review: string,
    status: boolean,
    phone: string
}

export interface Room {
    _id: string,
    fotoLink: string[],
    number: string,
    floor: number,
    bedType: string,
    amenities: string,
    price: number,
    status: boolean,
    offer: number,
}

interface User {
    name: string | null;
    email: string | null;
    pass: string | null;
    autenticado: boolean;
  }

  type Action = | { type: 'SET_USERDATA'; payload: { name: string; email: string; pass: string } } | { type: 'LOGOUT' };

interface State {
    user: User;
  }

export interface UserContextType {
    state: State;
    dispatch: React.Dispatch<Action>;
  }