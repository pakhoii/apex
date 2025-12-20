import ModelGallery from "@/components/ModelsGallery/modelGallery";
import { useModel } from "@/hooks/useModel";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/useInView";
import Navbar from "@/components/Navbar/navbar";
import { Footer } from "@/components/Footer/footer";

import "./landing.css";

export default function Landing() {
    const { fetchModels, loading, error } = useModel();
    const [models, setModels] = useState([]);

    const section1Ref = useInView({ threshold: 0.2 });
    const section2Ref = useInView({ threshold: 0.2 });
    const section3Ref = useInView({ threshold: 0.2 });

    useEffect(() => {
        const getModels = async () => {
            const pagination = { skip: 0, limit: 10 };
            try {
                const data = await fetchModels(pagination);
                setModels(data.rows);
            } catch (err) {
                console.error("Failed to fetch models:", err);
            }
        }
        getModels();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="landing-page">
                {/* Section 1 */}
                <div 
                    className={`section-container ${section1Ref.isVisible ? 'fade-in' : 'fade-out'}`}
                    ref={section1Ref.ref}
                >
                    <img 
                        src="/images/mclaren.jpg" 
                        alt="Apex Models"
                        className="section-img"
                    />
                    <div className="section-info">
                        <h1 className="title">APEX</h1>
                        <p className="slogan">Driven by Quality, Defined by Trust</p>
                        <Button className="discover-btn" size="lg">
                            Discover Now
                        </Button>
                    </div>
                </div>

                {/* Section 2 */}
                <div 
                    className={`section-container ${section2Ref.isVisible ? 'fade-in' : 'fade-out'}`}
                    ref={section2Ref.ref}
                >
                    <ModelGallery models={models} />
                </div>

                {/* Section 3 */}
                <div 
                    className={`section-container ${section3Ref.isVisible ? 'fade-in' : 'fade-out'}`}
                    ref={section3Ref.ref}
                >
                    <img 
                        src="/images/yellow-abstract.jpg" 
                        alt="Yellow Abstract"
                        className="section-img"
                    />
                    <div className="section-info">
                        <h1 className="title">More About Us</h1>
                        <div className="m-4"></div>
                        <Button className="discover-btn" size="lg">
                            Discover Now
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}