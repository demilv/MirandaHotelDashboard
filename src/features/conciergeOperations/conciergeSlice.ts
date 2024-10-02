import { createSlice } from '@reduxjs/toolkit';
import { conciergeUsersThunk } from './conciergeUsersThunk';
import type { RootState } from '../../app/store';
import { ConciergeUsers } from '../Types/typeInterfaces';



interface interfaceState {
    conciergeUsers: ConciergeUsers[],
    status: 'idle' | 'pending' | 'fulfilled' | 'rejected',
    error: string | null
}

const initialState: interfaceState = {
    conciergeUsers: [],
    status: 'idle', 
    error: null,
}

export const conciergeSlice = createSlice({
    name: 'conciergeUsers',
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.conciergeUsers = [...state.conciergeUsers, action.payload];
        },
        deleteUser: (state, action) => {
            state.conciergeUsers = state.conciergeUsers.filter(user => user._id !== action.payload);
        },
        editUser: (state, action) => {
            const index = state.conciergeUsers.findIndex(user => user._id === action.payload._id);
            if (index !== -1) {
                state.conciergeUsers[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(conciergeUsersThunk.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(conciergeUsersThunk.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.conciergeUsers = action.payload as ConciergeUsers[];
            })
            .addCase(conciergeUsersThunk.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.error.message as string;
            });
    }
});

export default conciergeSlice.reducer;
export const { addUser, deleteUser, editUser } = conciergeSlice.actions;
export const conciergeDataSelect = (state: RootState) => state.conciergeUsers.conciergeUsers;
export const conciergeStatusSelect = (state: RootState) => state.conciergeUsers.status;
export const conciergeErrorSelect = (state: RootState) => state.conciergeUsers.error;
