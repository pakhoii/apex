import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { CartItem } from "@/types/cart"
import "./cart.css"
import CartItemComponent from "./cartItem"
import { useCart } from "@/hooks/useCart";
import { useModel } from "@/hooks/useModel";

export function ShoppingCartComponent() {
    const { fetchMyCart,
            updateCartItem,
            removeItemFromCart,
            loading,
            error } = useCart();

    const { fetchModelsDetails } = useModel();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const getCartItems = async () => {
            try {
                const data = await fetchMyCart();
                setCartItems(
                    (data.items ?? []).map((item: any) => ({
                        id: String(item.model_id),
                        modelId: item.model_id,
                        quantity: item.quantity,
                        unitPrice: item.unit_price,
                    }))
                );

                for (const item of data.items ?? []) {
                    try {
                        const modelDetails = await fetchModelsDetails(item.model_id);
                        setCartItems((prevItems) =>
                            prevItems.map((ci) =>
                                ci.id === String(item.model_id)
                                    ? {
                                          ...ci,
                                          name: modelDetails.name,
                                          imageUrl: modelDetails.image_url,
                                      }
                                    : ci
                            )
                        );
                    } catch (err) {
                        console.error(
                            `Failed to fetch model details for model ID ${item.model_id}:`,
                            err
                        );
                    }
                }
            } catch (err) {
                console.error("Failed to fetch cart items:", err);
                setCartItems([]);
            }
        };
        getCartItems();
    }, []);


    // if (loading) {
    //     return (
    //         <div className="loading-container">
    //             <p>Loading...</p>
    //         </div>
    //     );
    // }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
            </div>
        );
    }   

    const handleIncrease = (id: string) => {
        setCartItems((items) => 
            items.map((item) => 
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        )

        updateCartItem(Number(id), { quantity: cartItems.find(item => item.id === id)!.quantity + 1 });
    }

    const handleDecrease = (id: string) => {
        setCartItems((items) =>
            items.map((item) => 
                item.id === id && item.quantity > 1 
                    ? { ...item, quantity: item.quantity - 1 } 
                    : item
            )
        )

        const currentQuantity = cartItems.find(item => item.id === id)!.quantity;
        if (currentQuantity > 1) {
            updateCartItem(Number(id), { quantity: currentQuantity - 1 });
        }
    }

    const handleRemove = (id: string) => {
        setCartItems((items) => items.filter((item) => item.id !== id))
        removeItemFromCart(Number(id));
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

    console.log(cartItems.length);

    return (
        <div className="cart-container">
            {/* Main Content */}
            <div className="cart-grid">
                {/* Cart Items */}
                <div className="cart-items-section">
                    {cartItems.length === 0 ? (
                        <Card className="cart-empty">
                            <ShoppingCart className="cart-empty-icon" />
                            <h2 className="cart-empty-title">Your cart is empty</h2>
                            <p className="cart-empty-text">Add some vehicles to get started</p>
                            <Button>Continue Shopping</Button>
                        </Card>
                    ) : (
                        cartItems.map((item) => (
                            <CartItemComponent
                                key={item.id}
                                item={item}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                onRemove={handleRemove}
                            />
                        ))
                    )}
                </div>

                {/* Order Summary */}
                {cartItems.length > 0 && (
                    <div className="cart-summary-section">
                        <Card className="cart-summary">
                            <div className="cart-summary-content">
                                <h2 className="cart-summary-title">Order Summary</h2>

                                <div className="cart-summary-details">
                                    <div className="cart-summary-row">
                                        <span className="cart-summary-label">Subtotal</span>
                                        <span className="cart-summary-value">
                                            ${totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="cart-summary-row">
                                        <span className="cart-summary-label">Tax (estimate)</span>
                                        <span className="cart-summary-value">
                                            ${(totalPrice * 0.08).toLocaleString(undefined, {
                                                maximumFractionDigits: 0,
                                            })}
                                        </span>
                                    </div>
                                    <div className="cart-summary-row">
                                        <span className="cart-summary-label">Delivery</span>
                                        <span className="cart-summary-value">Free</span>
                                    </div>
                                </div>

                                <div className="cart-summary-total-section">
                                    <div className="cart-summary-total">
                                        <span className="cart-summary-total-label">Total</span>
                                        <span className="cart-summary-total-value">
                                            ${(totalPrice * 1.08).toLocaleString(undefined, {
                                                maximumFractionDigits: 0,
                                            })}
                                        </span>
                                    </div>

                                    <Button className="cart-checkout-button">
                                        Proceed to Checkout
                                    </Button>

                                    <Button variant="outline" className="cart-continue-button">
                                        Continue Shopping
                                    </Button>
                                </div>

                                <div className="cart-summary-features">
                                    <p className="cart-summary-feature">
                                        <span className="cart-feature-check">✓</span>
                                        Tax shipping on all orders
                                    </p>
                                    <p className="cart-summary-feature">
                                        <span className="cart-feature-check">✓</span>
                                        30 day money back guarantee
                                    </p>
                                    <p className="cart-summary-feature">
                                        <span className="cart-feature-check">✓</span>
                                        24/7 customer support
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}