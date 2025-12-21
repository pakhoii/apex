import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useModel } from "@/hooks/useModel";
import { useOrder } from "@/hooks/useOrder";
import type { ModelOut } from "@/types/model";
import type { OrderAction, OrderOut, OrderStatus } from "@/types/order";
import { ArrowRight, Calendar, MapPin, Package, User } from "lucide-react";
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

// Admin can only perform admin actions, not user actions
const adminStatusActions: Record<OrderStatus, OrderAction[]> = {
    pending: ["admin_confirm", "cancel"],
    confirmed: ["admin_ship", "cancel"],
    delivering: [], // user_confirm_delivery is user-only action
    delivered: [],
    cancelled: [],
    refunded: [],
};

export default function AdminOrders() {
    const { fetchAllOrders, transitionOrderState, loading } = useOrder();
    const { fetchModelsDetails } = useModel();
    const [orders, setOrders] = useState<OrderOut[]>([]);
    const [modelNames, setModelNames] = useState<Record<number, string>>({});
    const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await fetchAllOrders(0, 100);
            setOrders(data);

            // Fetch model names
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

    const handleAction = async (orderId: number, action: OrderAction) => {
        const actionLabels: Record<OrderAction, string> = {
            admin_confirm: "confirm",
            admin_ship: "ship",
            user_confirm_delivery: "mark as delivered",
            cancel: "cancel",
        };
        
        if (!confirm(`Are you sure you want to ${actionLabels[action]} this order?`)) return;
        
        try {
            await transitionOrderState(orderId, { action });
            loadOrders();
        } catch (err) {
            console.error("Failed to transition order:", err);
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

    const filteredOrders = filterStatus === "all" 
        ? orders 
        : orders.filter(o => o.status === filterStatus);

    const allStatuses: (OrderStatus | "all")[] = [
        "all", "pending", "confirmed", "delivering", "delivered", "cancelled", "refunded"
    ];

    return (
        <div className="admin-orders">
            <div className="section-header">
                <h2 className="section-title">
                    <Package className="section-icon" />
                    Manage Orders
                </h2>
            </div>

            <div className="filter-bar">
                {allStatuses.map((status) => (
                    <Button
                        key={status}
                        variant={filterStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus(status)}
                        className="filter-btn"
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                ))}
            </div>

            {loading && orders.length === 0 ? (
                <div className="dashboard-loading">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
                <Card className="empty-state">
                    <Package className="empty-icon" />
                    <p>No orders found.</p>
                </Card>
            ) : (
                <div className="orders-list admin-orders-list">
                    {filteredOrders.map((order) => (
                        <Card key={order.id} className="order-card admin-order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <span className="order-id">Order #{order.id}</span>
                                    <span className={`order-status ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-meta">
                                    <span className="order-user">
                                        <User size={14} /> User #{order.user_id}
                                    </span>
                                    <span className="order-date">
                                        <Calendar size={14} /> {formatDate(order.order_date)}
                                    </span>
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

                            {adminStatusActions[order.status].length > 0 && (
                                <div className="order-actions">
                                    {adminStatusActions[order.status].map((action) => (
                                        <Button
                                            key={action}
                                            variant={action === "cancel" ? "destructive" : "default"}
                                            size="sm"
                                            onClick={() => handleAction(order.id, action)}
                                            disabled={loading}
                                        >
                                            <ArrowRight size={14} />
                                            {action.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
