export type TestDriveStatus =
    "SCHEDULED" |
    "COMPLETED" |
    "CANCELLED";

export interface TestDriveSlotOut {
    id: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
    is_available: boolean;
}

export interface TestDriveSlotCreate {
    start_time: string;
    end_time: string;
    is_active?: boolean;
}

export interface BookingCreate {
    model_id: number;
    slot_id: number;
    scheduled_date: string;
}

export interface BookingOut {
    id: number;
    user_id: number;
    model_id: number;
    slot_id: number;
    scheduled_date: string;
    status: TestDriveStatus;
    created_at: string;
}

// Props
export interface TestDriveFormProps {
    modelId: number;
}

export interface TestDrivePageProps {
    modelId: number;
    name: string;
    imageUrl: string | null;
}