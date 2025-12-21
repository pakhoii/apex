import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTestDrive } from "@/hooks/useTestDrive";
import type { TestDriveFormProps, TestDriveSlotOut } from "@/types/testdrive";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import "./testDriveForm.css";


const formSchema = z.object({
    scheduledDate: z.string().min(1, { message: "Scheduled date is required" }),
    slotId: z.string().min(1, { message: "Time slot is required" }),
});


export default function TestDriveForm(props: TestDriveFormProps) {
    const { createBooking, fetchAvailableSlots, loading, error } = useTestDrive();
    const [availableSlots, setAvailableSlots] = useState<TestDriveSlotOut[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [loadingSlots, setLoadingSlots] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            scheduledDate: "",
            slotId: "",
        },
    }); 

    // Fetch available slots when date changes
    useEffect(() => {
        const loadSlots = async () => {
            if (selectedDate) {
                setLoadingSlots(true);
                try {
                    const slots = await fetchAvailableSlots(props.modelId, selectedDate);
                    setAvailableSlots(slots || []);
                } catch (err) {
                    console.error("Failed to fetch slots:", err);
                    setAvailableSlots([]);
                } finally {
                    setLoadingSlots(false);
                }
            } else {
                setAvailableSlots([]);
            }
        };
        loadSlots();
    }, [selectedDate, props.modelId]);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        form.setValue("slotId", ""); // Reset slot selection when date changes
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await createBooking({
                model_id: props.modelId,
                slot_id: parseInt(data.slotId),
                scheduled_date: data.scheduledDate,
            });
            alert("Test drive booking successful!");
            form.reset();
            setSelectedDate("");
            setAvailableSlots([]);
        } catch (err) {
            console.error("Booking failed:", err);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="test-drive-form">
                <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Scheduled Date</FormLabel>
                            <FormControl>
                                <Input 
                                    type="date" 
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleDateChange(e.target.value);
                                    }}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slotId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Available Time Slots</FormLabel>
                            <FormControl>
                                <div className="slots-container">
                                    {!selectedDate && (
                                        <p className="slots-message">Please select a date first</p>
                                    )}
                                    {selectedDate && loadingSlots && (
                                        <p className="slots-message">Loading available slots...</p>
                                    )}
                                    {selectedDate && !loadingSlots && availableSlots.length === 0 && (
                                        <p className="slots-message">No available slots for this date</p>
                                    )}
                                    {selectedDate && !loadingSlots && availableSlots.length > 0 && (
                                        <div className="slots-grid">
                                            {availableSlots.map((slot) => (
                                                <label
                                                    key={slot.id}
                                                    className={`slot-option ${
                                                        !slot.is_available ? 'slot-disabled' : ''
                                                    } ${
                                                        field.value === String(slot.id) ? 'slot-selected' : ''
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        value={slot.id}
                                                        checked={field.value === String(slot.id)}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        disabled={!slot.is_available}
                                                        className="slot-radio"
                                                    />
                                                    <span className="slot-time">
                                                        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                                    </span>
                                                    {!slot.is_available && (
                                                        <span className="slot-status">Booked</span>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && <p className="error-message">{error}</p>}

                <Button 
                    type="submit"
                    disabled={loading || loadingSlots || !selectedDate || availableSlots.length === 0}
                >
                    {loading ? "Booking..." : "Book Test Drive"}
                </Button>
            </form>
        </Form>
    );
}