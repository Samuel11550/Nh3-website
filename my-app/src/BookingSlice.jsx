import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";

export const addBooking = createAsyncThunk('/api/booking/addBooking',
    async (newBooking, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/booking", newBooking);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Kunde inte boka');
        }
    }
);

export const deleteBooking = createAsyncThunk('/api/booking/deleteBooking', 
    async (id) => {
        const response = await axios.delete(`/api/booking/${id}`);
        return id;
    }

);


export const getList = createAsyncThunk('/api/booking/getList', 
    async () => {
        const response = await axios.get("/api/booking"); 
        return response.data;
    }
);

const bookingSlice = createSlice({ 
    name: 'booking',
    initialState: { items: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addBooking.fulfilled, (state, action) => {
                const newEvent = {
                    id: action.payload.id,
                    title: action.payload.title,
                    start: action.payload.start,
                    end: action.payload.end,
                    extendedProps: {
                        info: action.payload.info
                    }
                };
                state.items.push(newEvent);
            })
            .addCase(addBooking.rejected, (state, action) => {
               alert(action.payload || "Ett oväntat fel uppstod");
            })
            .addCase(deleteBooking.fulfilled, (state, action) => {
                state.items = state.items.filter(item => String(item.id) !== String(action.payload));
            })
            .addCase(deleteBooking.rejected, (state) => {
                alert("Kunde inte ta bort från servern.");
            })
            .addCase(getList.fulfilled, (state, action) => {
                state.items = action.payload
            })
            .addCase(getList.rejected, (state) => {
                alert("Kunde inte hämta listan från servern.");
            });
    }
});

export default bookingSlice.reducer;