import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userApi } from "../api/axios.js";

const initialState = {
    loading: false,
    user: null,
    message: "",
    error: ""
};

export const userLogin = createAsyncThunk(
    "user/login",
    async (loginData, thunkAPI) => {
        try {
            const resp = await userApi.post("/login/user", loginData);
            return resp.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const userLoginSlice = createSlice({
    name: "userLogin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || "";
                state.error = "";

                state.user =
                    action.payload?.User ||
                    action.payload?.user ||
                    action.payload?.data ||
                    null;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message ||
                    action.payload ||
                    action.error.message;
            });
    }
});

export default userLoginSlice.reducer;
