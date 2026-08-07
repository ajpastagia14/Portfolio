'use client'

import { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Send, User, Mail, MessageSquare, ArrowUpRight } from 'lucide-react'
import { FaLinkedinIn, FaGithub } from 'react-icons/fa'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fieldVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
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

const socialLinks = [
  {
    title: 'LinkedIn',
    user: 'akshar-pastagia',
    icon: FaLinkedinIn,
    link: 'https://www.linkedin.com/in/akshar-pastagia-228203269/',
  },
  {
    title: 'GitHub',
    user: 'ajpastagia14',
    icon: FaGithub,
    link: 'https://github.com/ajpastagia14',
  },
]

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSend = () => {
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'a visitor'}`)
    const body = encodeURIComponent(
      `${message}\n\n— ${name || ''}${email ? ` (${email})` : ''}`
    )

    window.location.href = `mailto:aksharpastagia007@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: smoothEase }}
      viewport={{ once: false, amount: 0.2 }}
      className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 md:p-8 flex flex-col h-full"
    >
      {/* HEADER */}
      <motion.div
        variants={fieldVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        transition={{ delay: 0.05 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Send a Message
        </h2>

        <p className="text-sm text-white/50 mb-7">
          I am always interested in discussing analytical projects,
          professional opportunities, and new ideas. If you are looking for
          someone who can connect data with business context and communicate
          insights clearly, feel free to reach out.
        </p>
      </motion.div>

      {/* FORM */}
      <div className="space-y-4">
        {/* NAME */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full rounded-2xl border border-white/15 bg-black/20 pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
            />
          </div>
        </motion.div>

        {/* EMAIL */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.16 }}
        >
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              type="email"
              className="w-full rounded-2xl border border-white/15 bg-black/20 pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
            />
          </div>
        </motion.div>

        {/* MESSAGE */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.22 }}
        >
          <div className="relative">
            <MessageSquare className="absolute left-4 top-5 text-white/40" />

            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              className="w-full rounded-2xl border border-white/15 bg-black/20 pl-12 pr-4 py-4 outline-none resize-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
            />
          </div>
        </motion.div>

        {/* BUTTON */}
        <motion.button
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.28 }}
          whileHover={{
            scale: 1.06,
            transition: { duration: 0.12 },
          }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSend}
          disabled={!message.trim()}
          className="w-full rounded-2xl py-4 bg-teal-400/10 border border-teal-400/30 text-teal-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          Send Message
        </motion.button>
      </div>

      {/* SOCIAL */}
      <div className="border-t border-white/10 pt-5 mt-6">
        <motion.p
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.34 }}
          className="text-sm text-white/55 mb-4"
        >
          Connect With Me
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {socialLinks.map((item, i) => {
            const Icon = item.icon

            return (
              <motion.a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={fieldVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false }}
                transition={{
                  delay: 0.38 + i * 0.05,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.12 },
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 flex items-center justify-between"
              >
                <div className="absolute inset-0 bg-white/[0.04] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out" />

                <div className="relative z-10 flex items-center gap-3">
                  <Icon />

                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-white/35">{item.user}</p>
                  </div>
                </div>

                <div className="relative z-10 opacity-0 group-hover:opacity-100 transition">
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
