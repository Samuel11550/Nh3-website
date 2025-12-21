import { configureStore } from '@reduxjs/toolkit';
import hallOfShameReducer from './hallOfShameSlice'; 
import bookingReducer from './BookingSlice';

const store = configureStore({
  reducer: {
    hallOfShameList: hallOfShameReducer, 
    bookings: bookingReducer, 
  },
});

export default store;