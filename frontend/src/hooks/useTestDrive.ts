import { useState } from "react";
import { 
    createBookingApi,
    getMyBookingsApi,
    getAvailableSlotsApi,
    createSlotApi,
    getAllBookingsApi
} from "@/services/testdrive.api";
import type { BookingCreate, TestDriveSlotCreate } from "@/types/testdrive";

export const useTestDrive = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const createBooking = async (bookingData: BookingCreate) => {
        try {
            setLoading(true);
            setError(null);
            return await createBookingApi(bookingData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            return await getMyBookingsApi();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async (modelId?: number, date?: string) => {
        try {
            setLoading(true);
            setError(null);
            return await getAvailableSlotsApi(modelId, date);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createSlot = async (slotData: TestDriveSlotCreate) => {
        try {
            setLoading(true);
            setError(null);
            return await createSlotApi(slotData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getAllBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            return await getAllBookingsApi();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        createBooking,
        fetchMyBookings,
        fetchAvailableSlots,
        createSlot,
        getAllBookings,
        loading,
        error,
    };
};
