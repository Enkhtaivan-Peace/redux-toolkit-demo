import { createSlice,  } from "@reduxjs/toolkit";

const initialState = [
    { id:1, name: 'user 1' },
    { id:2, name: 'user 2' }
];

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        
    }
});

export const selectAllUsers = (state) =>state.users;

export default usersSlice.reducer
