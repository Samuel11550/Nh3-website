import { configureStore } from '@reduxjs/toolkit';
import hallOfShameReducer from './hallOfShameSlice';
import bookingReducer from './BookingSlice';

export const store = configureStore({
  reducer: {
    hallOfShame: hallOfShameReducer,
    booking: bookingReducer,
  },
});

export default store;