import { createSlice } from "@reduxjs/toolkit"


export const hallOfShameSlice = createSlice ({
    
    name: 'hallOfShameList',
    initialState: {
        items: [], 
        id: 0,
    },

    reducers: {
        addPerson: (state, action) => {
            const {name, complaint} = action.payload;   
            if(!name || !complaint) return;

            state.id++;
            state.items.push({
                id: state.id, 
                name, 
                complaint
            });
        },
        removeEntry: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        }
    }
    
});

export const { addPerson, removeEntry } = hallOfShameSlice.actions;
export default hallOfShameSlice.reducer;
