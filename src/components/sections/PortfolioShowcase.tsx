'use client'

import { motion, AnimatePresence } from 'framer-motion'
import PortfolioCard from './PortfolioCard'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Hardcoded for now — the card/hook plumbing (usePortfolio + Supabase)
 * still exists in src/hooks and src/lib and can be wired back in later
 * without touching this component's layout.
 */
const projects = [
  {
    id: 'fraud-analytics',
    title: 'Fraud Transaction Analytics and Risk Reporting',
    description:
      'Analyzed 7,000+ transaction records to examine fraudulent vs. non-fraudulent behaviour. Compared Logistic Regression and Random Forest classifiers, identifying transaction velocity and distance-from-home as leading fraud indicators, then translated findings into monitoring recommendations.',
    skills: [
      'Transaction analysis',
      'Fraud-pattern identification',
      'Classification modelling',
      'Model comparison',
      'Risk reporting',
    ],
    tech: 'Python · Pandas · Scikit-learn · SQL · Power BI · Tableau',
    repoUrl: 'https://github.com/ajpastagia14',
  },
  {
    id: 'pharmacy-forecasting',
    title: 'Pharmacy Revenue Forecasting',
    description:
      'Built a revenue forecasting model for a pharmacy product line through its next tax cycle — organizing historical data, examining revenue patterns, and evaluating business drivers to support client planning and performance discussions.',
    skills: [
      'Revenue forecasting',
      'Trend analysis',
      'Financial modelling',
      'Business planning',
    ],
    tech: 'Microsoft Excel · Tableau',
    repoUrl: 'https://github.com/ajpastagia14',
  },
  {
    id: 'retail-dashboard',
    title: 'Retail Performance and Customer Insights Dashboard',
    description:
      'Created an interactive BI dashboard analyzing customer purchasing behaviour, pricing trends, and retail performance — using SQL for data prep and Power BI to surface KPIs supporting pricing and business-planning decisions.',
    skills: [
      'Customer analysis',
      'SQL data preparation',
      'KPI development',
      'Dashboard design',
    ],
    tech: 'SQL · Power BI · Microsoft Excel',
    repoUrl: 'https://github.com/ajpastagia14',
  },
  {
    id: 'kpi-reconciliation',
    title: 'Operational KPI Reporting and Data Reconciliation',
    description:
      'Consolidated operational data from multiple reporting sources into structured KPI reporting — reconciling data, investigating inconsistencies, validating accuracy, and presenting trends to support leadership planning.',
    skills: [
      'KPI reporting',
      'Data reconciliation',
      'Data-quality validation',
      'Trend analysis',
    ],
    tech: 'SAP · Microsoft Excel · Power BI',
    repoUrl: 'https://github.com/ajpastagia14',
  },
]

export default function PortfolioShowcase() {
  return (
    <section
      id="portfolio"
      className="w-full max-w-[1450px] mx-auto px-8 md:px-12 lg:px-20 pt-24 pb-24 text-white"
    >
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Selected Analytics Projects
        </h1>

        <p className="text-white/55 max-w-2xl mx-auto text-sm md:text-base">
          A collection of projects demonstrating my approach to financial
          analysis, business intelligence, forecasting, risk analytics, and
          data-driven decision-making.
        </p>
      </motion.div>

      <motion.div
        layout
        transition={{ layout: { duration: 0.75, ease: smoothEase } }}
        className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-1"
      >
        <AnimatePresence mode="popLayout">
          {projects.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.55, delay: i * 0.04, ease: smoothEase }}
            >
              <PortfolioCard
                index={i}
                title={item.title}
                description={item.description}
                skills={item.skills}
                tech={item.tech}
                repoUrl={item.repoUrl}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
