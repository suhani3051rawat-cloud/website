import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import "../components/Footer.css";

const Footer = () => {
  const footerRef = useRef(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { name: "Milk Products", path: "/" },
    { name: "Paneer & Tofu", path: "/PaneerAndTofu" },
    { name: "Peanut Butter", path: "/PeanutButter" },
    { name: "Curd & Yogurt", path: "/Curd" },
    { name: "Fresh Bread", path: "/Bread" },
    { name: "Vermicelli", path: "/Vermicelli" }
  ];

  useEffect(() => {
    const root = footerRef.current;
    if (!root) return;

    const elements = root.querySelectorAll(".fe-reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("fe-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fe-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleBackToTop = (event) => {
    event.preventDefault();
    if (["/login", "/register"].includes(location.pathname)) {
      navigate("/");
    }
    scrollTop();
  };

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="fe-footer" ref={footerRef}>
      <div className="fe-orb fe-orb-one" aria-hidden="true" />
      <div className="fe-orb fe-orb-two" aria-hidden="true" />

      <div className="fe-footer-container">
        <section className="fe-hero fe-reveal">
          <div className="fe-hero-content">
            <span className="fe-eyebrow">Your daily dose of goodness</span>

            <h2>
              Eat fresh.
              <br />
              <span>Live better.</span>
            </h2>

            <p>
              Everyday essentials, farm-fresh goodness and quality you can
              feel in every bite.
            </p>

            <div className="fe-hero-actions">
              <Link to="/" className="fe-shop-button">
                Explore our store
                <span>→</span>
              </Link>

              <Link to="/register" className="fe-ghost-button">
                Create account
              </Link>
            </div>

            <div className="fe-pills">
              <span>🥛 Farm fresh</span>
              <span>🧀 Handpicked</span>
              <span>🍞 Baked daily</span>
            </div>

            <div className="fe-hero-stats">
              <div>
                <strong>6+</strong>
                <small>Fresh categories</small>
              </div>
              <div>
                <strong>100%</strong>
                <small>Quality checked</small>
              </div>
              <div>
                <strong>Daily</strong>
                <small>Fresh stock</small>
              </div>
            </div>
          </div>

          <div className="fe-hero-visual">
            <div className="fe-image-frame">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85"
                alt="Fresh vegetables and groceries"
                loading="lazy"
              />
            </div>

            <div className="fe-sun" aria-hidden="true" />

            <div className="fe-fresh-stamp">
              <span>100%</span>
              <small>FRESH DAILY</small>
            </div>

            <div className="fe-floating-note">
              <span className="fe-note-icon">✳</span>
              <div>
                <strong>Nature's best</strong>
                <small>Picked with care</small>
              </div>
            </div>
          </div>
        </section>

        <section className="fe-promise fe-reveal">
          <div className="fe-promise-item">
            <span className="fe-promise-icon">✳</span>
            <div>
              <strong>Quality First</strong>
              <small>Carefully selected products</small>
            </div>
          </div>

          <div className="fe-promise-item">
            <span className="fe-promise-icon">♡</span>
            <div>
              <strong>Made for Families</strong>
              <small>Goodness for every home</small>
            </div>
          </div>

          <div className="fe-promise-item">
            <span className="fe-promise-icon">↗</span>
            <div>
              <strong>Easy Shopping</strong>
              <small>Your essentials in one place</small>
            </div>
          </div>
        </section>

        <section className="fe-footer-main fe-reveal">
          <div className="fe-brand-column">
            <Link to="/" className="fe-logo">
              <span className="fe-logo-mark">f</span>
              <span>
                farm<span>Era</span>
              </span>
            </Link>

            <p>
              A little more freshness, a little more happiness. Making everyday
              shopping feel good.
            </p>

            <div className="fe-socials">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div className="fe-link-column">
            <h4>Explore</h4>
            <Link to="/" onClick={scrollTop}>Home</Link>
            <Link to="/login" onClick={scrollTop}>My Account</Link>
            <Link to="/register" onClick={scrollTop}>Create Account</Link>
            <Link to="/" onClick={scrollTop}>Shop Products</Link>
          </div>

          <div className="fe-link-column">
            <h4>Categories</h4>
            {categories.map((category) => (
              <Link to={category.path} key={category.name} onClick={scrollTop}>
                {category.name}
              </Link>
            ))}
          </div>

          <div className="fe-contact-column">
            <span className="fe-eyebrow">Say hello</span>
            <h4>Let's keep things fresh.</h4>

            <p>
              Questions, suggestions or just a little hello? We would love to
              hear from you.
            </p>

            <a href="mailto:hello@farmera.com" className="fe-email-link">
              hello@farmera.com
              <span>↗</span>
            </a>

            {subscribed ? (
              <div className="fe-subscribed">Thanks! You are on the list.</div>
            ) : (
              <form className="fe-subscribe" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email for fresh offers"
                  aria-label="Email address"
                  required
                />
                <button type="submit">Join</button>
              </form>
            )}
          </div>
        </section>

        <div className="fe-footer-bottom">
          <p>© {new Date().getFullYear()} farmEra. All rights reserved.</p>

          <p>
            Grown with care. Made for you. <span>♥</span>
          </p>

          <a
            className="fe-back-top"
            href="#top"
            onClick={handleBackToTop}
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;