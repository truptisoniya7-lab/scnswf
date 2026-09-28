/* Shared TypeScript types — mirrors DRF serializer shapes */

export interface PaginatedResponse<T> {
  data: T[]
  meta: { count: number; next: string | null; previous: string | null; page_size: number }
}

export interface Program {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  problem_addressed: string
  geographical_coverage: string
  cover_image_url: string | null
  status: "draft" | "published" | "archived"
  display_order: number
  created_at: string
  updated_at: string
}

export interface ImpactMetric {
  id: string
  program_id: string | null
  label: string
  value: number
  unit: string
  period_start: string | null
  period_end: string | null
}

export interface ImpactStory {
  id: string
  slug: string
  title: string
  summary: string
  body: string
  program_id: string | null
  cover_image_url: string | null
  status: "draft" | "published"
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface GalleryAlbum {
  id: string
  title: string
  description: string
  status: "draft" | "published"
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  album_id: string
  image_url: string
  caption: string
  alt_text: string
  display_order: number
}

export interface Event {
  id: string
  slug: string
  title: string
  description: string
  location: string
  start_datetime: string
  end_datetime: string
  status: "draft" | "published" | "cancelled"
}

export interface Partner {
  id: string
  name: string
  logo_url: string
  website_url: string | null
  partnership_type: string
  status: "draft" | "published"
  display_order: number
}

export interface TeamMember {
  id: string
  name: string
  role_title: string
  bio: string
  photo_url: string
  category: "leadership" | "team"
  status: "draft" | "published"
  display_order: number
}

// Form payload types
export interface ContactFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  subject: string
  message: string
  newsletter_subscription: boolean
}

export interface VolunteerFormData {
  name: string
  email: string
  phone: string
  location: string
  skills: string
  availability: string
  experience: string
  message: string
}

export interface InternshipFormData {
  name: string
  email: string
  phone: string
  education: string
  area_of_interest: string
  duration: string
  resume: File
  message: string
}

export interface PartnershipFormData {
  organization_name: string
  contact_person: string
  email: string
  phone: string
  partnership_type: string
  message: string
}

export interface DonationPayload {
  program_id: string | null
  amount: number
  currency: string
  is_anonymous: boolean
  donor_name?: string
  donor_email?: string
  donor_phone?: string
}
