
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/axios.js";

// Search API
export const searchProducts = createAsyncThunk(
  "searchProducts/search",
  async (search, { rejectWithValue }) => {
    try {
      const query = search?.trim();

      if (!query) {
        return { product: [] };
      }

      const response = await api.get("/search/product", {
        params: { search: query },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to search products. Please try again."
      );
    }
  }
);

const initialState = {
  search: "",
  products: [],
  loading: false,
  error: null,
};

const searchProductsSlice = createSlice({
  name: "searchProducts",
  initialState,

  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },

    clearSearch: (state) => {
      state.search = "";
      state.products = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.products = Array.isArray(action.payload?.product)
          ? action.payload.product
          : [];
      })

      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.products = [];
        state.error =
          action.payload || "Unable to search products.";
      });
  },
});

// Required exports
export const { setSearch, clearSearch } = searchProductsSlice.actions;

export default searchProductsSlice.reducer;
