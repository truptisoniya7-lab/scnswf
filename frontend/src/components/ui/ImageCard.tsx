import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react'
import Badge from './Badge'

export interface ImageCardProps {
  src: string
  alt: string
  title: string
  description?: string
  badge?: string
  badgeVariant?: 'medical' | 'accent' | 'neutral'
  date?: string
  location?: string
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide'
  to?: string
  href?: string
  overlay?: boolean
  className?: string
  footer?: React.ReactNode
}

const aspectRatios = {
  video: 'aspect-video',     // 16:9
  square: 'aspect-square',   // 1:1
  portrait: 'aspect-[4/5]',  // 4:5
  wide: 'aspect-[21/9]',     // 21:9
}

export const ImageCard: React.FC<ImageCardProps> = ({
  src,
  alt,
  title,
  description,
  badge,
  badgeVariant = 'medical',
  date,
  location,
  aspectRatio = 'video',
  to,
  href,
  overlay = false,
  className = '',
  footer,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const cardContent = (
    <div
      className={`group relative rounded-2xl overflow-hidden border border-[#e3eae4] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#cbd8cf] ${
        overlay ? 'text-white' : 'text-slate-900'
      } ${className}`}
    >
      {/* Image container */}
      <div className={`relative w-full overflow-hidden bg-slate-100 ${aspectRatios[aspectRatio]}`}>
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        )}

        <img
          src={imageError ? '/images/about/project-care-health-hygiene-team.jpg' : src}
          alt={alt}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true)
            setImageLoaded(true)
          }}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Overlay gradient if overlay is requested */}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#051b14]/90 via-[#051b14]/40 to-transparent" />
        )}

        {/* Top Floating Badge */}
        {badge && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <Badge variant={badgeVariant} size="sm">
              {badge}
            </Badge>
          </div>
        )}

        {/* Action arrow indicator if link exists */}
        {(to || href) && (
          <div className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 flex items-center justify-center shadow-xs opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <ArrowUpRight className="w-4 h-4 text-[#105e49]" />
          </div>
        )}

        {/* Content inside overlay */}
        {overlay && (
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 flex flex-col">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 mb-2 font-medium">
              {location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#55d5b3]" />
                  {location}
                </span>
              )}
              {date && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#55d5b3]" />
                  {date}
                </span>
              )}
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold leading-snug text-white group-hover:text-[#55d5b3] transition-colors">
              {title}
            </h3>
            {description && (
              <p className="mt-2 text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
            {footer && <div className="mt-3">{footer}</div>}
          </div>
        )}
      </div>

      {/* Standard non-overlay body */}
      {!overlay && (
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          {(location || date) && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2 font-medium">
              {location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#105e49]" />
                  {location}
                </span>
              )}
              {date && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#105e49]" />
                  {date}
                </span>
              )}
            </div>
          )}

          <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-[#105e49] transition-colors leading-snug">
            {title}
          </h3>

          {description && (
            <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {footer && <div className="mt-4 pt-4 border-t border-slate-100">{footer}</div>}
        </div>
      )}
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="block no-underline">
        {cardContent}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block no-underline">
        {cardContent}
      </a>
    )
  }

  return cardContent
}

export default ImageCard
