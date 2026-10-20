import crypto from 'crypto';
import {
  User,
  AdminProfile,
  Program,
  ProgramService,
  ImpactMetric,
  ImpactStory,
  GalleryAlbum,
  GalleryImage,
  Event,
  Partner,
  TeamMember,
  AnnualReport,
  DocumentItem,
  VolunteerApplication,
  ContactMessage,
  Donation,
  NewsletterSubscriber,
  AuditLog,
} from '../types';
import { hashPassword } from '../utils/security';
import { env } from '../config/env';

export interface DatabaseState {
  users: User[];
  adminProfiles: AdminProfile[];
  programs: Program[];
  programServices: ProgramService[];
  impactMetrics: ImpactMetric[];
  impactStories: ImpactStory[];
  galleryAlbums: GalleryAlbum[];
  galleryImages: GalleryImage[];
  events: Event[];
  partners: Partner[];
  teamMembers: TeamMember[];
  volunteerApplications: VolunteerApplication[];
  internshipApplications: any[];
  partnershipRequests: any[];
  contactMessages: ContactMessage[];
  donations: Donation[];
  donationTransactions: any[];
  documents: DocumentItem[];
  annualReports: AnnualReport[];
  newsletterSubscribers: NewsletterSubscriber[];
  auditLogs: AuditLog[];
}

export const getInitialSeedData = (): DatabaseState => {
  const adminId = 'd8f4c4c2-75d1-4682-843a-7ef08c2a11b1';
  const profileId = 'e23b6b19-c6e3-4f93-b6d3-2bcf0d367fa3';
  const { hash, salt } = hashPassword(env.DEFAULT_ADMIN_PASSWORD);

  const programs: Program[] = [
    {
      id: 'p1111111-1111-1111-1111-111111111111',
      slug: 'healthcare-medical-relief',
      title: 'Healthcare & Medical Relief',
      summary: 'Providing accessible healthcare, mobile clinics, and preventative medical camps to underserved rural communities.',
      description: 'Our flagship healthcare initiative bridges the gap between critical medical services and marginalized populations. We operate regular diagnostic camps, provide free essential medications, and conduct widespread awareness campaigns on polio eradication and child hygiene.',
      problem_addressed: 'Rural villages lack accessible primary health centers, resulting in untreated chronic illnesses and high maternal and child mortality.',
      geographical_coverage: 'Odisha, Jharkhand, and border districts across eastern India.',
      cover_image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      display_order: 1,
      created_at: new Date('2026-01-10T08:00:00Z').toISOString(),
      updated_at: new Date('2026-01-10T08:00:00Z').toISOString(),
    },
    {
      id: 'p2222222-2222-2222-2222-222222222222',
      slug: 'education-skill-development',
      title: 'Quality Education & Skill Development',
      summary: 'Empowering children and youth through foundational learning kits, digital literacy, and job-oriented vocational training.',
      description: 'Education is the most sustainable antidote to generational poverty. SCNSWF supports government schools, distributes high-quality study materials, runs after-school learning centers, and trains youth in market-relevant vocational skills.',
      problem_addressed: 'Severe school dropout rates after primary grades and youth unemployability due to lack of practical vocational skills.',
      geographical_coverage: 'Semi-urban slums and remote tribal educational clusters.',
      cover_image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      display_order: 2,
      created_at: new Date('2026-01-12T08:00:00Z').toISOString(),
      updated_at: new Date('2026-01-12T08:00:00Z').toISOString(),
    },
    {
      id: 'p3333333-3333-3333-3333-333333333333',
      slug: 'women-empowerment-self-reliance',
      title: 'Women Empowerment & Self-Reliance',
      summary: 'Fostering financial independence through micro-enterprise coaching, self-help groups (SHGs), and leadership workshops.',
      description: 'We organize rural women into self-help groups, providing seed capital guidance, artisan handicraft training, and financial literacy to foster true autonomy and gender equity.',
      problem_addressed: 'Women facing financial dependence, lack of credit access, and low economic participation in rural economies.',
      geographical_coverage: 'Coastal and tribal districts.',
      cover_image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      display_order: 3,
      created_at: new Date('2026-01-15T08:00:00Z').toISOString(),
      updated_at: new Date('2026-01-15T08:00:00Z').toISOString(),
    },
    {
      id: 'p4444444-4444-4444-4444-444444444444',
      slug: 'disaster-relief-community-welfare',
      title: 'Disaster Relief & Community Welfare',
      summary: 'Rapid response emergency supplies, cyclone shelters, winter clothing distribution, and geriatric support.',
      description: 'When natural catastrophes strike or severe winter winds arrive, our field volunteers deploy immediately with dry rations, water purification kits, hygiene packs, and temporary shelter rehabilitation.',
      problem_addressed: 'Vulnerability of coastal and riverine families to cyclones, floods, and seasonal extremes.',
      geographical_coverage: 'High-risk coastal flood and cyclone belts.',
      cover_image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      display_order: 4,
      created_at: new Date('2026-01-18T08:00:00Z').toISOString(),
      updated_at: new Date('2026-01-18T08:00:00Z').toISOString(),
    },
  ];

  const programServices: ProgramService[] = [
    {
      id: 's1111111-1111-1111-1111-111111111111',
      program_id: 'p1111111-1111-1111-1111-111111111111',
      title: 'Mobile Health Clinics & Ambulance Outreach',
      description: 'Fully equipped medical vans traveling directly to remote hamlets with doctors and point-of-care diagnostics.',
      display_order: 1,
      created_at: new Date('2026-01-10T08:00:00Z').toISOString(),
      updated_at: new Date('2026-01-10T08:00:00Z').toISOString(),
    },
    {
      id: 's2222222-2222-2222-2222-222222222222',
      program_id: 'p1111111-1111-1111-1111-111111111111',
      title: 'Polio & Preventive Immunization Campaigns',
      description: 'Community-wide vaccination rallies, door-to-door drops, and mother-and-child nutrition counseling.',
      display_order: 2,
      created_at: new Date('2026-01-10T08:00:00Z').toISOString(),
      updated_at: new Date('2026-01-10T08:00:00Z').toISOString(),
    },
    {
      id: 's3333333-3333-3333-3333-333333333333',
      program_id: 'p2222222-2222-2222-2222-222222222222',
      title: 'Child Hygiene & Handwashing Education',
      description: 'Interactive hygiene workshops in village schools preventing waterborne illnesses and parasites.',
      display_order: 1,
      created_at: new Date('2026-01-12T08:00:00Z').toISOString(),
      updated_at: new Date('2026-01-12T08:00:00Z').toISOString(),
    },
    {
      id: 's4444444-4444-4444-4444-444444444444',
      program_id: 'p3333333-3333-3333-3333-333333333333',
      title: 'Artisan Micro-Finance & Skill Training',
      description: 'Providing tailoring machines, loom equipment, and direct market linkage for women entrepreneurs.',
      display_order: 1,
      created_at: new Date('2026-01-15T08:00:00Z').toISOString(),
      updated_at: new Date('2026-01-15T08:00:00Z').toISOString(),
    },
  ];

  const impactMetrics: ImpactMetric[] = [
    {
      id: 'm1111111-1111-1111-1111-111111111111',
      program_id: null,
      label: 'Lives Impacted',
      value: 65000,
      unit: 'people',
      period_start: '2024-01-01',
      period_end: '2026-01-01',
      created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
      updated_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    },
    {
      id: 'm2222222-2222-2222-2222-222222222222',
      program_id: 'p1111111-1111-1111-1111-111111111111',
      label: 'Free Medical Camps Conducted',
      value: 145,
      unit: 'camps',
      period_start: '2024-01-01',
      period_end: '2026-01-01',
      created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
      updated_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    },
    {
      id: 'm3333333-3333-3333-3333-333333333333',
      program_id: 'p2222222-2222-2222-2222-222222222222',
      label: 'Students Supported with Scholarships',
      value: 3200,
      unit: 'students',
      period_start: '2024-01-01',
      period_end: '2026-01-01',
      created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
      updated_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    },
    {
      id: 'm4444444-4444-4444-4444-444444444444',
      program_id: 'p3333333-3333-3333-3333-333333333333',
      label: 'Women Micro-Entrepreneurs Graduated',
      value: 1850,
      unit: 'women',
      period_start: '2024-01-01',
      period_end: '2026-01-01',
      created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
      updated_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    },
  ];

  const impactStories: ImpactStory[] = [
    {
      id: 'is111111-1111-1111-1111-111111111111',
      slug: 'bringing-lifesaving-care-to-kalahandi',
      title: 'Bringing Lifesaving Healthcare to Kalahandi Villages',
      summary: 'How our mobile medical unit helped save dozens of high-risk pregnancies and provided chronic diabetes care.',
      body: 'In early 2025, our mobile healthcare team reached the dense forest hamlets of Kalahandi. Over 600 villagers received direct medical consultations, free prescription glasses, and vital insulin treatment.',
      program_id: 'p1111111-1111-1111-1111-111111111111',
      cover_image_url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      published_at: new Date('2026-02-01T10:00:00Z').toISOString(),
      created_at: new Date('2026-02-01T10:00:00Z').toISOString(),
      updated_at: new Date('2026-02-01T10:00:00Z').toISOString(),
    },
    {
      id: 'is222222-2222-2222-2222-222222222222',
      slug: 'first-generation-learner-cracks-polytechnic',
      title: 'From Tribal Settlement to State Polytechnic: Sunita’s Journey',
      summary: 'Sunita overcame acute resource constraints through SCNSWF after-school mentoring and scholarship.',
      body: 'Sunita, daughter of daily-wage agricultural workers, became the first girl from her village to qualify for the State Engineering Diploma entrance exam with full tuition sponsorship.',
      program_id: 'p2222222-2222-2222-2222-222222222222',
      cover_image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      published_at: new Date('2026-02-15T10:00:00Z').toISOString(),
      created_at: new Date('2026-02-15T10:00:00Z').toISOString(),
      updated_at: new Date('2026-02-15T10:00:00Z').toISOString(),
    },
  ];

  const galleryAlbums: GalleryAlbum[] = [
    {
      id: 'ga111111-1111-1111-1111-111111111111',
      title: 'Health & Hygiene Field Camps 2026',
      description: 'Documenting free medical examinations, child handwashing drills, and medicine distributions.',
      status: 'published',
      created_at: new Date('2026-01-20T00:00:00Z').toISOString(),
      updated_at: new Date('2026-01-20T00:00:00Z').toISOString(),
    },
    {
      id: 'ga222222-2222-2222-2222-222222222222',
      title: 'Polio Eradication & Public Awareness',
      description: 'Photos from National Immunization Day drives and community rally marches.',
      status: 'published',
      created_at: new Date('2026-02-10T00:00:00Z').toISOString(),
      updated_at: new Date('2026-02-10T00:00:00Z').toISOString(),
    },
  ];

  const galleryImages: GalleryImage[] = [
    {
      id: 'gi111111-1111-1111-1111-111111111111',
      album_id: 'ga111111-1111-1111-1111-111111111111',
      image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      caption: 'Pediatric specialist examining school children during health drive',
      alt_text: 'Doctor examining child in village clinic',
      display_order: 1,
      created_at: new Date('2026-01-20T00:00:00Z').toISOString(),
      updated_at: new Date('2026-01-20T00:00:00Z').toISOString(),
    },
    {
      id: 'gi222222-2222-2222-2222-222222222222',
      album_id: 'ga111111-1111-1111-1111-111111111111',
      image_url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
      caption: 'Child health and handwashing hygiene demonstration',
      alt_text: 'Children learning proper handwashing steps',
      display_order: 2,
      created_at: new Date('2026-01-20T00:00:00Z').toISOString(),
      updated_at: new Date('2026-01-20T00:00:00Z').toISOString(),
    },
  ];

  const events: Event[] = [
    {
      id: 'e1111111-1111-1111-1111-111111111111',
      slug: 'mega-health-eye-camp-bhubaneswar',
      title: 'Mega Health & Eye Checkup Camp',
      description: 'Comprehensive free eye screening, cataract detections, and general medicine consultations by renowned surgeons.',
      location: 'Community Hall, Sector 7, Bhubaneswar',
      start_datetime: '2026-11-15T09:00:00Z',
      end_datetime: '2026-11-15T17:00:00Z',
      status: 'published',
      created_at: new Date('2026-02-15T00:00:00Z').toISOString(),
      updated_at: new Date('2026-02-15T00:00:00Z').toISOString(),
    },
    {
      id: 'e2222222-2222-2222-2222-222222222222',
      slug: 'rural-women-artisan-exhibition-2026',
      title: 'Rural Women Artisan Handicraft Exhibition',
      description: 'Showcasing indigenous textile weaving, clay handicrafts, and organic agricultural products created by our SHG clusters.',
      location: 'Exhibition Ground, Unit-3, Bhubaneswar',
      start_datetime: '2026-12-05T10:00:00Z',
      end_datetime: '2026-12-07T20:00:00Z',
      status: 'published',
      created_at: new Date('2026-02-20T00:00:00Z').toISOString(),
      updated_at: new Date('2026-02-20T00:00:00Z').toISOString(),
    },
  ];

  const partners: Partner[] = [
    {
      id: 'pt111111-1111-1111-1111-111111111111',
      name: 'Odisha State Health Mission',
      logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
      website_url: 'https://health.odisha.gov.in',
      partnership_type: 'government',
      status: 'published',
      display_order: 1,
      created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
      updated_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    },
    {
      id: 'pt222222-2222-2222-2222-222222222222',
      name: 'Tata Steel CSR Foundation',
      logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80',
      website_url: 'https://tatasteel.com/sustainability/csr',
      partnership_type: 'csr',
      status: 'published',
      display_order: 2,
      created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
      updated_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    },
  ];

  const teamMembers: TeamMember[] = [
    {
      id: 'tm111111-1111-1111-1111-111111111111',
      name: 'Suresh Chandra Nayak',
      role_title: 'Founding Chairman & Visionary',
      bio: 'Lifelong social reformer dedicated to rural healthcare equality and community development in Eastern India.',
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      category: 'leadership',
      status: 'published',
      display_order: 1,
      created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
      updated_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    },
    {
      id: 'tm222222-2222-2222-2222-222222222222',
      name: 'Dr. Priya Ranjan Das',
      role_title: 'Director of Healthcare Initiatives',
      bio: 'Senior public health physician specializing in epidemiological outreach and rural immunization delivery.',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      category: 'leadership',
      status: 'published',
      display_order: 2,
      created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
      updated_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    },
  ];

  const annualReports: AnnualReport[] = [
    {
      id: 'ar111111-1111-1111-1111-111111111111',
      year: 2025,
      title: 'SCNSWF Annual Impact & Financial Audit Report 2024-2025',
      file_url: 'https://api.scnswf.org/media/documents/annual-report-2025.pdf',
      status: 'published',
      created_at: new Date('2025-04-01T00:00:00Z').toISOString(),
      updated_at: new Date('2025-04-01T00:00:00Z').toISOString(),
    },
    {
      id: 'ar222222-2222-2222-2222-222222222222',
      year: 2024,
      title: 'SCNSWF Annual Impact & Financial Audit Report 2023-2024',
      file_url: 'https://api.scnswf.org/media/documents/annual-report-2024.pdf',
      status: 'published',
      created_at: new Date('2024-04-01T00:00:00Z').toISOString(),
      updated_at: new Date('2024-04-01T00:00:00Z').toISOString(),
    },
  ];

  const documents: DocumentItem[] = [
    {
      id: 'doc11111-1111-1111-1111-111111111111',
      title: 'Section 12A & 80G Tax Exemption Certificate',
      category: 'certificate',
      file_url: 'https://api.scnswf.org/media/documents/80g-certificate.pdf',
      visibility: 'public',
      created_at: new Date('2024-01-01T00:00:00Z').toISOString(),
      updated_at: new Date('2024-01-01T00:00:00Z').toISOString(),
    },
  ];

  return {
    users: [
      {
        id: adminId,
        email: env.DEFAULT_ADMIN_EMAIL,
        passwordHash: hash,
        salt,
        firstName: 'System',
        lastName: 'Administrator',
        isStaff: true,
        isActive: true,
        role: 'super_admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    adminProfiles: [
      {
        id: profileId,
        userId: adminId,
        phone: '+919876543210',
        avatarUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    programs,
    programServices,
    impactMetrics,
    impactStories,
    galleryAlbums,
    galleryImages,
    events,
    partners,
    teamMembers,
    volunteerApplications: [],
    internshipApplications: [],
    partnershipRequests: [],
    contactMessages: [],
    donations: [],
    donationTransactions: [],
    documents,
    annualReports,
    newsletterSubscribers: [],
    auditLogs: [],
  };
};
