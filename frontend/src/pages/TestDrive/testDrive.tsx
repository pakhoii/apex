import Navbar from "@/components/Navbar/navbar";
import TestDriveForm from "@/components/TestDriveForm/testDriveForm";
import { useModel } from "@/hooks/useModel";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./testdrive.css";

interface ModelDetails {
    id: number;
    name: string;
    image_url: string | null;
}

export default function TestDrive() {
    const { modelId } = useParams<{ modelId: string }>();
    const navigate = useNavigate();
    const { fetchModelsDetails, loading, error } = useModel();
    const [model, setModel] = useState<ModelDetails | null>(null);

    useEffect(() => {
        const loadModel = async () => {
            if (!modelId) {
                navigate("/models");
                return;
            }

            try {
                const data = await fetchModelsDetails(Number(modelId));
                setModel(data);
            } catch (err) {
                console.error("Failed to fetch model details:", err);
            }
        };

        loadModel();
    }, [modelId]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="test-drive-page">
                    <div className="header">
                        <h1>Loading...</h1>
                    </div>
                </div>
            </>
        );
    }

    if (error || !model) {
        return (
            <>
                <Navbar />
                <div className="test-drive-page">
                    <div className="header">
                        <h1>Model not found</h1>
                        <p>The requested model could not be found.</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="test-drive-page">
                <div className="header">
                    <h1>Schedule a Test Drive</h1>
                    <p>Experience the thrill of driving {model.name}. Book a test drive today!</p>
                    <hr />
                </div>

                <div className="model-info">
                    {model.image_url && (
                        <img 
                            src={model.image_url} 
                            alt={model.name} 
                            className="model-image"
                        />
                    )}
                </div>

                <div className="form-container">
                    <TestDriveForm modelId={model.id} />
                </div>
            </div>
        </>
    );
}