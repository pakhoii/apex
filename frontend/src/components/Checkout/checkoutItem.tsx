import { Card } from "@/components/ui/card";
import type { CheckoutItemProps } from "@/types/checkout";
import "./checkout.css";

export default function CheckoutItemCard({ item }: CheckoutItemProps) {
    const itemTotal = item.unitPrice * item.quantity;

    return (
        <Card className="checkout-item-card">
            <div className="checkout-item-content">
                {/* Item Image */}
                <div className="checkout-item-image-container">
                    <img 
                        src={item.imageUrl} 
                        alt={item.name || "Product"} 
                        className="checkout-item-image" 
                    />
                </div>

                {/* Item Details */}
                <div className="checkout-item-details">
                    <h3 className="checkout-item-name">{item.name || "Loading..."}</h3>
                    <p className="checkout-item-price">
                        ${item.unitPrice.toLocaleString()} × {item.quantity}
                    </p>
                </div>

                {/* Item Total */}
                <div className="checkout-item-total">
                    <span className="checkout-item-total-value">
                        ${itemTotal.toLocaleString()}
                    </span>
                </div>
            </div>
        </Card>
    );
}
