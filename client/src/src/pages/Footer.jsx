import React from "react";
import { Link } from "react-router-dom";
import "../components/Footer.css"

const Footer = () => {
  const categories = [
    { name: "Milk Products", path: "/" },
    { name: "Paneer & Tofu", path: "/PaneerAndTofu" },
    { name: "Peanut Butter", path: "/PeanutButter" },
    { name: "Curd & Yogurt", path: "/Curd" },
    { name: "Fresh Bread", path: "/Bread" },
    { name: "Vermicelli", path: "/Vermicelli" }
  ];

  const services = [
    "Fresh Grocery",
    "Quality Products",
    "Daily Essentials",
    "Fast Delivery"
  ];

  return (
    <footer className="fe-footer">
      <div className="fe-footer-container">
        <section className="fe-footer-hero">
          <div className="fe-hero-content">
            <span className="fe-eyebrow">
              FRESHNESS YOU CAN TRUST
            </span>
            <h2>
              Good Food.
              <br />
              <span>Better Living.</span>
            </h2>
            <p>
              Fresh picks, everyday essentials and goodness
              delivered straight to your doorstep.
            </p>
            <Link to="/" className="fe-shop-button">
              Explore Products <span>↗</span>
            </Link>
            <div className="fe-hero-note">
              <span className="fe-note-dot"></span>
              Fresh choices for happier homes
            </div>
          </div>

          <div className="fe-hero-image">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85"
              alt="Fresh vegetables and groceries"
            />
            <div className="fe-image-tag">
              <span className="fe-tag-icon">✳</span>
              <div>
                <strong>Fresh Everyday</strong>
                <small>Goodness in every basket</small>
              </div>
            </div>
            <div className="fe-floating-circle">100%<br />GOODNESS</div>
          </div>
        </section>

        <section className="fe-category-section">
          <div className="fe-section-heading">
            <div>
              <span className="fe-eyebrow">EXPLORE OUR STORE</span>
              <h3>Everything for your <span>everyday.</span></h3>
            </div>
            <Link to="/" className="fe-text-link">
              Shop all products ↗
            </Link>
          </div>

          <div className="fe-category-grid">
            <Link to="/" className="fe-category-card fe-category-fruits">
              <img
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80"
                alt="Fresh fruits"
                loading="lazy"
              />
              <span className="fe-category-overlay"></span>
              <span className="fe-category-label">
                <small>FRESH PICKS</small>
                <strong>Fresh Fruits</strong>
              </span>
              <span className="fe-category-arrow">↗</span>
            </Link>

            <Link to="/" className="fe-category-card fe-category-vegetables">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
                alt="Fresh vegetables"
                loading="lazy"
              />
              <span className="fe-category-overlay"></span>
              <span className="fe-category-label">
                <small>GREEN GOODNESS</small>
                <strong>Vegetables</strong>
              </span>
              <span className="fe-category-arrow">↗</span>
            </Link>

            <Link to="/PaneerAndTofu" className="fe-category-card fe-category-dairy">
              <img
                src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80"
                alt="Fresh dairy products"
                loading="lazy"
              />
              <span className="fe-category-overlay"></span>
              <span className="fe-category-label">
                <small>DAILY ESSENTIALS</small>
                <strong>Dairy & More</strong>
              </span>
              <span className="fe-category-arrow">↗</span>
            </Link>
          </div>
        </section>

        <div className="fe-footer-main">
          <div className="fe-footer-brand">
            <Link to="/" className="fe-logo">
              <span className="fe-logo-symbol">f</span>
              <span>farm<span className="fe-logo-accent">Era</span></span>
            </Link>
            <p>
              Bringing freshness and everyday goodness
              to your home, one basket at a time.
            </p>
            <div className="fe-socials">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
            </div>
          </div>

          <div className="fe-footer-column">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/login">My Account</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/">Shop Products</Link>
          </div>

          <div className="fe-footer-column">
            <h4>Our Categories</h4>
            {categories.map((category) => (
              <Link to={category.path} key={category.name}>
                {category.name}
              </Link>
            ))}
          </div>

          <div className="fe-footer-column fe-contact-column">
            <h4>Let's Connect</h4>
            <p>Have a question? We'd love to hear from you.</p>
            <a href="mailto:hello@farmera.com">✉ hello@farmera.com</a>
            <div className="fe-footer-mini-image">
              <img
                src="https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=500&q=80"
                alt="Fresh grocery basket"
                loading="lazy"
              />
              <span>Freshness for every day.</span>
            </div>
          </div>
        </div>

        <div className="fe-footer-bottom">
          <p>© {new Date().getFullYear()} farmEra. All rights reserved.</p>
          <p>Made with <span>♥</span> for fresher living.</p>
          <Link to="/">Back to top ↑</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;