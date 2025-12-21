import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useModel } from "@/hooks/useModel";
import { useOrder } from "@/hooks/useOrder";
import type { ModelOut } from "@/types/model";
import type { OrderOut, OrderStatus } from "@/types/order";
import { Calendar, Check, MapPin, Package, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./dashboard.css";

const statusColors: Record<OrderStatus, string> = {
    pending: "status-pending",
    confirmed: "status-confirmed",
    delivering: "status-delivering",
    delivered: "status-delivered",
    cancelled: "status-cancelled",
    refunded: "status-refunded",
};

export default function UserOrders() {
    const { fetchMyOrders, cancelOrder, confirmDelivery, loading } = useOrder();
    const { fetchModelsDetails } = useModel();
    const [orders, setOrders] = useState<OrderOut[]>([]);
    const [modelNames, setModelNames] = useState<Record<number, string>>({});

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await fetchMyOrders(0, 50);
            setOrders(data);
            
            // Fetch model names for each unique model_id
            const modelIds = new Set<number>();
            data.forEach(order => {
                order.items.forEach(item => modelIds.add(item.model_id));
            });
            
            const names: Record<number, string> = {};
            for (const modelId of modelIds) {
                try {
                    const model: ModelOut = await fetchModelsDetails(modelId);
                    names[modelId] = model.name;
                } catch {
                    names[modelId] = `Model #${modelId}`;
                }
            }
            setModelNames(names);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;
        try {
            await cancelOrder({ order_id: orderId });
            loadOrders();
        } catch (err) {
            console.error("Failed to cancel order:", err);
        }
    };

    const handleConfirmDelivery = async (orderId: number) => {
        if (!confirm("Have you received your order? This action will mark it as delivered.")) return;
        try {
            await confirmDelivery(orderId);
            loadOrders();
        } catch (err) {
            console.error("Failed to confirm delivery:", err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const calculateTotal = (order: OrderOut) => {
        return order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    };

    if (loading && orders.length === 0) {
        return <div className="dashboard-loading">Loading orders...</div>;
    }

    return (
        <div className="user-orders">
            <h2 className="section-title">
                <Package className="section-icon" />
                My Orders
            </h2>
            
            {orders.length === 0 ? (
                <Card className="empty-state">
                    <Package className="empty-icon" />
                    <p>You haven't placed any orders yet.</p>
                </Card>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <Card key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <span className="order-id">Order #{order.id}</span>
                                    <span className={`order-status ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-date">
                                    <Calendar size={16} />
                                    {formatDate(order.order_date)}
                                </div>
                            </div>
                            
                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <span className="item-name">
                                            {modelNames[item.model_id] || `Model #${item.model_id}`}
                                        </span>
                                        <span className="item-qty">x{item.quantity}</span>
                                        <span className="item-price">
                                            ${(item.unit_price * item.quantity).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="order-footer">
                                <div className="shipping-address">
                                    <MapPin size={16} />
                                    <span>{order.shipping_address}</span>
                                </div>
                                <div className="order-total">
                                    Total: ${calculateTotal(order).toLocaleString()}
                                </div>
                            </div>
                            
                            <div className="order-actions user-order-actions">
                                {/* User can cancel pending or confirmed orders */}
                                {(order.status === "pending" || order.status === "confirmed") && (
                                    <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleCancelOrder(order.id)}
                                        disabled={loading}
                                    >
                                        <X size={16} />
                                        Cancel Order
                                    </Button>
                                )}
                                
                                {/* User confirms delivery when order is delivering */}
                                {order.status === "delivering" && (
                                    <Button 
                                        variant="default"
                                        size="sm"
                                        className="confirm-delivery-btn"
                                        onClick={() => handleConfirmDelivery(order.id)}
                                        disabled={loading}
                                    >
                                        <Check size={16} />
                                        Confirm Received
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
