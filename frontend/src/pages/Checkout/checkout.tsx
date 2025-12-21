import CheckoutForm from "@/components/Checkout/checkoutForm";
import CheckoutItemCard from "@/components/Checkout/checkoutItem";
import CheckoutOrderSummary from "@/components/Checkout/checkoutSummary";
import Navbar from "@/components/Navbar/navbar";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/useCheckout";
import type { CheckoutFormData, CheckoutItem, PaymentMethod } from "@/types/checkout";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./checkout.css";

interface LocationState {
    cartItems: CheckoutItem[];
    totalPrice: number;
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { placeCheckout, loading, error } = useCheckout();

    const [items, setItems] = useState<CheckoutItem[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [formData, setFormData] = useState<CheckoutFormData>({
        shippingAddress: "",
        paymentMethod: "credit_card" as PaymentMethod,
    });
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Get cart data from navigation state
    useEffect(() => {
        const state = location.state as LocationState | null;
        
        if (state?.cartItems && state.cartItems.length > 0) {
            setItems(state.cartItems);
            setSubtotal(state.totalPrice);
        } else {
            // No items passed, redirect back to cart
            navigate("/my-cart");
        }
    }, [location.state, navigate]);

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const handleFormChange = (data: CheckoutFormData) => {
        setFormData(data);
        setSubmitError(null);
    };

    const handlePlaceOrder = async () => {
        // Validate form
        if (!formData.shippingAddress.trim()) {
            setSubmitError("Please enter a shipping address");
            return;
        }

        try {
            setSubmitError(null);
            const response = await placeCheckout({
                shipping_address: formData.shippingAddress,
                payment_method: formData.paymentMethod,
            });

            // Order placed successfully, redirect to dashboard or success page
            navigate("/dashboard", {
                state: {
                    orderSuccess: true,
                    orderId: response.order_id,
                    message: response.message,
                },
            });
        } catch (err: any) {
            setSubmitError(err.response?.data?.detail || err.message || "Failed to place order");
        }
    };

    const handleBackToCart = () => {
        navigate("/my-cart");
    };

    // Empty state - should not normally happen as we redirect
    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <div className="checkout-page">
                    <div className="checkout-empty">
                        <ShoppingBag size={64} className="checkout-empty-icon" />
                        <h2 className="checkout-empty-title">No items to checkout</h2>
                        <p className="checkout-empty-text">
                            Your cart is empty. Add some items first.
                        </p>
                        <Button onClick={() => navigate("/models")}>
                            Browse Models
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="checkout-page">
                {/* Header */}
                <div className="checkout-header">
                    <button className="checkout-back-btn" onClick={handleBackToCart}>
                        <ArrowLeft size={20} />
                        <span>Back to Cart</span>
                    </button>
                    <h1 className="checkout-title">Checkout</h1>
                    <p className="checkout-subtitle">
                        Review your order and complete your purchase
                    </p>
                </div>

                {/* Error Message */}
                {(submitError || error) && (
                    <div className="checkout-error">
                        <p>{submitError || error}</p>
                    </div>
                )}

                {/* Main Content */}
                <div className="checkout-content">
                    <div className="checkout-main">
                        {/* Order Items */}
                        <div className="checkout-items-section">
                            <h2 className="checkout-section-title">
                                Order Items ({items.length})
                            </h2>
                            <div className="checkout-items-list">
                                {items.map((item) => (
                                    <CheckoutItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <CheckoutForm
                            formData={formData}
                            onFormChange={handleFormChange}
                            loading={loading}
                        />
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="checkout-sidebar">
                        <CheckoutOrderSummary
                            items={items}
                            subtotal={subtotal}
                            tax={tax}
                            total={total}
                            onPlaceOrder={handlePlaceOrder}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
