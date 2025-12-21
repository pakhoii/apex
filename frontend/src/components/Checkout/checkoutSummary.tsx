import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { CheckoutOrderSummaryProps } from "@/types/checkout";
import { Headphones, ShieldCheck, Truck } from "lucide-react";
import "./checkout.css";

export default function CheckoutOrderSummary({
    items,
    subtotal,
    tax,
    total,
    onPlaceOrder,
    loading,
}: CheckoutOrderSummaryProps) {
    return (
        <Card className="checkout-summary-card">
            <div className="checkout-summary-content">
                <h2 className="checkout-summary-title">Order Summary</h2>

                {/* Item Count */}
                <div className="checkout-summary-items-count">
                    <span>{items.length} item{items.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Price Breakdown */}
                <div className="checkout-summary-breakdown">
                    <div className="checkout-summary-row">
                        <span className="checkout-summary-label">Subtotal</span>
                        <span className="checkout-summary-value">
                            ${subtotal.toLocaleString()}
                        </span>
                    </div>
                    <div className="checkout-summary-row">
                        <span className="checkout-summary-label">Tax (8%)</span>
                        <span className="checkout-summary-value">
                            ${tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                    <div className="checkout-summary-row">
                        <span className="checkout-summary-label">Shipping</span>
                        <span className="checkout-summary-value checkout-free">Free</span>
                    </div>
                </div>

                {/* Total */}
                <div className="checkout-summary-total-section">
                    <div className="checkout-summary-total-row">
                        <span className="checkout-summary-total-label">Total</span>
                        <span className="checkout-summary-total-value">
                            ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>

                {/* Place Order Button */}
                <Button
                    className="checkout-place-order-btn"
                    onClick={onPlaceOrder}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Place Order"}
                </Button>

                {/* Trust Features */}
                <div className="checkout-trust-features">
                    <div className="checkout-trust-item">
                        <ShieldCheck size={16} className="checkout-trust-icon" />
                        <span>Secure Payment</span>
                    </div>
                    <div className="checkout-trust-item">
                        <Truck size={16} className="checkout-trust-icon" />
                        <span>Free Delivery</span>
                    </div>
                    <div className="checkout-trust-item">
                        <Headphones size={16} className="checkout-trust-icon" />
                        <span>24/7 Support</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
