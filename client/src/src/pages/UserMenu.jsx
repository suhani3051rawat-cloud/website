import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/AuthContext.jsx";
import { useAddress } from "../pages/AddressContext.jsx";
import { userApi } from "../axios/api.js";
import "../pages/userMenu.css";

function UserMenu({ iconSrc }) {
    const { user, fetchUser, logout } = useAuth();
    const {
        selectedAddress,
        selectAddress,
        clearSelectedAddress
    } = useAddress();

    const navigate = useNavigate();             
    const menuRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const [form, setForm] = useState({
        addr1: "",
        addr2: "",
        addrType: "Home"
    });

    useEffect(() => {
        const handleOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutside);

        return () => {
            document.removeEventListener("mousedown", handleOutside);
        };
    }, []);

    const addresses = (user?.Address || [])
        .filter(Boolean)
        .flatMap((item) => item.address || [])
        .filter((item) => item && !item.isDelete);

    const firstName = (user?.name || "").trim().split(" ")[0];

    const handleIconClick = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        setOpen((previous) => !previous);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSelectAddress = (item) => {
        if (selectedAddress?._id === item._id) {
            clearSelectedAddress();
        } else {
            selectAddress({
                _id: item._id,
                addr1: item.addr1,
                addr2: item.addr2,
                addrType: item.addrType
            });
        }
    };

    const handleAddAddress = async (event) => {
        event.preventDefault();

        if (saving) return;

        if (!user?._id) {
            setError("Please log in to add an address.");
            return;
        }

        const payload = {
            addr1: form.addr1.trim(),
            addr2: form.addr2.trim(),
            addrType: form.addrType
        };

        if (!payload.addr1 || !payload.addr2) {
            setError("Please fill both address lines");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await userApi.post(
                `/user/multiAddress/${user._id}`,
                { address: payload }
            );

            await fetchUser();

            setForm({
                addr1: "",
                addr2: "",
                addrType: "Home"
            });

            setShowForm(false);
        } catch (err) {
            console.error("Add address failed:", err);

            setError(
                err.response?.data?.message ||
                "Unable to save address. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (event, addressId) => {
        event.stopPropagation();

        setDeleteError("");

        if (!user?._id) {
            setDeleteError("Please log in first.");
            return;
        }

        try {
            await userApi.delete(
                `/address/Delete/${user._id}/${addressId}`
            );

            if (selectedAddress?._id === addressId) {
                clearSelectedAddress();
            }

            await fetchUser();
        } catch (err) {
            console.error("Delete address failed:", err);

            setDeleteError(
                err.response?.data?.message ||
                "Unable to delete address. Please try again."
            );
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            clearSelectedAddress();
            setOpen(false);
            navigate("/");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="user-menu" ref={menuRef}>
            <button
                type="button"
                className="user-menu-trigger"
                onClick={handleIconClick}
                aria-label="User menu"
            >
                <span className="user-menu-icon">
                    {iconSrc ? (
                        <img
                            src={iconSrc}
                            alt="User account"
                            style={{ width: 22, height: 22 }}
                        />
                    ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
                        </svg>
                    )}
                </span>

                {firstName && (
                    <span className="user-menu-name">{firstName}</span>
                )}
            </button>

            {user && open && (
                <div className="user-menu-panel">
                    <div className="user-menu-info">
                        <h4>{user.name}</h4>
                        <p>{user.email}</p>
                        <p>{user.phone_number}</p>
                    </div>

                    <div className="user-menu-section">
                        <h5>Addresses</h5>

                        {addresses.length === 0 && (
                            <p className="user-menu-empty">
                                No address saved
                            </p>
                        )}

                        {addresses.map((item, index) => {
                            const isSelected =
                                selectedAddress?._id === item._id;

                            return (
                                <div
                                    className={`user-menu-address ${
                                        isSelected ? "selected" : ""
                                    }`}
                                    key={item._id || index}
                                    onClick={() => handleSelectAddress(item)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            handleSelectAddress(item);
                                        }
                                    }}
                                    aria-pressed={isSelected}
                                >
                                    <button
                                        type="button"
                                        className="user-menu-delete"
                                        onClick={(event) =>
                                            handleDeleteAddress(
                                                event,
                                                item._id
                                            )
                                        }
                                        aria-label="Delete address"
                                        title="Delete address"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M8 6V4h8v2" />
                                            <path d="M6 6l1 14h10l1-14" />
                                            <path d="M10 11v6M14 11v6" />
                                        </svg>
                                    </button>

                                    <span className="user-menu-type">
                                        {item.addrType}
                                    </span>

                                    {isSelected && (
                                        <span className="user-menu-selected-tag">
                                            Selected
                                        </span>
                                    )}

                                    <p>{item.addr1}</p>
                                    <p>{item.addr2}</p>
                                </div>
                            );
                        })}

                        {deleteError && (
                            <p className="user-menu-error">
                                {deleteError}
                            </p>
                        )}
                    </div>

                    {showForm ? (
                        <form
                            className="user-menu-form"
                            onSubmit={handleAddAddress}
                        >
                            <input
                                type="text"
                                name="addr1"
                                placeholder="Address line 1"
                                value={form.addr1}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="addr2"
                                placeholder="Address line 2"
                                value={form.addr2}
                                onChange={handleChange}
                            />

                            <select
                                name="addrType"
                                value={form.addrType}
                                onChange={handleChange}
                            >
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                            </select>

                            {error && (
                                <p className="user-menu-error">{error}</p>
                            )}

                            <div className="user-menu-form-actions">
                                <button type="submit" disabled={saving}>
                                    {saving ? "Saving..." : "Save"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setError("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            type="button"
                            className="user-menu-add"
                            onClick={() => setShowForm(true)}
                        >
                            + Add address
                        </button>
                    )}

                    <button
                        type="button"
                        className="user-menu-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserMenu;
