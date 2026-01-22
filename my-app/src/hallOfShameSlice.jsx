import {  createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

export const addEntry = createAsyncThunk('HallOfShame/addEntry', 
    async ({ name, complaint }, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/hallofshame", { name, complaint });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Kunde inte spara nomineringen');
        }
    }
);

export const deleteEntry = createAsyncThunk('/HallOfShame/deleteEntry', 
    async (id) => {
        const response = await axios.delete(`/api/hallofshame/${id}`);
        console.log("React anropar nu adressen:", `/api/hallofshame/${id}`);
        return id;
    }
);

export const getList = createAsyncThunk('HallOfShame/getList', 
    async () => {
        const response = await axios.get("/api/hallofshame");
        return response.data;
    }
);

const hallOfShameSlice = createSlice({ 
    name: 'hallOfShame',
    initialState: { items: [], status: 'idle' },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addEntry.fulfilled, (state, action) => {  
                state.items.push(action.payload);
            })
             .addCase(addEntry.rejected, (state) => {
                alert("Kunde inte lägga till personen i servern.");
            })
            .addCase(deleteEntry.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteEntry.rejected, (state) => {
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

export default hallOfShameSlice.reducer;

