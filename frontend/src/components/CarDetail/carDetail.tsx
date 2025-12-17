import React from 'react';
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import './carDetail.css';

const CarDetail: React.FC = () => {
    return (
        <div className="car-detail-container">
            {/* Hero Image */}
            <img
                src="/images/bmw-m440i.png"
                alt="BMW M440i xDrive"
                className="car-detail-hero-image"
            />

            <div className="car-detail-content">
                {/* Left Column */}
                <div className="car-detail-main-col">
                    {/* Info Card */}
                    <Card className="car-detail-info-card border-none shadow-none gap-2">
                        <h1 className="car-detail-title">BMW M440i xDrive</h1>
                        <p className="car-detail-price">$67,500</p>
                    </Card>

                    {/* Specification Section */}
                    <div>
                        <h2 className="car-detail-specs-title">Specification</h2>
                        <div className="car-detail-table-container">
                            <table className="car-detail-table">
                                <thead>
                                    <tr>
                                        <th>Features</th>
                                        <th>Stats</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>BMW M440i xDrive</td>
                                    </tr>
                                    <tr>
                                        <td>Year</td>
                                        <td>2025</td>
                                    </tr>
                                    <tr>
                                        <td>Brand</td>
                                        <td>BMW</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="car-detail-sidebar">
                    <Button
                        size="lg"
                        className="car-detail-btn car-detail-btn-primary w-full text-base"
                        onClick={() => {
                            // TODO: Implement Add to Cart API call here
                            console.log("Add to cart clicked");
                        }}
                    >
                        Add To Cart
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="car-detail-btn car-detail-btn-outline w-full text-base"
                        onClick={() => {
                            // TODO: Implement Schedule Test Drive API call here
                            console.log("Schedule test drive clicked");
                        }}
                    >
                        Schedule Test Drive
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="car-detail-btn car-detail-btn-outline w-full text-base"
                        onClick={() => {
                            // TODO: Implement Compare API call here
                            console.log("Compare clicked");
                        }}
                    >
                        Compare
                    </Button>
                    <Button
                        variant="default"
                        size="lg"
                        className="car-detail-btn car-detail-btn-danger w-full text-base"
                        onClick={() => {
                            // TODO: Implement Add to Wishlist API call here
                            console.log("Add to wishlist clicked");
                        }}
                    >
                        Add To Wishlist
                    </Button>

                    {/* Service Info Box */}
                    <div className="car-detail-service-box">
                        <div className="car-detail-service-item">
                            <svg className="car-detail-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Free shipping on all orders</span>
                        </div>
                        <div className="car-detail-service-item">
                            <svg className="car-detail-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>30-day money-back guarantee</span>
                        </div>
                        <div className="car-detail-service-item">
                            <svg className="car-detail-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>24/7 customer support</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;
