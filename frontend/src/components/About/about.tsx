import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Lightbulb, Zap } from "lucide-react";
import './about.css';

export default function AboutPage() {
    return (
        <main className="about-main">
            <div className="about-container">
                {/* Hero Section */}
                <section className="about-hero-section">
                    <div className="about-hero-divider-container">
                        <div className="about-hero-divider"></div>
                    </div>
                    <h1 className="about-hero-title">
                        About <span className="text-gold">Us</span>
                    </h1>
                    <p className="about-hero-desc">
                        A team of three passionate students dedicated to creating exceptional digital experiences through code and
                        design
                    </p>
                </section>

                {/* Introduction */}
                <section className="about-intro-section">
                    <div className="about-intro-grid">
                        <div className="relative">
                            <div className="about-intro-bg-effect"></div>
                            <div className="relative">
                                <img
                                    src="/images/about-hero.png"
                                    alt="APEX Logo with luxury car"
                                    className="about-intro-image"
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="about-section-subtitle">
                                Our <span className="text-gold">Story</span>
                            </h2>
                            <div className="about-text-content">
                                <p>
                                    What started as a university project quickly evolved into a shared passion for building innovative web
                                    solutions.
                                </p>
                                <p>
                                    We are three students who believe that great software comes from the perfect blend of creativity,
                                    technical expertise, and attention to detail.
                                </p>
                                <p>
                                    Every line of code we write and every design we create is a step towards mastering our craft and
                                    delivering excellence.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Members */}
                <section className="about-team-section">
                    <div className="about-team-header">
                        <h2 className="about-team-title">
                            Meet the <span className="text-gold">Team</span>
                        </h2>
                        <div className="about-team-divider"></div>
                    </div>
                    <div className="about-team-grid">
                        {[
                            {
                                name: "Ben Zâm",
                                role: "Frontend Developer",
                                description: "Specializes in React, UI/UX design, and creating seamless user experiences",
                                image: "/images/team-member-1.jpg",
                            },
                            {
                                name: "Rô Lan Đô",
                                role: "Backend Developer",
                                description: "Expert in API development, database architecture, and server-side logic",
                                image: "/images/team-member-2.png",
                            },
                            {
                                name: "Ga Rét Ba Lê",
                                role: "Full-stack Developer",
                                description: "Bridges frontend and backend, handles deployment and system integration",
                                image: "/images/team-member-3.jpg",
                            },
                        ].map((member, index) => (
                            <div key={index} className="group">
                                <Card className="about-team-card">
                                    <CardContent className="p-0">
                                        <div className="about-member-img-container">
                                            <img
                                                src={member.image || "/placeholder.svg"}
                                                alt={member.name}
                                                className="about-member-img"
                                            />
                                            <div className="about-member-overlay" />
                                            <div className="about-member-info">
                                                <div className="about-member-role-line"></div>
                                                <h3 className="about-member-name">{member.name}</h3>
                                                <p className="about-member-role">{member.role}</p>
                                            </div>
                                        </div>
                                        <p className="about-member-desc">{member.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Values */}
                <section className="about-values-section">
                    <div className="about-values-bg"></div>
                    <div className="about-values-header">
                        <h2 className="about-team-title">
                            Our <span className="text-gold">Values</span>
                        </h2>
                        <div className="about-team-divider"></div>
                    </div>
                    <div className="about-values-grid">
                        {[
                            {
                                Icon: BookOpen,
                                title: "Continuous Learning",
                                description: "We stay ahead by constantly exploring new technologies and industry best practices",
                            },
                            {
                                Icon: Lightbulb,
                                title: "Creative Innovation",
                                description: "We bring fresh perspectives and creative solutions to every challenge we face",
                            },
                            {
                                Icon: Zap,
                                title: "Quality First",
                                description: "We are committed to delivering polished, professional work that exceeds expectations",
                            },
                        ].map(({ Icon, title, description }, index) => (
                            <Card key={index} className="about-value-card group">
                                <CardContent className="p-0">
                                    <div className="about-value-icon-box">
                                        <Icon className="text-4xl w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="about-value-title">
                                        {title}
                                    </h3>
                                    <p className="about-value-desc">{description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
