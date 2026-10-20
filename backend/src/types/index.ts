export type Role = 'super_admin' | 'content_editor' | 'applications_reviewer';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  firstName: string;
  lastName: string;
  isStaff: boolean;
  isActive: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfile {
  id: string;
  userId: string;
  phone: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  problem_addressed: string;
  geographical_coverage: string;
  cover_image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProgramService {
  id: string;
  program_id: string;
  title: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ImpactMetric {
  id: string;
  program_id: string | null;
  label: string;
  value: number;
  unit: string;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImpactStory {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  program_id: string | null;
  cover_image_url: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  album_id: string;
  image_url: string;
  caption: string;
  alt_text: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  start_datetime: string;
  end_datetime: string;
  status: 'draft' | 'published' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  partnership_type: string;
  status: 'draft' | 'published';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role_title: string;
  bio: string;
  photo_url: string;
  category: 'leadership' | 'team';
  status: 'draft' | 'published';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string;
  availability: string;
  experience: string;
  message: string;
  status: 'new' | 'in_review' | 'accepted' | 'rejected';
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface InternshipApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  education: string;
  area_of_interest: string;
  duration: string;
  resume_url?: string;
  message: string;
  status: 'new' | 'in_review' | 'accepted' | 'rejected';
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface PartnershipRequest {
  id: string;
  organization_name: string;
  contact_person: string;
  email: string;
  phone: string;
  partnership_type: string;
  message: string;
  status: 'new' | 'in_review' | 'accepted' | 'rejected';
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  newsletter_subscription: boolean;
  status: 'new' | 'read' | 'responded';
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  program_id: string | null;
  donor_name: string | null;
  donor_email: string | null;
  donor_phone: string | null;
  is_anonymous: boolean;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  receipt_number: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface DonationTransaction {
  id: string;
  donation_id: string;
  provider: string;
  provider_order_id: string;
  provider_payment_id: string | null;
  provider_signature: string | null;
  raw_payload: Record<string, unknown>;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  file_url: string;
  visibility: 'public' | 'private';
  created_at: string;
  updated_at: string;
}

export interface AnnualReport {
  id: string;
  year: number;
  title: string;
  file_url: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id: string;
  actor_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface PaginatedMeta {
  count: number;
  next: string | null;
  previous: string | null;
  page_size: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}
