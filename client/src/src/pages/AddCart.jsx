
import React, { useEffect, useState } from "react";
import { userApi } from "../api/axios.js";

import {
    useDispatch,
    useSelector
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
} from "../store/cartSlice";

import "../components/addCart.css";

function AddCart({ closeCart }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [checkingUser, setCheckingUser] = useState(true);

    const cartItems = useSelector(
        state => state.cart.items
    );

    useEffect(() => {
        let isActive = true;

        const fetchCurrentUser = async () => {
            try {
                const resp = await userApi.get("/getCurrent/user");

                if (isActive) {
                    const data =
                        resp.data?.User ||
                        resp.data?.user ||
                        resp.data?.data ||
                        null;

                    setCurrentUser(
                        Array.isArray(data) ? data[0] || null : data
                    );
                }
            } catch (error) {
                console.log(
                    "getCurrent error:",
                    error.response?.status,
                    error.response?.data || error.message
                );

                if (isActive) {
                    setCurrentUser(null);
                }
            } finally {
                if (isActive) {
                    setCheckingUser(false);
                }
            }
        };

        fetchCurrentUser();

        return () => {
            isActive = false;
        };
    }, []);

    const isLoggedIn = Boolean(currentUser);

    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const goTo = (path) => {
        closeCart();
        navigate(path);
    };

    if (checkingUser) {
        return null;
    }

    if (!isLoggedIn) {
        return (
            <div
                className="auth-popup-backdrop"
                onClick={closeCart}
            >
                <div
                    className="auth-popup"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="auth-popup-title"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="auth-popup-close"
                        onClick={closeCart}
                        aria-label="Close"
                    >
                        ×
                    </button>

                    <div className="auth-popup-icon">🛒</div>

                    <span className="auth-popup-tag">
                        FarmEra Shopping
                    </span>

                    <h2 id="auth-popup-title">
                        Login to open your cart
                    </h2>

                    <p>
                        Please login or create an account
                        to view your cart and place orders.
                    </p>

                    <div className="auth-popup-actions">
                        <button
                            className="auth-popup-primary"
                            onClick={() => goTo("/login")}
                        >
                            Login
                        </button>

                        <button
                            className="auth-popup-secondary"
                            onClick={() => goTo("/register")}
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className="cart-backdrop"
                onClick={closeCart}
            ></div>

            <div
                className="cart-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="cart-header">
                    <div className="cart-heading">
                        <span className="cart-eyebrow">
                            FARMERA STORE
                        </span>

                        <h1>My Cart</h1>

                        <p>
                            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                        </p>
                    </div>

                    <div className="cart-header-right">
                        {cartItems.length > 0 && (
                            <button
                                className="clear-cart"
                                onClick={() => dispatch(clearCart())}
                            >
                                Clear All
                            </button>
                        )}

                        <button
                            className="close-cart"
                            onClick={closeCart}
                            aria-label="Close cart"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            🛒
                        </div>

                        <h2>Your cart is empty</h2>

                        <p>
                            Looks like you haven't added anything
                            to your cart yet.
                        </p>

                        <button
                            className="continue-shopping"
                            onClick={closeCart}
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cart-products">
                            {cartItems.map((item) => (
                                <div
                                    className="cart-item"
                                    key={item._id}
                                >
                                    <div className="cart-image">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                        />
                                    </div>

                                    <div className="cart-details">
                                        <h3>{item.name}</h3>

                                        <p className="cart-price">
                                            ₹{item.price}
                                        </p>

                                        <div className="quantity-box">
                                            <button
                                                onClick={() =>
                                                    dispatch(
                                                        decreaseQuantity(item._id)
                                                    )
                                                }
                                                aria-label={`Decrease ${item.name} quantity`}
                                            >
                                                −
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                onClick={() =>
                                                    dispatch(
                                                        increaseQuantity(item._id)
                                                    )
                                                }
                                                aria-label={`Increase ${item.name} quantity`}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="item-total">
                                        <strong>
                                            ₹{item.price * item.quantity}
                                        </strong>

                                        <button
                                            className="remove-btn"
                                            onClick={() =>
                                                dispatch(
                                                    removeFromCart(item._id)
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h3>Order Summary</h3>

                            <div className="summary-row">
                                <span>Items ({totalItems})</span>
                                <span>₹{totalPrice}</span>
                            </div>

                            <div className="summary-row">
                                <span>Delivery</span>
                                <span className="free-delivery">FREE</span>
                            </div>

                            <div className="summary-row">
                                <span>Discount</span>
                                <span>₹0</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total">
                                <span>Total Amount</span>
                                <strong>₹{totalPrice}</strong>
                            </div>

                            <button className="checkout-btn">
                                Proceed to Checkout
                                <span>→</span>
                            </button>

                            <p className="cart-footer-note">
                                Fresh products, delivered with care 🌿
                            </p>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default AddCart;
