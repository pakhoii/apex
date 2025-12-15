import { Separator } from "@/components/ui/separator";
import { Linkedin, Facebook, Twitter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./footer.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Contact Section */}
          <div className="footer-contact">
            {/* Logo */}
            <div className="footer-logo">
              <div className="footer-logo-outer">
                <div className="footer-logo-inner"></div>
              </div>
            </div>
            
            <div className="footer-contact-info">
              <p className="footer-phone">+84 0978 832 291</p>
              <p className="footer-email">support@apex.agency</p>
            </div>
          </div>

          {/* Quick Links - Product Section */}
          <div>
            <h3 className="footer-section-title">Quick Links</h3>
            <div className="footer-section">
              <a href="#" className="footer-link">
                Product
              </a>
              <a href="#" className="footer-link">
                Information
              </a>
            </div>
          </div>

          {/* Company Section */}
          <div className="footer-company-section">
            <div className="footer-section">
              <a href="#" className="footer-link">
                Company
              </a>
              <a href="#" className="footer-link">
                APEX Auto
              </a>
            </div>
          </div>

          {/* Subscribe Section */}
          <div className="footer-subscribe">
            <h3 className="footer-section-title">Subscribe</h3>
            <div className="footer-subscribe-form">
              <input
                type="email"
                placeholder="Get product updates"
                className="footer-subscribe-input"
              />
              <Button 
                className="footer-subscribe-button"
                aria-label="Subscribe"
              >
                <ArrowRight className="footer-social-icon" />
              </Button>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="footer-separator" />

        {/* Bottom Section */}
        <div className="footer-bottom">
          {/* Social Media Icons */}
          <div className="footer-social">
            <a
              href="#"
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <Linkedin className="footer-social-icon" />
            </a>
            <a
              href="#"
              className="footer-social-link"
              aria-label="Facebook"
            >
              <Facebook className="footer-social-icon" />
            </a>
            <a
              href="#"
              className="footer-social-link"
              aria-label="Twitter"
            >
              <Twitter className="footer-social-icon" />
            </a>
          </div>

          {/* Center Text */}
          <p className="footer-text">A product of APEX</p>

          {/* Copyright */}
          <p className="footer-copyright">
            &copy; {currentYear} APEX Auto. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
