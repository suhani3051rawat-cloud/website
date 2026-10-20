import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userApi } from "../api/axios.js";

const initialState = {
    loading: false,
    message: "",
    error: ""
};

export const userLogout = createAsyncThunk(
    "user/logout",
    async (_, thunkAPI) => {
        try {
            const resp = await userApi.post("/logout/user", {});
            return resp.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const userLogoutSlice = createSlice({
    name: "userLogout",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userLogout.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(userLogout.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || "Logout successful";
                state.error = "";
            })
            .addCase(userLogout.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message ||
                    action.payload ||
                    action.error.message;
            });
    }
});

export default userLogoutSlice.reducer;