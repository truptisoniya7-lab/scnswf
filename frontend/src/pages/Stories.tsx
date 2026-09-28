import { Link } from "react-router-dom"
import { BookOpen, Calendar, ArrowRight, ShieldCheck, Heart } from "lucide-react"
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder"

const STORIES = [
  {
    id: "s1",
    title: "Caring for Aging Parents: Preserving Dignity, Mobility, and Compassion",
    tag: "Geriatric Healthcare",
    color: "#1b6b68",
    bg: "#edfafa",
    image: "/images/stories/geriatric-care-parents.jpg",
    date: "April 2026",
    author: "SCNSWF / HOMSO Home Healthcare Initiative",
    summary:
      "We often think doing everything for our elderly parents is love — but helping them maintain independent mobility, dignity, and active daily agency is what truly supports their health and spirit.",
    highlights: [
      "Encouraging safe independent movement rather than excessive restriction",
      "Regular vitals monitoring and chronic condition management at home",
      "Emotional companionship and attentive listening for mental wellness",
    ],
  },
  {
    id: "s2",
    title: "Preventive Care: Tackling Chronic Body Pain with Early Intervention",
    tag: "Preventive Health",
    color: "#c94a2e",
    bg: "#fde8e0",
    image: "/images/healthcare/body-pain-causes-cures.jpg",
    date: "April 2026",
    author: "Dr. Pragyan Routray · SCNSWF Health Advisory",
    summary:
      "Most people ignore neck stiffness and lower back pain until it controls their daily routine. Understanding ergonomic triggers, daily stretching, and early clinical guidance prevents irreversible joint damage.",
    highlights: [
      "Correcting daily sedentary posture and workspace alignment",
      "Identifying non-inflammatory vs. strain-induced symptoms early",
      "Integrating restorative physical movement into daily routines",
    ],
  },
  {
    id: "s3",
    title: "Child Health Habits: How Simple Handwashing Saves Lives",
    tag: "Child Health & Hygiene",
    color: "#d97706",
    bg: "#fffbeb",
    image: "/images/education/child-health-handwashing.jpg",
    date: "October 2025",
    author: "SCNSWF Public Health Awareness Team",
    summary:
      "Healthy habits start young. Teaching children proper 6-step handwashing with clean water and soap prevents waterborne pathogens and keeps classrooms healthy and active throughout the year.",
    highlights: [
      "Demonstrating thorough hand cleaning before meals and after play",
      "Distributing child-friendly hygiene educational charts in rural schools",
      "Empowering young ambassadors to promote hygiene within their households",
    ],
  },
  {
    id: "s4",
    title: "Together Rising: Fostering Sustainable Menstrual Hygiene & Campus Health",
    tag: "Women's Health & Green Living",
    color: "#134a48",
    bg: "#edfafa",
    image: "/images/hero/together-rising-womens-health.jpg",
    date: "August 2025",
    author: "SCNSWF Women's Wellness & Campus Initiative",
    summary:
      "Promoting choices that are healthier for women and greener for our planet. Reaching university campuses and communities with reusable hygiene essentials, youth ambassador training, and open dialogues on reproductive health.",
    highlights: [
      "Distributing reusable, chemical-free sanitary essentials in educational institutions",
      "Training student peer leaders as sustainable health ambassadors",
      "Reducing single-use sanitary waste while ensuring safe, dignified protection",
    ],
  },
]

export default function Stories() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden"
        style={{ background: "linear-gradient(155deg, #0a1f1e 0%, #134a48 50%, #1b6b68 90%)" }}
      >
        <div className="container-custom relative z-10 text-white">
          <span
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold mb-4 px-3.5 py-1.5 rounded-full border"
            style={{
              background: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.18)",
              color: "#9de4e3",
            }}
          >
            <BookOpen size={14} className="text-amber-300" />
            <span>Field Insights & Health Education</span>
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Stories & <span className="text-gradient">Health Insights</span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl text-teal-100 font-normal leading-relaxed">
            Real publications, clinical guidance, and community initiatives published by Suresh Chandra Nayak Social Welfare Foundation.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 36L1440 36L1440 8C1200 32 800 0 480 18C240 32 0 8 0 8L0 36Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── Stories List ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          <div className="space-y-12 max-w-5xl mx-auto">
            {STORIES.map((story, i) => (
              <article
                key={story.id}
                className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 items-center"
              >
                <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
                    <ImagePlaceholder
                      src={story.image}
                      alt={story.title}
                      aspect="4/3"
                      className="w-full"
                      objectFit="cover"
                    />
                  </div>
                </div>

                <div className={`lg:col-span-7 p-2 sm:p-4 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                    <span
                      className="font-bold px-3 py-1 rounded-full border"
                      style={{ background: story.bg, color: story.color, borderColor: `${story.color}33` }}
                    >
                      {story.tag}
                    </span>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Calendar size={13} /> {story.date}
                    </span>
                  </div>

                  <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-2 leading-snug">
                    {story.title}
                  </h2>

                  <p className="text-xs font-semibold text-teal-800 mb-3">
                    {story.author}
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {story.summary}
                  </p>

                  <ul className="space-y-1.5 text-xs text-slate-700 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {story.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-teal-600 font-bold shrink-0 mt-0.5">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-4">
                    <Link
                      to="/gallery"
                      className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                    >
                      <span>View in Media Gallery</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Verification Box */}
          <div className="mt-16 max-w-3xl mx-auto p-6 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-center">
            <ShieldCheck size={28} className="text-teal-700 mx-auto mb-2" />
            <h3 className="font-display font-bold text-base text-teal-950 mb-1">
              Documented & Authentic Publications
            </h3>
            <p className="text-xs text-teal-800 leading-relaxed max-w-xl mx-auto mb-4">
              All stories and health insights are derived from official educational posters and clinical advisories published by SCNSWF on LinkedIn.
            </p>
            <Link to="/donate" className="btn btn-accent inline-flex items-center gap-2 text-xs">
              <Heart size={14} fill="currentColor" /> Support Rural Healthcare
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
