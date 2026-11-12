import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: []
};

const cartSlice = createSlice({
    name: "cart",

    initialState,

    reducers: {

        addToCart: (state, action) => {
            const product = action.payload;
            const existingProduct = state.items.find(
                item => item._id === product._id
            );

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.items.push({
                    ...product,
                    quantity: 1
                });
            }
        },
        increaseQuantity: (state, action) => {
            const product = state.items.find(
                item => item._id === action.payload
            );
            if (product) {
                product.quantity += 1;
            }
        },
        decreaseQuantity: (state, action) => {
            const product = state.items.find(
            item => item._id === action.payload
        );
        if (product) {
            product.quantity -= 1;
        if (product.quantity === 0) {
            state.items = state.items.filter(
                item => item._id !== action.payload
            );
        }
    }
    },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                item => item._id !== action.payload
            );
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;