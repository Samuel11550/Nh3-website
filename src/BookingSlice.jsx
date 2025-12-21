import { createSlice } from "@reduxjs/toolkit"

export const addBookingSlice = createSlice ({

    name: 'bookings',
    initialState: {
        entries: []
    },

    reducers: {

       addBooking: (state, action) => {
            const b = action.payload;
            // Skapa ett rent objekt med bara de fält vi vill ha
            const newEntry = {
                id: b.id === undefined || b.id === null ? '' : String(b.id),
                title: b.title === undefined || b.title === null ? '' : String(b.title),
                info: b.info === undefined || b.info === null ? '' : String(b.info),
                start: b.start === undefined || b.start === null ? '' : String(b.start),
                end: b.end === undefined || b.end === null ? '' : String(b.end)
            };
            state.entries.push(newEntry);
        },
        setBookings:  (state, action) => {
            const payload = action.payload;
            if (!Array.isArray(payload)) {
                state.entries = [];
                return;
            }

            // Sanitize each booking to ensure primitives only and strip any React elements
            const sanitized = payload
                .filter(b => b && typeof b === 'object')
                .map(b => ({
                    id: b.id === undefined || b.id === null ? '' : String(b.id),
                    title: b.title === undefined || b.title === null ? '' : String(b.title),
                    info: b.info === undefined || b.info === null ? '' : String(b.info),
                    start: b.start === undefined || b.start === null ? '' : String(b.start),
                    end: b.end === undefined || b.end === null ? '' : String(b.end)
                }))
                .filter(b => !Object.values(b).some(v => v && typeof v === 'object' && '$$typeof' in v));

            state.entries = sanitized;
        }
    }

});

export const { addBooking, setBookings} = addBookingSlice.actions;
export default addBookingSlice.reducer;