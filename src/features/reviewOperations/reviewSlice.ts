import { createSlice } from '@reduxjs/toolkit';
import { reviewThunk } from './reviewThunk';
import type { RootState } from '../../app/store';
import { Review } from '../Types/typeInterfaces';

interface interfaceState {
    reviews: Review[],
    status: 'idle' | 'pending' | 'fulfilled' | 'rejected',
    error: string | null
}

const initialState: interfaceState = {
    reviews: [],
    status: 'idle', 
    error: null,
}

export const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(reviewThunk.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(reviewThunk.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.reviews = action.payload as Review[];
            })
            .addCase(reviewThunk.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message as string;
            });
    }
});

export default reviewSlice.reducer;
export const reviewDataSelect = (state: RootState) => state.reviews.reviews;
export const reviewStatusSelect = (state: RootState) => state.reviews.status;
export const reviewErrorSelect = (state: RootState) => state.reviews.error;
