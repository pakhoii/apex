import http from "./http";
import type { BookingCreate, TestDriveSlotCreate } from "@/types/testdrive";

export const createBookingApi = (bookingData: BookingCreate) => {
    return http.post("/test-drive/bookings", bookingData).then(res => res.data);
};

export const getMyBookingsApi = () => {
    return http.get("/test-drive/bookings/me").then(res => res.data);
};

export const getAvailableSlotsApi = (modelId?: number, date?: string) => {
    const params: Record<string, string | number> = {};
    if (modelId !== undefined) {
        params.model_id = modelId;
    }
    if (date !== undefined) {
        params.date = date;
    }
    return http.get("/test-drive/slots", { params }).then(res => res.data);
};

export const createSlotApi = (slotData: TestDriveSlotCreate) => {
    return http.post("/test-drive/slots", slotData).then(res => res.data);
};
