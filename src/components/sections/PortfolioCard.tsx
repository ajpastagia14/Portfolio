'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, BarChart3 } from 'lucide-react'

type Props = {
  title: string
  description: string
  index: number
  image?: string
  tech: string
  skills: string[]
  repoUrl?: string
}

export default function PortfolioCard({
  title,
  description,
  index,
  image,
  tech,
  skills,
  repoUrl,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: 0.75,
        delay: index * 0.06,
      }}
      whileHover={{ y: -4 }}
      className="group relative rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl flex flex-col min-h-[340px]"
    >
      <div className="w-full h-32 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#14213d]/60 to-[#0b1120] mb-4 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <BarChart3 size={30} className="text-teal-400/50" />
        )}
      </div>

      <h3 className="text-[16px] font-semibold mb-2 leading-tight">
        {title}
      </h3>

      <p className="text-[13px] text-white/60 leading-relaxed mb-3">
        {description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-2">
        {skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="text-[10px] px-2 py-1 rounded-full border border-white/10 bg-white/[0.04] text-white/55"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="text-[11px] text-teal-400/80 mb-1">{tech}</p>

      <div className="mt-auto pt-4 flex items-center justify-between">
        {repoUrl ? (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] text-white/70 hover:text-white transition-all"
          >
            View Repository
            <ArrowUpRight size={14} />
          </a>
        ) : (
          <div className="text-[13px] text-white/35">No Link</div>
        )}
      </div>
    </motion.div>
  )
}
