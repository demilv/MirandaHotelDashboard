import { createSlice } from '@reduxjs/toolkit';
import { roomThunk } from './roomThunk';
import type { RootState } from '../../app/store';
import { Room } from '../Types/typeInterfaces';

interface interfaceState{
    rooms: Room[],
    status: 'idle' | 'pending' | "fulfilled" | "rejected",
    error: string | null
}

const initialState: interfaceState = {
    rooms: [],
    status: "idle",
    error: null
}

export const roomSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        addRoom: (state, action) => {
            state.rooms = [...state.rooms, action.payload];
        },
        deleteRoom: (state, action) => {
            state.rooms = state.rooms.filter(room => room._id !== action.payload);
        },
        editRoom: (state, action) => {
            const index = state.rooms.findIndex(room => room._id === action.payload._id);
            if (index !== -1) {
                state.rooms[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(roomThunk.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(roomThunk.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.rooms = action.payload as Room[];
            })
            .addCase(roomThunk.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message as string;
            });
    }
});

export default roomSlice.reducer;
export const { addRoom, deleteRoom, editRoom } = roomSlice.actions;
export const roomDataSelect = (state: RootState) => state.rooms.rooms
export const roomStatusSelect = (state: RootState) => state.rooms.status
export const roomErrorSelect = (state: RootState) => state.rooms.error
