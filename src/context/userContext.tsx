import { createContext, useReducer } from "react";
import React from "react";

  interface User {
    name: string | null;
    email: string | null;
    pass: string | null;
    autenticado: boolean;
  }
  
  interface State {
    user: User;
  }

  interface UserContextProviderProps {
    children: React.ReactNode;
  }
  
  type Action = | { type: 'SET_USERDATA'; payload: { name: string; email: string; pass: string } } | { type: 'LOGOUT' };
  
  interface UserContextType {
    state: State;
    dispatch: React.Dispatch<Action>;
  }

const userReducer = (state: State, action:Action) => {
    switch (action.type) {
        case "SET_USERDATA":
            return { ...state, 
                user:{
                        name:action.payload.name,
                        email: action.payload.email,
                        pass: action.payload.pass,
                        autenticado: true
                    }};
        case "LOGOUT":
            return {...state, user:{
                name:null,
                email: null,
                pass: null,
                autenticado: false
            }};
                    
        default:
            return state;
    }
}

export const UserContext = createContext<UserContextType | null>(null);
    export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
        const [state, dispatch] = useReducer(userReducer, {user:{
        name:null,
        email: null,
        pass: null,
        autenticado: false
    }});

    return (
        <UserContext.Provider value={{state , dispatch}}>
            {children}
        </UserContext.Provider>
    )
}