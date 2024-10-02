import { configureStore } from '@reduxjs/toolkit';
import roomReducer from '../features/roomOperations/roomSlice';
import conciergeReducer from '../features/conciergeOperations/conciergeSlice';
import bookingsReducer from '../features/bookingsOperations/bookingsSlice'
import reviewsReducer from '../features/reviewOperations/reviewSlice'

export const store = configureStore({
    reducer: {
        rooms: roomReducer,
        conciergeUsers: conciergeReducer,
        bookings: bookingsReducer,
        reviews: reviewsReducer
    },
});

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
///