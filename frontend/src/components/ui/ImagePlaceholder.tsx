import { useState } from "react"
import { Camera } from "lucide-react"

interface ImagePlaceholderProps {
  src?: string
  alt?: string
  label?: string
  aspect?: string
  className?: string
  height?: string | number
  objectFit?: "cover" | "contain"
}

/**
 * Renders an authentic organization image when available, or a clearly marked
 * placeholder signalling exactly what authentic SCNSWF photograph is required.
 */
export function ImagePlaceholder({
  src,
  alt = "SCNSWF activity image",
  label = "Official Field Photograph Needed",
  aspect,
  className = "",
  height,
  objectFit = "cover",
}: ImagePlaceholderProps) {
  const [hasError, setHasError] = useState(false)

  const containerStyle: React.CSSProperties = {
    aspectRatio: aspect ?? undefined,
    height: height ?? undefined,
    position: "relative",
    overflow: "hidden",
  }

  // If a real image source is provided and hasn't errored
  if (src && !hasError) {
    return (
      <div className={`rounded-2xl ${className}`} style={containerStyle}>
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full"
          style={{ objectFit }}
          loading="lazy"
        />
      </div>
    )
  }

  // Authentic placeholder (No AI images per instruction 5)
  return (
    <div
      className={`rounded-2xl border border-teal-200/60 flex flex-col items-center justify-center p-6 text-center ${className}`}
      style={{
        ...containerStyle,
        background: "linear-gradient(135deg, #f0fdfa 0%, #e6fffa 50%, #f0fdfa 100%)",
      }}
    >
      {/* Pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.15 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dot-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#1b6b68" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
      </svg>

      <div className="relative z-10 flex flex-col items-center gap-2 max-w-xs">
        <div className="w-10 h-10 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center">
          <Camera size={20} />
        </div>
        <span className="text-xs font-bold text-teal-900 bg-white/80 border border-teal-200/80 px-3 py-1 rounded-full shadow-sm">
          {label}
        </span>
        <span className="text-[11px] text-teal-700/80 leading-tight">
          Awaiting authentic SCNSWF field photography · No AI replacements permitted
        </span>
      </div>
    </div>
  )
}

/**
 * Amber disclaimer banner for sections containing placeholder statistics.
 * Required by PRD: "No invented statistics ... placeholders are clearly marked."
 */
export function PlaceholderBanner({ message }: { message?: string }) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm mb-6 border"
      style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}
    >
      <span className="text-base shrink-0">⚠️</span>
      <span className="leading-relaxed">
        {message ??
          "Statistics on this page are estimated placeholders. Verified figures will be published by SCNSWF before launch."}
      </span>
    </div>
  )
}
