import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder"
import {
  Camera, Filter, X, ChevronLeft, ChevronRight,
  ExternalLink, Calendar, ShieldCheck, ZoomIn
} from "lucide-react"

interface GalleryItem {
  id: string
  title: string
  category: "all" | "healthcare" | "education" | "livelihood" | "events" | "community"
  categoryLabel: string
  src?: string
  alt?: string
  neededLabel?: string
  description: string
  date?: string
  source?: string
  linkedinUrl?: string
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Child Health & Hand Hygiene Education Guide",
    category: "education",
    categoryLabel: "Education & Hygiene",
    src: "/images/gallery/child-health-handwashing.jpg",
    alt: "SCNSWF official Child Health & Hand Hygiene Education Guide",
    description: "Official SCNSWF educational guide promoting proper handwashing habits among children to instill lifelong hygiene and curb infectious diseases.",
    date: "October 2025",
    source: "LinkedIn Post · Child Health & Hygiene",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g2",
    title: "Global Handwashing Day Awareness",
    category: "education",
    categoryLabel: "Education & Hygiene",
    src: "/images/gallery/global-handwashing-day.jpg",
    alt: "SCNSWF Global Handwashing Day Awareness Campaign",
    description: "'Clean hands, healthy lives!' Community and school-focused awareness campaign emphasizing daily hand hygiene as a first line of health defense.",
    date: "October 2025",
    source: "LinkedIn Post · Global Handwashing Day",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g3",
    title: "Polio Eradication & Immunization Drive",
    category: "healthcare",
    categoryLabel: "Healthcare",
    src: "/images/gallery/polio-free-india-awareness.jpg",
    alt: "SCNSWF Polio Eradication and Routine Immunization Campaign in Odisha",
    description: "Grassroots public health mobilization reminding families to sustain routine vaccination drops to keep children and communities polio-free.",
    date: "October 2025",
    source: "LinkedIn Post · Polio Free India",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g4",
    title: "World Polio Day Public Health Campaign",
    category: "healthcare",
    categoryLabel: "Healthcare",
    src: "/images/gallery/world-polio-day.jpg",
    alt: "SCNSWF World Polio Day Public Health Poster",
    description: "'A few drops. A lifetime of strength.' Public health awareness emphasizing that two drops of prevention protect a child's future mobility.",
    date: "October 2025",
    source: "LinkedIn Post · World Polio Day",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g5",
    title: "Geriatric & Parent Care Clinical Guidance",
    category: "healthcare",
    categoryLabel: "Healthcare",
    src: "/images/gallery/geriatric-care-parents.jpg",
    alt: "SCNSWF / HOMSO Geriatric and Parental Care Clinical Guidance",
    description: "Specialized clinical and emotional guidance by SCNSWF/HOMSO on caring for aging parents while preserving their mobility, autonomy, and dignity.",
    date: "April 2026",
    source: "SCNSWF / HOMSO Clinical Insights",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g6",
    title: "Preventive Care: Posture & Body Pain Management",
    category: "healthcare",
    categoryLabel: "Healthcare",
    src: "/images/gallery/body-pain-causes-cures.jpg",
    alt: "SCNSWF / HOMSO Body Pain Cause & Cure Health Guide by Dr. Pragyan Routray",
    description: "Health education session by Dr. Pragyan Routray on early symptom identification, ergonomic posture correction, and non-invasive daily care.",
    date: "April 2026",
    source: "SCNSWF / HOMSO Health Guide",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g7",
    title: "Diwali Community Health & Hospital Safety",
    category: "events",
    categoryLabel: "Events",
    src: "/images/gallery/diwali-community-safety.jpg",
    alt: "SCNSWF Diwali Community Health and Hospital Safety Tips",
    description: "Public safety initiative ('Let's light up hearts, not hospitals') raising awareness on burn prevention, respiratory safety, and safe festivities.",
    date: "October 2025",
    source: "SCNSWF Community Safety Guide",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g8",
    title: "Community Festival & Goodwill Outreach",
    category: "community",
    categoryLabel: "Community / About",
    src: "/images/gallery/diwali-celebration-greeting.jpg",
    alt: "SCNSWF Community Festive Greeting and Compassion Outreach",
    description: "Annual festive outreach emphasizing kindness, food sharing, and extending support to marginalized community members during celebrations.",
    date: "October 2025",
    source: "SCNSWF Community Goodwill",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g9",
    title: "Raja Parba Celebration & Community Wellness",
    category: "community",
    categoryLabel: "Community / About",
    src: "/images/gallery/raja-parba-homso.jpg",
    alt: "SCNSWF / HOMSO Raja Parba Festival and Community Wellness Celebration",
    description: "Celebrating Odisha's cultural heritage, womanhood, and natural cycles of life alongside HOMSO home health and community wellness initiatives.",
    date: "June 2026",
    source: "SCNSWF / HOMSO Cultural Outreach",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g10",
    title: "Official SCNSWF Emblem & Registration",
    category: "community",
    categoryLabel: "Community / About",
    src: "/images/gallery/scnswf-logo.png",
    alt: "Official Suresh Chandra Nayak Social Welfare Foundation Logo",
    description: "Official emblem of Suresh Chandra Nayak Social Welfare Foundation (SCNSWF), registered non-profit organization based in Bhubaneswar, Odisha.",
    date: "Official Registry",
    source: "SCNSWF Official Profile Emblem",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g11",
    title: "Free Skin Healthcare Camp at Ramakrusna Balashram",
    category: "events",
    categoryLabel: "Health Camps & Events",
    src: "/images/gallery/free-skin-health-camp-balashram.jpg",
    alt: "Free Skin Healthcare camp at Ramakrusna Balashram in collaboration with IADVL and HOMSO",
    description: "Official collaborative free skin healthcare screening camp organized at Ramakrusna Balashram with the Indian Association of Dermatologists, Venereologists and Leprologists (IADVL) and HOMSO. Features pediatric and youth check-ups, clinical hygiene guidance, and medicine distribution.",
    date: "July 2025",
    source: "Field Camp Collaboration · IADVL & HOMSO",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g12",
    title: "Project Care: Health & Hygiene Field Team",
    category: "community",
    categoryLabel: "Community & Team",
    src: "/images/gallery/project-care-health-hygiene-team.jpg",
    alt: "SCNSWF Project Care health and hygiene team and facilitators",
    description: "Session on Project Care (Campus & Reusable Essentials) - Care for Health & Hygiene Project. Foundation leadership, visiting clinical advisors, and community health facilitators during field planning and coordination sessions.",
    date: "August 2025",
    source: "SCNSWF Foundation Archives · Project Care",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g13",
    title: "Women's Health & Hygiene Seminar (Centurion University)",
    category: "education",
    categoryLabel: "Education & Hygiene",
    src: "/images/gallery/womens-health-hygiene-centurion-auditorium.jpg",
    alt: "Promoting Women's Health, Hygiene and Sustainable Living seminar at Centurion University auditorium",
    description: "Large-scale interactive auditorium session on 'Promoting Women's Health, Hygiene & Sustainable Living' conducted for students at Centurion University, raising awareness on reproductive hygiene, wellness, and eco-friendly practices.",
    date: "Campus Health Session",
    source: "Centurion University & SCNSWF Initiative",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g14",
    title: "Saukhyam Reusable Pads Campus Outreach",
    category: "livelihood",
    categoryLabel: "Sustainable Health & Livelihood",
    src: "/images/gallery/saukhyam-pads-campus-outreach.jpg",
    alt: "SCNSWF Saukhyam reusable sanitary pads outreach reached KIIT, AIIMS Bhubaneswar, Centurion, and Gita College",
    description: "Distribution and education drive for Saukhyam Reusable Pads reaching KIIT, AIIMS Bhubaneswar, Centurion, and Gita College. Promoting menstrual health, reducing plastic waste, and advancing community sustainable living.",
    date: "Institutional Campaign",
    source: "SCNSWF & Saukhyam Reusable Essentials",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
  {
    id: "g15",
    title: "Together Rising: Women's Health & Green Living",
    category: "community",
    categoryLabel: "Women Empowerment",
    src: "/images/gallery/together-rising-womens-health.jpg",
    alt: "Together Rising campaign promoting a choice that is healthier for women and greener for our planet",
    description: "'Together Rising - Promoting a choice that is healthier for women and greener for our planet.' Felicitation of student coordinators, distribution of educational booklets, and student volunteer brigade in Odisha.",
    date: "Community Health Initiative",
    source: "SCNSWF Together Rising Project",
    linkedinUrl: "https://www.linkedin.com/company/scnswf/",
  },
]

export default function Gallery() {
  const [filter, setFilter] = useState<string>("all")
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)

  // Filter items
  const filteredItems = filter === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === filter)

  // Filter only items with images for the Lightbox
  const lightboxItems = filteredItems.filter((item) => Boolean(item.src))

  const activeItem = activeItemIndex !== null ? lightboxItems[activeItemIndex] : null

  // Lightbox navigation handlers
  const handleOpenLightbox = (item: GalleryItem) => {
    if (!item.src) return
    const idx = lightboxItems.findIndex((it) => it.id === item.id)
    if (idx !== -1) setActiveItemIndex(idx)
  }

  const handleCloseLightbox = useCallback(() => {
    setActiveItemIndex(null)
  }, [])

  const handleNext = useCallback(() => {
    if (activeItemIndex === null) return
    setActiveItemIndex((prev) => (prev! + 1) % lightboxItems.length)
  }, [activeItemIndex, lightboxItems.length])

  const handlePrev = useCallback(() => {
    if (activeItemIndex === null) return
    setActiveItemIndex((prev) => (prev! - 1 + lightboxItems.length) % lightboxItems.length)
  }, [activeItemIndex, lightboxItems.length])

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeItemIndex === null) return
      if (e.key === "Escape") handleCloseLightbox()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeItemIndex, handleCloseLightbox, handleNext, handlePrev])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (activeItemIndex !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [activeItemIndex])

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
            <Camera size={14} className="text-amber-300" />
            <span>Documented Activities & Campaigns</span>
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Visual <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl text-teal-100 font-normal leading-relaxed">
            Authentic public health education materials, community campaigns, and awareness posters published by Suresh Chandra Nayak Social Welfare Foundation (SCNSWF).
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 36L1440 36L1440 8C1200 32 800 0 480 18C240 32 0 8 0 8L0 36Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── Gallery Content ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          {/* Filters & Verification Notice */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Filter size={14} className="text-teal-700" /> Filter by Category:
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: `All Works (${GALLERY_ITEMS.length})` },
                { id: "healthcare", label: "Healthcare" },
                { id: "education", label: "Education" },
                { id: "community", label: "Community / About" },
                { id: "events", label: "Events" },
                { id: "livelihood", label: "Livelihood" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filter === tab.id
                      ? "bg-teal-700 text-white shadow-sm ring-2 ring-teal-700/20"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image area with zoom hover & click to open */}
                  <div
                    className={`relative bg-slate-50 p-2.5 overflow-hidden ${item.src ? "cursor-pointer" : ""}`}
                    onClick={() => item.src && handleOpenLightbox(item)}
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      <ImagePlaceholder
                        src={item.src}
                        alt={item.alt}
                        label={item.neededLabel}
                        aspect="4/3"
                        className="w-full bg-slate-100 transition-transform duration-500 group-hover:scale-105"
                        objectFit="cover"
                      />
                      {item.src && (
                        <div className="absolute inset-0 bg-teal-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-teal-900 text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <ZoomIn size={14} className="text-teal-700" /> View Fullscreen
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2.5">
                        <span className="font-bold text-teal-800 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-100">
                          {item.categoryLabel}
                        </span>
                        {item.date && (
                          <span className="text-slate-400 font-medium flex items-center gap-1">
                            <Calendar size={12} /> {item.date}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-base text-slate-900 mb-2 leading-snug group-hover:text-teal-800 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      {item.src ? (
                        <button
                          onClick={() => handleOpenLightbox(item)}
                          className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
                        >
                          <ShieldCheck size={14} className="text-teal-600" />
                          <span>Official SCNSWF Media</span>
                        </button>
                      ) : (
                        <span className="text-amber-700 font-medium text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Field Photo Pending
                        </span>
                      )}

                      {item.linkedinUrl && (
                        <a
                          href={item.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-teal-700 transition-colors"
                          title="View on Official LinkedIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Fullscreen Lightbox Modal ── */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md"
            onClick={handleCloseLightbox}
          >
            <div
              className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/80">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs font-bold text-teal-800 px-3 py-1 rounded-full bg-teal-100/70">
                    {activeItem.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeItemIndex! + 1} of {lightboxItems.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeItem.linkedinUrl && (
                    <a
                      href={activeItem.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors flex items-center gap-1 text-xs font-semibold"
                      title="View Official LinkedIn"
                    >
                      <ExternalLink size={16} />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </a>
                  )}
                  <button
                    onClick={handleCloseLightbox}
                    className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body: Image Display */}
              <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[460px]">
                <img
                  src={activeItem.src}
                  alt={activeItem.alt}
                  className="max-h-[60vh] max-w-full object-contain select-none"
                />

                {/* Left / Right Navigation Buttons */}
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm flex items-center justify-center transition-all shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm flex items-center justify-center transition-all shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Modal Footer / Context Panel */}
              <div className="p-5 sm:p-6 bg-white overflow-y-auto">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                      {activeItem.title}
                    </h2>
                    {activeItem.source && (
                      <p className="text-xs font-semibold text-teal-700 mt-0.5">
                        {activeItem.source}
                      </p>
                    )}
                  </div>
                  {activeItem.date && (
                    <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1">
                      <Calendar size={13} /> {activeItem.date}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  {activeItem.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
