"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Code, Layers, Globe, FileText, ArrowUpRight } from "lucide-react";

/* ================== ANIMATION ================== */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 35, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: 70, rotate: 2 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 25 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ================== STATIC STATS ================== */
/* Hardcoded for now — swap for a live Supabase count later if needed. */
const stats = [
  {
    icon: <Code size={16} />,
    value: "4",
    title: "FEATURED PROJECTS",
  },
  {
    icon: <Layers size={16} />,
    value: "6",
    title: "SKILL CATEGORIES",
  },
  {
    icon: <Globe size={16} />,
    value: "4",
    title: "FOCUS INDUSTRIES",
  },
];

/* ================== COMPONENT ================== */

export default function About() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollToPortfolio = () => {
    const el = document.getElementById("portfolio");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isMobile === null) return null;

  return (
    <section
      id="about"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        padding: isMobile ? "60px 24px 30px" : "80px 60px 30px 120px",
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
          }}
        >
          {/* LEFT */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-80px" }}
            style={{
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <motion.div variants={fadeUp} style={{ marginBottom: 16 }}>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  letterSpacing: "0.2em",
                }}
              >
                ABOUT ME
              </span>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div
                style={{
                  fontSize: isMobile ? 32 : "clamp(32px,5vw,46px)",
                  fontWeight: 800,
                  lineHeight: 1.03,
                  color: "var(--text-primary)",
                }}
              >
                <div>Akshar</div>
                <div>Pastagia</div>
              </div>
            </motion.div>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 1.1,
                    delay: 0.2,
                  },
                },
              }}
              style={{
                marginTop: 18,
                fontSize: 14,
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                maxWidth: isMobile ? "100%" : "490px",
              }}
            >
              I am a Toronto-based analyst with an educational background in
              Computer Science and Business Information Technology. My
              experience combines data analysis, financial reporting,
              operational analysis, budget support, forecasting,
              reconciliation, and dashboard development.
              <br />
              <br />
              I enjoy looking beyond headline numbers to understand the
              drivers behind performance. My approach combines technical
              problem-solving with business awareness, allowing me to
              identify trends, investigate discrepancies, and translate
              complex information into insights that stakeholders can
              understand and use.
              <br />
              <br />
              I am currently exploring opportunities as a Data Analyst,
              Business Analyst, Financial Analyst, Reporting Analyst, or
              Business Intelligence Analyst — particularly within banking,
              financial services, consulting, retail, and technology. I am
              open to relocating across Canada.
            </motion.p>

            {/* QUOTE */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.94 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.9,
                    delay: 0.3,
                  },
                },
              }}
              style={{
                marginTop: 18,
                padding: "12px 25px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                fontSize: 12,
                fontStyle: "italic",
                display: "inline-block",
                width: "fit-content",
              }}
            >
              &ldquo;Turning complex data into clear insights, practical
              solutions, and confident business decisions.&rdquo;
            </motion.div>

            {/* BUTTONS */}
            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                gap: 10,
                marginTop: 18,
                flexWrap: "wrap",
              }}
            >
              {/* DOWNLOAD RESUME */}
              <a
                href="/Akshar_Pastagia_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: "1px solid white",
                    background: "white",
                    color: "black",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "transform 0.25s ease, opacity 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-2px) scale(1.03)";
                    e.currentTarget.style.opacity = "0.92";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  <FileText size={14} />
                  Download Résumé
                </button>
              </a>

              {/* VIEW PROJECTS */}
              <button
                onClick={scrollToPortfolio}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "1px solid white",
                  background: "transparent",
                  color: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "transform 0.25s ease, opacity 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.03)";
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <ArrowUpRight size={14} />
                View Projects
              </button>
            </motion.div>
          </motion.div>

          {/* IMAGE */}
          {!isMobile && (
            <motion.div
              variants={slideLeft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false }}
              style={{
                width: "48%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  padding: 12,
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  transform: "translateX(-80px)",
                }}
              >
                <img
                  src="/assets/akshar-pastagia-profile.png"
                  alt="Akshar Pastagia"
                  style={{
                    width: 240,
                    height: 240,
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* CARDS */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 18,
            marginTop: 36,
          }}
        >
          {stats.map((item, i) => (
            <motion.div
              key={i}
              variants={pop}
              whileHover={{ scale: 1.03 }}
              style={{
                position: "relative",
                padding: 18,
                borderRadius: 16,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {item.value}
              </div>

              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.08em",
                }}
              >
                {item.title}
              </div>

              <div
                onClick={scrollToPortfolio}
                style={{
                  position: "absolute",
                  bottom: 14,
                  right: 14,
                  cursor: "pointer",
                }}
              >
                <ArrowUpRight size={15} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
