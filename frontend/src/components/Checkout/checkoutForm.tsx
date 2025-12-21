import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CheckoutFormProps, PaymentMethod } from "@/types/checkout";
import { Banknote, Building2, CreditCard, Wallet } from "lucide-react";
import "./checkout.css";

const paymentMethods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { value: "credit_card", label: "Credit Card", icon: <CreditCard size={20} /> },
    { value: "debit_card", label: "Debit Card", icon: <Wallet size={20} /> },
    { value: "bank_transfer", label: "Bank Transfer", icon: <Building2 size={20} /> },
    { value: "cash", label: "Cash on Delivery", icon: <Banknote size={20} /> },
];

export default function CheckoutForm({ formData, onFormChange, loading }: CheckoutFormProps) {
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFormChange({
            ...formData,
            shippingAddress: e.target.value,
        });
    };

    const handlePaymentChange = (method: PaymentMethod) => {
        onFormChange({
            ...formData,
            paymentMethod: method,
        });
    };

    return (
        <div className="checkout-form-container">
            {/* Shipping Address Section */}
            <Card className="checkout-form-card">
                <div className="checkout-form-section">
                    <h2 className="checkout-form-title">Shipping Address</h2>
                    <div className="checkout-form-field">
                        <Label htmlFor="shipping-address" className="checkout-label">
                            Delivery Address
                        </Label>
                        <Input
                            id="shipping-address"
                            type="text"
                            placeholder="Enter your full shipping address"
                            value={formData.shippingAddress}
                            onChange={handleAddressChange}
                            disabled={loading}
                            className="checkout-input"
                        />
                    </div>
                </div>
            </Card>

            {/* Payment Method Section */}
            <Card className="checkout-form-card">
                <div className="checkout-form-section">
                    <h2 className="checkout-form-title">Payment Method</h2>
                    <div className="checkout-payment-methods">
                        {paymentMethods.map((method) => (
                            <button
                                key={method.value}
                                type="button"
                                className={`checkout-payment-option ${
                                    formData.paymentMethod === method.value ? "selected" : ""
                                }`}
                                onClick={() => handlePaymentChange(method.value)}
                                disabled={loading}
                            >
                                <span className="checkout-payment-icon">{method.icon}</span>
                                <span className="checkout-payment-label">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}
