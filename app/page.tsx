
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  ArrowRight,
  Play,
  Sparkles,
  Video,
  Clapperboard,
  Camera,
  MonitorPlay,
  Instagram,
  Youtube,
  MessageCircle,
  CheckCircle2,
  Menu,
  WandSparkles,
} from "lucide-react";

type PortfolioItem = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  media_url: string;
  media_type: string;
};

const whatsapp =
  "https://wa.me/917007927037?text=" +
  encodeURIComponent("Hello SHAURYA VISUALS! I want to order a video editing service.");

const services = [
  {
    icon: <Video size={28} />,
    title: "Reels & Shorts Editing",
    desc: "Eye-catching Instagram Reels and YouTube Shorts with stylish transitions.",
  },
  {
    icon: <Youtube size={28} />,
    title: "YouTube Video Editing",
    desc: "Professional long-form videos, cinematic cuts and engaging storytelling.",
  },
  {
    icon: <Camera size={28} />,
    title: "Wedding & Events",
    desc: "Beautiful cinematic memories with creative editing and smooth effects.",
  },
  {
    icon: <Clapperboard size={28} />,
    title: "Promotional Videos",
    desc: "Creative advertisements and promotional videos for your brand.",
  },
  {
    icon: <MonitorPlay size={28} />,
    title: "Business & Branding",
    desc: "Professional visuals that help your business make an impression.",
  },
  {
    icon: <WandSparkles size={28} />,
    title: "Creative Editing",
    desc: "Unique visual effects, color grading and custom editing projects.",
  },
];

const features = [
  "Creative and modern editing",
  "Attention to every detail",
  "Personalized editing style",
  "Customer-focused service",
];

export default function Home() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      const { data, error } = await supabase
        .from("portfolio")
        .select("id, title, category, description, media_url, media_type");

      if (error) {
        console.error("Portfolio loading error:", error.message);
      } else {
        setProjects(data || []);
      }

      setPortfolioLoading(false);
    }

    loadPortfolio();
  }, []);

  return (
    <main>
      <nav className="navbar">
        <div className="container nav-inner">
          <a href="#" className="brand">
            <span className="brand-icon">SV</span>
            <span>
              SHAURYA
              <small>VISUALS</small>
            </span>
          </a>

          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div className="hero-actions">
  <a href="/order" className="primary-btn nav-cta">
    Order Now <ArrowRight size={17} />
  </a>

  <a href="/track" className="outline-btn nav-cta">
    Track Order
  </a>
</div>
          <a href="#services" className="mobile-menu">
            <Menu size={25} />
          </a>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />

        <div className="container hero-grid">
          <div className="hero-content">
            <div className="eyebrow">
              <Sparkles size={15} />
              CREATIVE VIDEO EDITING STUDIO
            </div>

            <h1>
              WE TURN YOUR
              <br />
              IDEAS INTO
              <br />
              <span className="gradient-text">VISUAL MAGIC.</span>
            </h1>

            <p>
              Every frame tells a story. We transform ordinary
              footage into extraordinary visual experiences
              with creativity, passion and precision.
            </p>

            <div className="hero-actions">
              <a href="#services" className="primary-btn">
                Explore Services <ArrowRight size={18} />
              </a>

              <a href="#portfolio" className="outline-btn">
                <Play size={17} /> View Our Work
              </a>
            </div>

            <div className="hero-trust">
              <span><CheckCircle2 size={16} /> Creative Editing</span>
              <span><CheckCircle2 size={16} /> Custom Projects</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />
            <div className="visual-card glass">
              <div className="visual-top">
                <span className="live-dot" /> CREATIVE STUDIO
                <span className="visual-dots">•••</span>
              </div>

              <div className="visual-screen">
                <div className="screen-content">
                  <Sparkles size={34} />
                  <h2>CREATE.</h2>
                  <h2 className="gradient-text">INSPIRE.</h2>
                  <p>MAKE IT VISUAL.</p>
                </div>
                <div className="screen-ring ring-one" />
                <div className="screen-ring ring-two" />
              </div>

              <div className="timeline">
                <span className="timeline-play"><Play size={12} /></span>
                <div className="timeline-track">
                  <span />
                </div>
                <span>00:24</span>
              </div>

              <div className="visual-bottom">
                <span>✦ VIDEO EDITING</span>
                <span>✦ MOTION DESIGN</span>
              </div>
            </div>

            <div className="floating-tag tag-top">
              <Sparkles size={17} /> Creative Vision
            </div>

            <div className="floating-tag tag-bottom">
              <WandSparkles size={17} /> Premium Visuals
            </div>
          </div>
        </div>

        <div className="hero-bottom container">
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-line" />
          <span>01 / 04</span>
        </div>
      </section>

      <section className="section about" id="about">
        <div className="container about-grid">
          <div className="about-art glass">
            <div className="about-logo">SV</div>
            <span className="about-caption">CREATIVITY IN EVERY FRAME</span>
            <div className="about-decoration" />
          </div>

          <div className="about-content">
            <div className="eyebrow">
              <Sparkles size={15} /> WHO WE ARE
            </div>
            <h2 className="section-title">
              NOT JUST EDITING.
              <br />
              <span className="gradient-text">IT'S AN ART.</span>
            </h2>
            <p>
              SHAURYA VISUALS is a creative video editing studio
              focused on transforming ideas into memorable
              visual stories. We believe every project deserves
              creativity, quality and attention.
            </p>

            <div className="feature-list">
              {features.map((item) => (
                <div key={item}>
                  <CheckCircle2 size={19} />
                  {item}
                </div>
              ))}
            </div>

            <a href={whatsapp} target="_blank" rel="noreferrer"
              className="outline-btn">
              Work With Us <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="container">
          <div className="eyebrow centered">
            <Sparkles size={15} /> WHAT WE DO
          </div>
          <h2 className="section-title">
            OUR <span className="gradient-text">SERVICES</span>
          </h2>
          <p className="section-subtitle">
            Creative solutions for every kind of visual story.
          </p>

          <div className="service-grid">
            {services.map((service, index) => (
              <div className="card service-card" key={service.title}>
                <div className="service-icon">{service.icon}</div>
                <span className="service-number">0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <a href={whatsapp} target="_blank" rel="noreferrer">
                  Get Started <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section portfolio" id="portfolio">
        <div className="container">
          <div className="eyebrow centered">
            <Sparkles size={15} /> OUR CREATIVE WORLD
          </div>
          <h2 className="section-title">
            SELECTED <span className="gradient-text">WORK</span>
          </h2>
          <p className="section-subtitle">
            A glimpse into our latest creative projects.
          </p>

          {portfolioLoading ? (
            <p className="portfolio-note">Loading creative projects...</p>
          ) : projects.length > 0 ? (
            <div className="portfolio-grid">
              {projects.map((project) => (
                <div className="portfolio-item" key={project.id}>
                  {project.media_type?.toLowerCase() === "video" ? (
                    <video
                      src={project.media_url}
                      controls
                      playsInline
                      preload="metadata"
                      style={{
                        width: "100%",
                        height: "260px",
                        objectFit: "cover",
                        display: "block",
                        background: "#111",
                      }}
                    />
                  ) : (
                    <img
                      src={project.media_url}
                      alt={project.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "260px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}

                  <div className="portfolio-info">
                    <span>
                      {(project.category || "CREATIVE PROJECT").toUpperCase()}
                    </span>
                    <h3>{project.title}</h3>
                    {project.description && <p>{project.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="portfolio-note">
              Our creative projects will appear here soon. Stay tuned!
            </p>
          )}
        </div>
      </section>

      <section className="section pricing" id="pricing">
        <div className="container pricing-box glass">
          <div>
            <div className="eyebrow">
              <Sparkles size={15} /> SIMPLE & FLEXIBLE
            </div>
            <h2 className="section-title">
              YOUR PROJECT.
              <br />
              <span className="gradient-text">YOUR PRICE.</span>
            </h2>
            <p>
              Every editing project is unique. Tell us what
              you need and get a personalized quotation.
            </p>
          </div>

          <div className="pricing-action">
            <span className="price-label">CUSTOM PROJECT PRICING</span>
            <h3>Let's Discuss</h3>
            <p>Get a quote based on your requirements.</p>
            <a href={whatsapp} target="_blank" rel="noreferrer"
              className="primary-btn">
              Get a Free Quote <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="section contact" id="contact">
        <div className="container contact-box">
          <div className="eyebrow centered">
            <Sparkles size={15} /> LET'S CREATE SOMETHING
          </div>
          <h2 className="section-title">
            HAVE A PROJECT
            <br />
            <span className="gradient-text">IN MIND?</span>
          </h2>
          <p className="section-subtitle">
            Your vision deserves to be seen. Let's bring it to life.
          </p>

          <a href={whatsapp} target="_blank" rel="noreferrer"
            className="primary-btn contact-btn">
            <MessageCircle size={19} />
            ORDER ON WHATSAPP
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a href="#" className="brand">
            <span className="brand-icon">SV</span>
            <span>
              SHAURYA
              <small>VISUALS</small>
            </span>
          </a>

          <p>© {new Date().getFullYear()} SHAURYA VISUALS. All rights reserved.</p>

          <div className="social-links">
            <a href={whatsapp} target="_blank" rel="noreferrer"
              aria-label="WhatsApp">
              <MessageCircle size={19} />
            </a>
            <a href="#contact" aria-label="Instagram">
              <Instagram size={19} />
            </a>
            <a href="#contact" aria-label="YouTube">
              <Youtube size={19} />
            </a>
          </div>
        </div>
      </footer>

      <a
        className="whatsapp-float"
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle size={25} />
      </a>
    </main>
  );
}
