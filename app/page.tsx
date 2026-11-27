
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

          <a href={whatsapp} target="_blank" rel="noreferrer"
            className="primary-btn nav-cta">
            Let's Talk <ArrowRight size={17} />
          </a>

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
                <span className="service-number">
                  0{index + 1}
                </span>
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
            A glimpse into the creative possibilities.
          </p>

          <div className="portfolio-grid">
            <div className="portfolio-item portfolio-one">
              <div className="portfolio-art">CINEMATIC</div>
              <div className="portfolio-info">
                <span>01 / VIDEO</span>
                <h3>Cinematic Stories</h3>
              </div>
            </div>

            <div className="portfolio-item portfolio-two">
              <div className="portfolio-art">REELS</div>
              <div className="portfolio-info">
                <span>02 / SOCIAL MEDIA</span>
                <h3>Social Media Edits</h3>
              </div>
            </div>

            <div className="portfolio-item portfolio-three">
              <div className="portfolio-art">BRAND</div>
              <div className="portfolio-info">
                <span>03 / PROMOTIONAL</span>
                <h3>Brand Visuals</h3>
              </div>
            </div>
          </div>

          <p className="portfolio-note">
            Portfolio previews will be replaced with actual
            editing projects through the Admin Dashboard.
          </p>
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
