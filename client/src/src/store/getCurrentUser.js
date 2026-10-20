import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userApi } from "../api/axios.js";

const initialState = {
    loading: false,
    user: null,
    message: "",
    error: ""
};

export const getCurrentUser = createAsyncThunk(
    "getuser",
    async (_, thunkAPI) => {
        try {
            const resp = await userApi.get("/getCurrent/user");
            return resp.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const getCurrentUserSlice = createSlice({
    name: "getCurrentUser",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || "";
                state.error = "";

                state.user =
                    action.payload?.User ||
                    action.payload?.user ||
                    action.payload?.data ||
                    null;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message ||
                    action.payload ||
                    action.error.message;
            });
    }
});

export default getCurrentUserSlice.reducer;
