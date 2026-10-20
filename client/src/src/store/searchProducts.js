import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import { userApi } from "../api/axios.js";

const initialState = {
    products: [],
    search: "",
    loading: false,
    error: null
};

export const searchProducts = createAsyncThunk(
    "search/items",
    async (search, { rejectWithValue }) => {
        try {
            const response = await userApi.get("/search/product", {
                params: { search }
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Unable to load products"
            );
        }
    }
);

const searchProductsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(searchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.products = action.payload?.product || [];
                state.search = action.meta.arg;
                state.loading = false;
                state.error = null;
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unable to search products";
            });
    }
});

export default searchProductsSlice.reducer;