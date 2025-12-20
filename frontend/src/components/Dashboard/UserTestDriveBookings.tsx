import { Card } from "@/components/ui/card";
import { useModel } from "@/hooks/useModel";
import { useTestDrive } from "@/hooks/useTestDrive";
import type { ModelOut } from "@/types/model";
import type { BookingOut, TestDriveStatus } from "@/types/testdrive";
import { Calendar, Car, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import "./dashboard.css";

const statusColors: Record<TestDriveStatus, string> = {
    pending: "status-pending",
    confirmed: "status-confirmed",
    completed: "status-delivered",
    cancelled: "status-cancelled",
};

export default function UserTestDriveBookings() {
    const { fetchMyBookings, loading } = useTestDrive();
    const { fetchModelsDetails } = useModel();
    const [bookings, setBookings] = useState<BookingOut[]>([]);
    const [modelNames, setModelNames] = useState<Record<number, string>>({});

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await fetchMyBookings();
            setBookings(data);
            
            // Fetch model names
            const modelIds = new Set<number>(data.map((b: BookingOut) => b.model_id));
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
            console.error("Failed to fetch bookings:", err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading && bookings.length === 0) {
        return <div className="dashboard-loading">Loading bookings...</div>;
    }

    return (
        <div className="user-bookings">
            <h2 className="section-title">
                <Car className="section-icon" />
                My Test Drive Bookings
            </h2>
            
            {bookings.length === 0 ? (
                <Card className="empty-state">
                    <Car className="empty-icon" />
                    <p>You haven't booked any test drives yet.</p>
                </Card>
            ) : (
                <div className="bookings-list">
                    {bookings.map((booking) => (
                        <Card key={booking.id} className="booking-card">
                            <div className="booking-header">
                                <div className="booking-info">
                                    <span className="booking-id">Booking #{booking.id}</span>
                                    <span className={`booking-status ${statusColors[booking.status]}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="booking-details">
                                <div className="booking-model">
                                    <Car size={18} />
                                    <span>{modelNames[booking.model_id] || `Model #${booking.model_id}`}</span>
                                </div>
                                <div className="booking-schedule">
                                    <div className="schedule-item">
                                        <Calendar size={16} />
                                        <span>{formatDate(booking.scheduled_date)}</span>
                                    </div>
                                    <div className="schedule-item">
                                        <Clock size={16} />
                                        <span>Slot #{booking.slot_id}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="booking-footer">
                                <span className="created-at">
                                    Created: {formatDate(booking.created_at)}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
