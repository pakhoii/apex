import CarDetail from "@/components/CarDetail/carDetail";
import Navbar from "@/components/Navbar/navbar";
import { useParams } from "react-router-dom";
import "./models.css";

export default function ModelDetailsPage() {
    const { modelId } = useParams<{ modelId: string }>();
    return (
        <>
        <Navbar />
        <div className="model-details-page">
            <CarDetail modelId={Number(modelId)} />
        </div>
        </>
    );
}