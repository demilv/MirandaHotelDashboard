import { createAsyncThunk } from "@reduxjs/toolkit";
import reviewData from '../../data/roomReview.json';

/*export const reviewThunk = createAsyncThunk('reviews/reviewThunk', async () => {
    const promesa = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (reviewData.length > 0) {
                resolve(reviewData);
            }else{
                reject("no encontrado")
            }
        }, 3000); 
    });
    return promesa.then((resolve) => {return resolve}
    ).catch((error) => {throw new Error(error)})
});*/

export const reviewThunk = createAsyncThunk('reviews/reviewsThunk', async (_, { rejectWithValue }) => {
    try {
        const MIAPI = import.meta.env.VITE_MIAPI;

        const token = localStorage.getItem('authorization');

        if (!token) {
            return rejectWithValue('No se encontró el token de autenticación');
        }

        const response = await fetch(`${MIAPI}/reviews`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('No se encuentran los reviews');
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