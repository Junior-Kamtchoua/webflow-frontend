import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect } from "react";
import { useState } from "react";
import demoVideo from "../assets/good.mp4";

function Landing() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-wrapper">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3">
        <div className="container">
          {/* Logo + Brand */}
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center fw-bold"
            style={{ fontSize: "1.3rem" }}
          >
            <img
              src={logo}
              alt="Workflow File Management"
              style={{
                height: "40px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            />
            <span className="text-primary">Workflow File Management</span>
          </Link>

          {/* Menu */}
          <div className="ms-auto d-flex align-items-center gap-3">
            <Link className="nav-link text-dark fw-semibold" to="#">
              Features
            </Link>
            <Link className="nav-link text-dark fw-semibold" to="#">
              About
            </Link>
            <Link className="nav-link text-dark fw-semibold" to="#">
              Contact
            </Link>

            <Link
              to="/login"
              className="btn btn-outline-primary px-4"
              style={{ cursor: "pointer" }}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-primary px-4"
              style={{ cursor: "pointer" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero-ultra">
        <div className="animated-shape shape-a"></div>
        <div className="animated-shape shape-b"></div>

        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="ultra-title fade-up">
                Advanced File <br />
                Management Platform
              </h1>

              <p className="ultra-subtitle fade-up delay-1">
                Organize, share and collaborate on all your files in one secure
                and intelligent workspace.
              </p>

              <div className="d-flex gap-3 mt-4 fade-up delay-2">
                <a href="/register" className="btn ultra-btn-primary">
                  Get Started
                </a>

                <button
                  className="btn ultra-btn-demo"
                  onClick={() => setShowVideo(true)}
                >
                  ▶ Watch Demo
                </button>
              </div>
            </div>

            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <div className="mockup-card">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                  alt="Dashboard"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
      </section>

      {/* ================= FEATURE STRIP ================= */}
      <section className="feature-strip card-hover reveal glass">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon bg-primary">📁</div>
                <h5>Easy Organization</h5>
                <p>
                  Manage your files with folders, smart tags and intelligent
                  sorting.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon bg-success">🔐</div>
                <h5>Secure Sharing</h5>
                <p>
                  Share files with advanced permissions and enterprise-level
                  security.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon bg-warning">🤝</div>
                <h5>Team Collaboration</h5>
                <p>
                  Work together in real-time with your team across projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= POWERFUL FEATURES ================= */}
      <section
        className="powerful-section card-hover reveal glass"
        id="features"
      >
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="powerful-title">
              Powerful Features for File Management
            </h2>
            <p className="powerful-subtitle">
              Everything you need to manage your workflow efficiently.
            </p>
          </div>

          <div className="row g-5">
            {/* CARD 1 */}
            <div className="col-lg-4">
              <div className="power-card fade-up delay-1">
                <img
                  src="https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg"
                  alt="Drag & Drop"
                  className="img-fluid power-img"
                />
                <div className="power-content">
                  <h5>Drag & Drop Uploads</h5>
                  <p>
                    Upload files instantly with intuitive drag & drop
                    functionality.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="col-lg-4">
              <div className="power-card fade-up delay-1">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                  alt="Preview"
                  className="img-fluid power-img"
                />
                <div className="power-content">
                  <h5>File Previews</h5>
                  <p>
                    Preview documents, images and videos directly in your
                    browser.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="col-lg-4">
              <div className="power-card fade-up delay-1">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475"
                  alt="Cloud Backup"
                  className="img-fluid power-img"
                />
                <div className="power-content">
                  <h5>Cloud Backup</h5>
                  <p>
                    Keep your files safe with automatic cloud backup systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="testimonial-section reveal card-hover">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="testimonial-title">What Our Users Say</h2>
            <p className="testimonial-subtitle">
              Trusted by teams and professionals worldwide.
            </p>
          </div>

          <div className="row g-4">
            {/* TESTIMONIAL 1 */}
            <div className="col-lg-6">
              <div className="testimonial-card">
                <div className="testimonial-user">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Sarah"
                    className="testimonial-avatar"
                  />
                  <div>
                    <h6 className="mb-0">Sarah L.</h6>
                    <small className="text-muted">Product Manager</small>
                  </div>
                </div>

                <p className="testimonial-text">
                  FileFlow has completely transformed our workflow. It's
                  intuitive, fast and incredibly reliable.
                </p>
              </div>
            </div>

            {/* TESTIMONIAL 2 */}
            <div className="col-lg-6">
              <div className="testimonial-card">
                <div className="testimonial-user">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Mark"
                    className="testimonial-avatar"
                  />
                  <div>
                    <h6 className="mb-0">Mark T.</h6>
                    <small className="text-muted">Tech Lead</small>
                  </div>
                </div>

                <p className="testimonial-text">
                  The best file management platform we’ve used. Secure, clean
                  interface and perfect for collaboration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="cta-section card-hover">
        <div className="container text-center">
          <h2 className="cta-title">Get Started Today</h2>

          <p className="cta-subtitle">
            Boost your productivity and manage your files smarter with FileFlow.
          </p>

          <div className="cta-buttons">
            <a href="/register" className="btn cta-primary">
              Create Free Account
            </a>

            <a href="/login" className="btn cta-secondary">
              Login to Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer-section">
        <div className="container">
          <div className="row gy-4">
            {/* LOGO + DESCRIPTION */}
            <div className="col-lg-3">
              <h4 className="footer-logo">FileFlow</h4>
              <p className="footer-description">
                Advanced file management platform built for teams and
                professionals.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div className="col-lg-3">
              <h6 className="footer-title">Quick Links</h6>
              <ul className="footer-links">
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="/login">Login</a>
                </li>
              </ul>
            </div>

            {/* RESOURCES */}
            <div className="col-lg-3">
              <h6 className="footer-title">Resources</h6>
              <ul className="footer-links">
                <li>
                  <a href="#">Documentation</a>
                </li>
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Support</a>
                </li>
                <li>
                  <a href="#">API</a>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div className="col-lg-3">
              <h6 className="footer-title">Company</h6>
              <ul className="footer-links">
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="footer-divider" />

          <div className="text-center footer-bottom">
            © {new Date().getFullYear()} Workflow File Management. All rights
            reserved.
          </div>
        </div>
      </footer>

      {showVideo && (
        <div className="video-modal" onClick={() => setShowVideo(false)}>
          <div className="video-container" onClick={(e) => e.stopPropagation()}>
            <button className="video-close" onClick={() => setShowVideo(false)}>
              ✕
            </button>

            {showVideo && (
              <div className="video-modal" onClick={() => setShowVideo(false)}>
                <div
                  className="video-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="video-close"
                    onClick={() => setShowVideo(false)}
                  >
                    ✕
                  </button>

                  <video
                    src={demoVideo}
                    controls
                    autoPlay
                    style={{ width: "100%", borderRadius: "12px" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
