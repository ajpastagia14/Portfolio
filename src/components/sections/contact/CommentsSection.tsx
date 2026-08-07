'use client'

import { motion, Variants } from 'framer-motion'
import { Mail, Phone, MapPin, CalendarCheck, ArrowUpRight } from 'lucide-react'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
}

const details = [
  {
    icon: Mail,
    label: 'Email',
    value: 'aksharpastagia007@gmail.com',
    href: 'mailto:aksharpastagia007@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (437) 225-3643',
    href: 'tel:+14372253643',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Toronto, Ontario, Canada',
  },
  {
    icon: CalendarCheck,
    label: 'Availability',
    value: 'Open to analyst opportunities and relocation across Canada',
  },
]

export default function CommentsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        ease: smoothEase,
      }}
      viewport={{ once: false, amount: 0.2 }}
      className="rounded-[28px] md:rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-xl p-5 md:p-8 h-full flex flex-col"
    >
      {/* HEADER */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-semibold mb-1">
          Contact Information
        </h3>

        <p className="text-xs md:text-sm text-white/40">
          I am always interested in discussing analytical projects,
          professional opportunities, and new ideas.
        </p>
      </div>

      {/* DETAILS */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        className="space-y-3"
      >
        {details.map((item) => {
          const Icon = item.icon
          const content = (
            <>
              <div className="w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-teal-300" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-white/40 mb-0.5">
                  {item.label}
                </p>
                <p className="text-sm text-white/80 break-words">
                  {item.value}
                </p>
              </div>

              {item.href && (
                <ArrowUpRight
                  size={14}
                  className="text-white/30 group-hover:text-white/70 transition shrink-0"
                />
              )}
            </>
          )

          return item.href ? (
            <motion.a
              key={item.label}
              variants={itemVariants}
              href={item.href}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 hover:border-teal-400/30 transition-colors"
            >
              {content}
            </motion.a>
          ) : (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              {content}
            </motion.div>
          )
        })}
      </motion.div>

      {/* NOTE */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        className="mt-auto pt-6"
      >
        <p className="text-[13px] text-white/50 leading-relaxed border-t border-white/10 pt-5">
          If you are looking for someone who can connect data with business
          context and communicate insights clearly, feel free to get in
          touch — I typically respond within a day or two.
        </p>
      </motion.div>
    </motion.div>
  )
}
