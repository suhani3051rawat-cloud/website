
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { products } from "../store/productSlice.js";
import { searchProducts } from "../store/searchProducts.js";
import {
    addToCart,
    increaseQuantity,
    decreaseQuantity
} from "../store/cartSlice.js";
import "./products.css";

function ProductCategory({ category }) {
    const dispatch = useDispatch();

    const {
        products: productList = [],
        loading: productLoading,
        error: productError
    } = useSelector((state) => state.products);

    const {
        search = "",
        products: searchProductList = [],
        loading: searchLoading,
        error: searchError
    } = useSelector((state) => state.searchProducts);

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const query = search.trim();

    useEffect(() => {
        if (query) {
            dispatch(searchProducts(query));
            return;
        }

        dispatch(products(category));
    }, [query, category, dispatch]);

    const isSearching = Boolean(query);
    const list = isSearching ? searchProductList : productList;
    const loading = isSearching ? searchLoading : productLoading;
    const error = isSearching ? searchError : productError;

    if (loading && list.length === 0) {
        return (
            <div className="product-state">
                <div className="product-loader"></div>
                <h3>Finding fresh products...</h3>
                <p>Please wait while we prepare your selection.</p>
            </div>
        );
    }

    if (!loading && isSearching && list.length === 0 && !error) {
        return (
            <div className="product-state">
                <div className="product-state-icon">⌕</div>
                <h3>No products found</h3>
                <p>
                    We couldn't find anything for "{search}".
                    Try searching with another name.
                </p>
            </div>
        );
    }

    if (error && list.length === 0) {
        return (
            <div className="product-state">
                <div className="product-state-icon">!</div>
                <h3>Something went wrong</h3>
                <p>
                    {typeof error === "string"
                        ? error
                        : "Unable to load products. Please try again."}
                </p>
            </div>
        );
    }

    return (
        <div className="product-page">

            <div className="product-container">
                {list.map((product) => {
                    const cartItem = cartItems.find(
                        (item) => item._id === product._id
                    );

                    return (
                        <div className="product-card" key={product._id}>
                            <div className="product-image-wrapper">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                />

                                <span className="product-quality-tag">
                                    Fresh Choice
                                </span>
                            </div>

                            <div className="product-details">
                                <span className="product-brand">
                                    {product.brand}
                                </span>

                                <h3>{product.name}</h3>

                                <p className="product-description">
                                    {product.description}
                                </p>

                                <div className="product-card-bottom">
                                    <div className="product-price">
                                        <span>₹{product.price}</span>
                                        <small>Inclusive of all taxes</small>
                                    </div>

                                    {cartItem ? (
                                        <div className="quantity-box">
                                            <button
                                                onClick={() =>
                                                    dispatch(decreaseQuantity(product._id))
                                                }
                                                className="quantity-btn"
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>

                                            <span>{cartItem.quantity}</span>

                                            <button
                                                onClick={() =>
                                                    dispatch(increaseQuantity(product._id))
                                                }
                                                className="quantity-btn"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="product-add-btn"
                                            onClick={() =>
                                                dispatch(addToCart(product))
                                            }
                                        >
                                            <span>＋</span> Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {loading && list.length > 0 && (
                <p className="product-updating">
                    Updating products...
                </p>
            )}
        </div>
    );
}

export default ProductCategory;
