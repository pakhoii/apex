import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModel } from "@/hooks/useModel";
import type { ModelOut, PagedModelResponse } from "@/types/model";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CompareChoosingProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentModelId: number;
    currentModelName?: string;
}

const CompareChoosing: React.FC<CompareChoosingProps> = ({
    open,
    onOpenChange,
    currentModelId,
    currentModelName,
}) => {
    const [models, setModels] = useState<ModelOut[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const { fetchModels } = useModel();
    const navigate = useNavigate();

    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        if (open) {
            loadModels();
        }
    }, [open, page]);

    const loadModels = async () => {
        setLoading(true);
        try {
            const response: PagedModelResponse = await fetchModels(
                {},
                { skip: (page - 1) * ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE }
            );
            // Filter out the current model from the list
            const filteredModels = response.rows.filter(
                (model) => model.id !== currentModelId
            );
            setModels(filteredModels);
            setTotalPages(response.total_pages);
        } catch (err) {
            console.error("Failed to fetch models:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectModel = (selectedModelId: number) => {
        onOpenChange(false);
        navigate(`/compare/${currentModelId}/${selectedModelId}`);
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Choose a Model to Compare</DialogTitle>
                    <DialogDescription>
                        Select a vehicle to compare with{" "}
                        {currentModelName || "the current model"}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <span className="text-gray-500">Loading models...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {models.map((model) => (
                                <div
                                    key={model.id}
                                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => handleSelectModel(model.id)}
                                >
                                    <div className="aspect-video w-full overflow-hidden rounded-md mb-3 bg-gray-100">
                                        <img
                                            src={
                                                model.image_url ||
                                                "/images/placeholder-car.jpg"
                                            }
                                            alt={model.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-sm truncate">
                                        {model.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        ${model.price?.toLocaleString()}
                                    </p>
                                    <p className="text-gray-400 text-xs">{model.year}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {models.length === 0 && !loading && (
                        <div className="flex items-center justify-center py-8">
                            <span className="text-gray-500">No other models available</span>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={page <= 1 || loading}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={page >= totalPages || loading}
                    >
                        Next
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CompareChoosing;
