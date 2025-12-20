import TestDriveForm from "@/components/TestDriveForm/testDriveForm";
import type { TestDrivePageProps } from "@/types/testdrive";
import Navbar from "@/components/Navbar/navbar";

import "./testdrive.css";

export default function TestDrive(props: TestDrivePageProps) {
    return (
        <>
            <Navbar />
            <div className="test-drive-page">
                <div className="header">
                    <h1>Schedule a Test Drive</h1>
                    <p>Experience the thrill of driving {props.name}. Book a test drive today!</p>
                    <hr />
                </div>

                <div className="model-info">
                    {props.imageUrl && (
                        <img 
                            src={props.imageUrl} 
                            alt={props.name} 
                            className="model-image"
                        />
                    )}
                </div>

                <div className="form-container">
                    <TestDriveForm modelId={props.modelId} />
                </div>
            </div>
        </>
    );
}