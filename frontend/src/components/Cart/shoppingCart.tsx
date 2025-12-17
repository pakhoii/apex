import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { CartItem } from "@/types/cart"
import "./cart.css"
import CartItemComponent from "./cartItem"

export function ShoppingCartComponent() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: "1",
            name: "BMW M440i xDrive",
            imageUrl: "data:image/jpeg;base64,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",
            unitPrice: 67500,
            quantity: 1,
        },
        {
            id: "2",
            name: "Range Rover SV Black",
            imageUrl: "data:image/jpeg;base64,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",
            unitPrice: 145000,
            quantity: 1,
        },
    ])

    const handleIncrease = (id: string) => {
        setCartItems((items) => 
            items.map((item) => 
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        )
    }

    const handleDecrease = (id: string) => {
        setCartItems((items) =>
            items.map((item) => 
                item.id === id && item.quantity > 1 
                    ? { ...item, quantity: item.quantity - 1 } 
                    : item
            )
        )
    }

    const handleRemove = (id: string) => {
        setCartItems((items) => items.filter((item) => item.id !== id))
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

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