import { createAsyncThunk } from "@reduxjs/toolkit";
import conciergeData from '../../data/conciergeData.json';

/*export const conciergeUsersThunk = createAsyncThunk('conciergeUsers/conciergeUsersThunk', async () => {
    const promesa = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (conciergeData.length > 0) {
                resolve(conciergeData);
            }else{
                reject("no encontrado")
            }
        }, 3000); 
    });
    return promesa.then((resolve) => {return resolve}
    ).catch((error) => {throw new Error(error)})
});*/


export const conciergeUsersThunk = createAsyncThunk('conciergeUsers/conciergeUsersThunk', async (_, { rejectWithValue }) => {
    try {
        console.log("entro en el thunk de users")
        const MIAPI = import.meta.env.VITE_MIAPI;

        const token = localStorage.getItem('authorization');

        if (!token) {
            return rejectWithValue('No se encontró el token de autenticación');
        }

        const response = await fetch(`${MIAPI}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No se encuentran los usuarios');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        } else {
            return rejectWithValue('Error desconocido');
        }
    }
});
