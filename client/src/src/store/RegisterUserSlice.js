import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../api/axios.js";

const initialState = {
    loading: false,
    message: "",
    error: ""
};

export const userRegister = createAsyncThunk(
    "/user/Register",
    async (formData, thunkAPI) => {
        try {
            const resp = await userApi.post("/register/user", formData);
            return resp.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const userRegisterSlice = createSlice({
    name: "userRegister",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userRegister.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || "";
                state.error = "";
            })
            .addCase(userRegister.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message ||
                    action.payload ||
                    action.error.message;
            });
    }
});

export default userRegisterSlice.reducer;