import crypto from 'crypto';
import { dbStore } from './store';
import {
  Program,
  ProgramService,
  ImpactMetric,
  ImpactStory,
  GalleryAlbum,
  GalleryImage,
  Event,
  Partner,
  TeamMember,
  VolunteerApplication,
  InternshipApplication,
  PartnershipRequest,
  ContactMessage,
  Donation,
  DonationTransaction,
  AnnualReport,
  DocumentItem,
  NewsletterSubscriber,
  User,
  AdminProfile,
  AuditLog,
  PaginatedMeta,
} from '../types';

export const paginate = <T>(
  items: T[],
  page = 1,
  pageSize = 20,
  baseUrl = ''
): { data: T[]; meta: PaginatedMeta } => {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, Math.min(100, pageSize));
  const total = items.length;
  const startIndex = (safePage - 1) * safePageSize;
  const data = items.slice(startIndex, startIndex + safePageSize);

  const totalPages = Math.ceil(total / safePageSize);
  const next = safePage < totalPages ? `${baseUrl}?page=${safePage + 1}&page_size=${safePageSize}` : null;
  const previous = safePage > 1 ? `${baseUrl}?page=${safePage - 1}&page_size=${safePageSize}` : null;

  return {
    data,
    meta: {
      count: total,
      next,
      previous,
      page_size: safePageSize,
    },
  };
};

export const programsRepo = {
  findAll: (options?: { status?: string; search?: string; page?: number; pageSize?: number }) => {
    let items = dbStore.getState().programs;
    if (options?.status) {
      items = items.filter((p) => p.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    items.sort((a, b) => a.display_order - b.display_order);
    return paginate(items, options?.page, options?.pageSize, '/api/v1/programs/');
  },

  findBySlug: (slug: string) => {
    return dbStore.getState().programs.find((p) => p.slug === slug) || null;
  },

  findById: (id: string) => {
    return dbStore.getState().programs.find((p) => p.id === id) || null;
  },

  create: (data: Omit<Program, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: Program = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => {
      state.programs.push(newItem);
    });
    dbStore.syncDocument('programs', newItem.id, newItem);
    return newItem;
  },

  update: (id: string, data: Partial<Program>) => {
    let updated: Program | null = null;
    dbStore.update((state) => {
      const idx = state.programs.findIndex((p) => p.id === id);
      if (idx !== -1) {
        state.programs[idx] = {
          ...state.programs[idx],
          ...data,
          updated_at: new Date().toISOString(),
        };
        updated = state.programs[idx];
      }
    });
    if (updated) {
      dbStore.syncDocument('programs', (updated as Program).id, updated);
    }
    return updated;
  },

  delete: (id: string) => {
    let deleted = false;
    dbStore.update((state) => {
      const idx = state.programs.findIndex((p) => p.id === id);
      if (idx !== -1) {
        state.programs.splice(idx, 1);
        // Also remove services belonging to this program
        state.programServices = state.programServices.filter((s) => s.program_id !== id);
        deleted = true;
      }
    });
    if (deleted) {
      dbStore.deleteDocument('programs', id);
    }
    return deleted;
  },

  findServicesByProgramId: (programId: string) => {
    return dbStore
      .getState()
      .programServices.filter((s) => s.program_id === programId)
      .sort((a, b) => a.display_order - b.display_order);
  },

  createService: (data: Omit<ProgramService, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: ProgramService = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => {
      state.programServices.push(newItem);
    });
    dbStore.syncDocument('programServices', newItem.id, newItem);
    return newItem;
  },
};

export const impactRepo = {
  findMetrics: (options?: { program_id?: string | null }) => {
    let items = dbStore.getState().impactMetrics;
    if (options?.program_id !== undefined) {
      items = items.filter((m) => m.program_id === options.program_id);
    }
    return items;
  },

  findStories: (options?: { status?: string; search?: string; page?: number; pageSize?: number }) => {
    let items = dbStore.getState().impactStories;
    if (options?.status) {
      items = items.filter((s) => s.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      items = items.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.body.toLowerCase().includes(q)
      );
    }
    items.sort(
      (a, b) =>
        new Date(b.published_at || b.created_at).getTime() -
        new Date(a.published_at || a.created_at).getTime()
    );
    return paginate(items, options?.page, options?.pageSize, '/api/v1/impact/stories/');
  },

  findStoryBySlug: (slug: string) => {
    return dbStore.getState().impactStories.find((s) => s.slug === slug) || null;
  },

  createMetric: (data: Omit<ImpactMetric, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: ImpactMetric = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.impactMetrics.push(newItem));
    dbStore.syncDocument('impactMetrics', newItem.id, newItem);
    return newItem;
  },

  createStory: (data: Omit<ImpactStory, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: ImpactStory = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.impactStories.push(newItem));
    dbStore.syncDocument('impactStories', newItem.id, newItem);
    return newItem;
  },
};

export const galleryRepo = {
  findAlbums: (options?: { status?: string; page?: number; pageSize?: number }) => {
    let items = dbStore.getState().galleryAlbums;
    if (options?.status) {
      items = items.filter((a) => a.status === options.status);
    }
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return paginate(items, options?.page, options?.pageSize, '/api/v1/gallery/albums/');
  },

  findAlbumById: (id: string) => {
    return dbStore.getState().galleryAlbums.find((a) => a.id === id) || null;
  },

  findImagesByAlbumId: (albumId: string) => {
    return dbStore
      .getState()
      .galleryImages.filter((img) => img.album_id === albumId)
      .sort((a, b) => a.display_order - b.display_order);
  },

  createAlbum: (data: Omit<GalleryAlbum, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: GalleryAlbum = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.galleryAlbums.push(newItem));
    dbStore.syncDocument('galleryAlbums', newItem.id, newItem);
    return newItem;
  },

  createImage: (data: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: GalleryImage = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.galleryImages.push(newItem));
    dbStore.syncDocument('galleryImages', newItem.id, newItem);
    return newItem;
  },
};

export const eventsRepo = {
  findAll: (options?: { status?: string; search?: string; page?: number; pageSize?: number }) => {
    let items = dbStore.getState().events;
    if (options?.status) {
      items = items.filter((e) => e.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      items = items.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      );
    }
    items.sort(
      (a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime()
    );
    return paginate(items, options?.page, options?.pageSize, '/api/v1/events/');
  },

  findBySlug: (slug: string) => {
    return dbStore.getState().events.find((e) => e.slug === slug) || null;
  },

  create: (data: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: Event = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.events.push(newItem));
    dbStore.syncDocument('events', newItem.id, newItem);
    return newItem;
  },
};

export const partnersRepo = {
  findAll: (options?: { status?: string }) => {
    let items = dbStore.getState().partners;
    if (options?.status) {
      items = items.filter((p) => p.status === options.status);
    }
    items.sort((a, b) => a.display_order - b.display_order);
    return items;
  },

  create: (data: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: Partner = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.partners.push(newItem));
    dbStore.syncDocument('partners', newItem.id, newItem);
    return newItem;
  },
};

export const teamRepo = {
  findAll: (options?: { status?: string; category?: string }) => {
    let items = dbStore.getState().teamMembers;
    if (options?.status) {
      items = items.filter((m) => m.status === options.status);
    }
    if (options?.category) {
      items = items.filter((m) => m.category === options.category);
    }
    items.sort((a, b) => a.display_order - b.display_order);
    return items;
  },

  create: (data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: TeamMember = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.teamMembers.push(newItem));
    dbStore.syncDocument('teamMembers', newItem.id, newItem);
    return newItem;
  },
};

export const applicationsRepo = {
  createVolunteer: (data: Omit<VolunteerApplication, 'id' | 'status' | 'is_deleted' | 'created_at' | 'updated_at'>) => {
    const newItem: VolunteerApplication = {
      ...data,
      id: crypto.randomUUID(),
      status: 'new',
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.volunteerApplications.push(newItem));
    dbStore.syncDocument('volunteerApplications', newItem.id, newItem);
    return newItem;
  },

  findAllVolunteer: () => {
    return dbStore.getState().volunteerApplications.filter((a) => !a.is_deleted);
  },

  updateVolunteerStatus: (id: string, status: VolunteerApplication['status']) => {
    let updated: VolunteerApplication | null = null;
    dbStore.update((state) => {
      const idx = state.volunteerApplications.findIndex((a) => a.id === id);
      if (idx !== -1) {
        state.volunteerApplications[idx].status = status;
        state.volunteerApplications[idx].updated_at = new Date().toISOString();
        updated = state.volunteerApplications[idx];
      }
    });
    if (updated) {
      dbStore.syncDocument('volunteerApplications', (updated as VolunteerApplication).id, updated);
    }
    return updated;
  },

  createInternship: (data: Omit<InternshipApplication, 'id' | 'status' | 'is_deleted' | 'created_at' | 'updated_at'>) => {
    const newItem: InternshipApplication = {
      ...data,
      id: crypto.randomUUID(),
      status: 'new',
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.internshipApplications.push(newItem));
    dbStore.syncDocument('internshipApplications', newItem.id, newItem);
    return newItem;
  },

  findAllInternship: () => {
    return dbStore.getState().internshipApplications.filter((a) => !a.is_deleted);
  },

  createPartnership: (data: Omit<PartnershipRequest, 'id' | 'status' | 'is_deleted' | 'created_at' | 'updated_at'>) => {
    const newItem: PartnershipRequest = {
      ...data,
      id: crypto.randomUUID(),
      status: 'new',
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.partnershipRequests.push(newItem));
    dbStore.syncDocument('partnershipRequests', newItem.id, newItem);
    return newItem;
  },

  findAllPartnership: () => {
    return dbStore.getState().partnershipRequests.filter((a) => !a.is_deleted);
  },

  findAllUnified: (options?: {
    type?: string;
    status?: string;
    q?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const state = dbStore.getState();
    let unified: any[] = [];

    if (!options?.type || options.type === 'volunteer') {
      const vol = (state.volunteerApplications || []).filter((a) => !a.is_deleted).map((a) => ({
        id: a.id,
        type: 'volunteer' as const,
        applicantName: a.name,
        email: a.email,
        phone: a.phone,
        status: a.status === 'accepted' ? 'approved' : a.status === 'new' ? 'pending' : a.status === 'in_review' ? 'under_review' : a.status,
        submittedAt: a.created_at,
        reviewerId: (a as any).reviewer_id || null,
        rejectionReason: (a as any).rejection_reason,
        notes: (a as any).notes || [],
        statusHistory: (a as any).status_history || [],
        details: {
          skills: a.skills,
          availability: a.availability,
          experience: a.experience,
          message: a.message,
          location: a.location,
        },
      }));
      unified.push(...vol);
    }

    if (!options?.type || options.type === 'internship') {
      const intern = (state.internshipApplications || []).filter((a) => !a.is_deleted).map((a) => ({
        id: a.id,
        type: 'internship' as const,
        applicantName: a.name,
        email: a.email,
        phone: a.phone,
        status: a.status === 'accepted' ? 'approved' : a.status === 'new' ? 'pending' : a.status === 'in_review' ? 'under_review' : a.status,
        submittedAt: a.created_at,
        reviewerId: (a as any).reviewer_id || null,
        rejectionReason: (a as any).rejection_reason,
        notes: (a as any).notes || [],
        statusHistory: (a as any).status_history || [],
        details: {
          education: a.education,
          area_of_interest: a.area_of_interest,
          duration: a.duration,
          resume_url: a.resume_url,
          message: a.message,
        },
      }));
      unified.push(...intern);
    }

    if (options?.status) {
      unified = unified.filter((a) => a.status === options.status);
    }

    if (options?.q) {
      const q = options.q.toLowerCase().trim();
      unified = unified.filter(
        (a) =>
          a.applicantName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          (a.phone && a.phone.includes(q))
      );
    }

    unified.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return paginate(unified, options?.page, options?.pageSize, '/api/v1/admin/applications');
  },

  findUnifiedById: (id: string) => {
    const state = dbStore.getState();
    const vol = (state.volunteerApplications || []).find((a) => a.id === id);
    if (vol) {
      return {
        id: vol.id,
        type: 'volunteer' as const,
        applicantName: vol.name,
        email: vol.email,
        phone: vol.phone,
        status: vol.status === 'accepted' ? 'approved' : vol.status === 'new' ? 'pending' : vol.status === 'in_review' ? 'under_review' : vol.status,
        submittedAt: vol.created_at,
        reviewerId: (vol as any).reviewer_id || null,
        rejectionReason: (vol as any).rejection_reason,
        notes: (vol as any).notes || [],
        statusHistory: (vol as any).status_history || [],
        details: {
          skills: vol.skills,
          availability: vol.availability,
          experience: vol.experience,
          message: vol.message,
          location: vol.location,
        },
      };
    }

    const intern = (state.internshipApplications || []).find((a) => a.id === id);
    if (intern) {
      return {
        id: intern.id,
        type: 'internship' as const,
        applicantName: intern.name,
        email: intern.email,
        phone: intern.phone,
        status: intern.status === 'accepted' ? 'approved' : intern.status === 'new' ? 'pending' : intern.status === 'in_review' ? 'under_review' : intern.status,
        submittedAt: intern.created_at,
        reviewerId: (intern as any).reviewer_id || null,
        rejectionReason: (intern as any).rejection_reason,
        notes: (intern as any).notes || [],
        statusHistory: (intern as any).status_history || [],
        details: {
          education: intern.education,
          area_of_interest: intern.area_of_interest,
          duration: intern.duration,
          resume_url: intern.resume_url,
          message: intern.message,
        },
      };
    }
    return null;
  },

  updateUnifiedStatus: (
    id: string,
    status: 'pending' | 'under_review' | 'approved' | 'rejected',
    changedBy: string,
    reason?: string
  ) => {
    let updated: any = null;
    const historyEntry = {
      status,
      changedBy,
      reason,
      at: new Date().toISOString(),
    };

    dbStore.update((state) => {
      // Check volunteer
      const vIdx = (state.volunteerApplications || []).findIndex((a) => a.id === id);
      if (vIdx !== -1) {
        const item = state.volunteerApplications[vIdx] as any;
        item.status = status === 'approved' ? 'accepted' : status === 'pending' ? 'new' : status === 'under_review' ? 'in_review' : status;
        item.rejection_reason = reason || null;
        item.reviewer_id = changedBy;
        item.status_history = item.status_history || [];
        item.status_history.push(historyEntry);
        item.updated_at = new Date().toISOString();
        updated = item;
        return;
      }

      // Check internship
      const iIdx = (state.internshipApplications || []).findIndex((a) => a.id === id);
      if (iIdx !== -1) {
        const item = state.internshipApplications[iIdx] as any;
        item.status = status === 'approved' ? 'accepted' : status === 'pending' ? 'new' : status === 'under_review' ? 'in_review' : status;
        item.rejection_reason = reason || null;
        item.reviewer_id = changedBy;
        item.status_history = item.status_history || [];
        item.status_history.push(historyEntry);
        item.updated_at = new Date().toISOString();
        updated = item;
      }
    });

    if (updated) {
      const collection = updated.skills ? 'volunteerApplications' : 'internshipApplications';
      dbStore.syncDocument(collection, id, updated);
    }
    return updated;
  },

  addUnifiedNote: (id: string, authorId: string, authorName: string, text: string) => {
    let noteAdded: any = null;
    const note = {
      id: crypto.randomUUID(),
      authorId,
      authorName,
      text,
      createdAt: new Date().toISOString(),
    };

    dbStore.update((state) => {
      const vIdx = (state.volunteerApplications || []).findIndex((a) => a.id === id);
      if (vIdx !== -1) {
        const item = state.volunteerApplications[vIdx] as any;
        item.notes = item.notes || [];
        item.notes.push(note);
        item.updated_at = new Date().toISOString();
        noteAdded = note;
        return;
      }

      const iIdx = (state.internshipApplications || []).findIndex((a) => a.id === id);
      if (iIdx !== -1) {
        const item = state.internshipApplications[iIdx] as any;
        item.notes = item.notes || [];
        item.notes.push(note);
        item.updated_at = new Date().toISOString();
        noteAdded = note;
      }
    });

    return noteAdded;
  },
};

export const contactRepo = {
  create: (data: Omit<ContactMessage, 'id' | 'status' | 'is_deleted' | 'created_at' | 'updated_at'>) => {
    const newItem: ContactMessage = {
      ...data,
      id: crypto.randomUUID(),
      status: 'new',
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => {
      state.contactMessages.push(newItem);
      if (data.newsletter_subscription && data.email) {
        const exists = state.newsletterSubscribers.some(
          (s) => s.email.toLowerCase() === data.email.toLowerCase()
        );
        if (!exists) {
          const sub = {
            id: crypto.randomUUID(),
            email: data.email,
            subscribed_at: new Date().toISOString(),
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          state.newsletterSubscribers.push(sub);
          dbStore.syncDocument('newsletterSubscribers', sub.id, sub);
        }
      }
    });
    dbStore.syncDocument('contactMessages', newItem.id, newItem);
    return newItem;
  },

  findAll: () => {
    return dbStore.getState().contactMessages.filter((m) => !m.is_deleted);
  },

  updateStatus: (id: string, status: ContactMessage['status']) => {
    let updated: ContactMessage | null = null;
    dbStore.update((state) => {
      const idx = state.contactMessages.findIndex((m) => m.id === id);
      if (idx !== -1) {
        state.contactMessages[idx].status = status;
        state.contactMessages[idx].updated_at = new Date().toISOString();
        updated = state.contactMessages[idx];
      }
    });
    if (updated) {
      dbStore.syncDocument('contactMessages', (updated as ContactMessage).id, updated);
    }
    return updated;
  },
};

export const newsletterRepo = {
  subscribe: (email: string): NewsletterSubscriber => {
    const normalized = email.toLowerCase().trim();
    let subscriber: NewsletterSubscriber | null = null;
    dbStore.update((state) => {
      const existing = state.newsletterSubscribers.find(
        (s) => s.email.toLowerCase() === normalized
      );
      if (existing) {
        existing.is_active = true;
        existing.updated_at = new Date().toISOString();
        subscriber = existing;
      } else {
        const newSub: NewsletterSubscriber = {
          id: crypto.randomUUID(),
          email: normalized,
          subscribed_at: new Date().toISOString(),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        state.newsletterSubscribers.push(newSub);
        subscriber = newSub;
      }
    });
    if (subscriber) {
      dbStore.syncDocument('newsletterSubscribers', (subscriber as NewsletterSubscriber).id, subscriber);
    }
    return subscriber!;
  },
};

export const donationsRepo = {
  create: (data: {
    program_id: string | null;
    amount: number;
    currency?: string;
    is_anonymous: boolean;
    donor_name?: string | null;
    donor_email?: string | null;
    donor_phone?: string | null;
  }) => {
    const donationId = crypto.randomUUID();
    const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    const newDonation: Donation = {
      id: donationId,
      program_id: data.program_id,
      donor_name: data.is_anonymous ? null : data.donor_name || null,
      donor_email: data.is_anonymous ? null : data.donor_email || null,
      donor_phone: data.is_anonymous ? null : data.donor_phone || null,
      is_anonymous: data.is_anonymous,
      amount: data.amount,
      currency: data.currency || 'INR',
      status: 'pending',
      receipt_number: `SCNSWF-REC-${Date.now().toString().slice(-6)}`,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const transaction: DonationTransaction = {
      id: crypto.randomUUID(),
      donation_id: donationId,
      provider: 'razorpay',
      provider_order_id: orderId,
      provider_payment_id: null,
      provider_signature: null,
      raw_payload: {},
      status: 'created',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dbStore.update((state) => {
      state.donations.push(newDonation);
      state.donationTransactions.push(transaction);
    });
    dbStore.syncDocument('donations', newDonation.id, newDonation);
    dbStore.syncDocument('donationTransactions', transaction.id, transaction);

    return {
      donation: newDonation,
      paymentSession: {
        provider: 'razorpay',
        order_id: orderId,
        checkout_params: {
          key: 'rzp_test_mockKey123',
          amount: data.amount * 100,
          currency: data.currency || 'INR',
          name: 'SCNSWF Foundation',
          description: 'Charitable Donation',
          order_id: orderId,
        },
      },
    };
  },

  findById: (id: string) => {
    return dbStore.getState().donations.find((d) => d.id === id && !d.is_deleted) || null;
  },

  findAll: () => {
    return dbStore.getState().donations.filter((d) => !d.is_deleted);
  },

  findAllFiltered: (options?: {
    status?: string;
    q?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    page?: number;
    pageSize?: number;
  }) => {
    let items = dbStore.getState().donations.filter((d) => !d.is_deleted);
    if (options?.status) {
      items = items.filter((d) => d.status === options.status);
    }
    if (options?.q) {
      const q = options.q.toLowerCase().trim();
      items = items.filter(
        (d) =>
          (d.donor_name && d.donor_name.toLowerCase().includes(q)) ||
          (d.donor_email && d.donor_email.toLowerCase().includes(q)) ||
          (d.receipt_number && d.receipt_number.toLowerCase().includes(q)) ||
          (d.id && d.id.toLowerCase().includes(q))
      );
    }
    if (options?.startDate) {
      items = items.filter((d) => new Date(d.created_at) >= new Date(options.startDate!));
    }
    if (options?.endDate) {
      items = items.filter((d) => new Date(d.created_at) <= new Date(options.endDate!));
    }
    if (options?.minAmount !== undefined) {
      items = items.filter((d) => d.amount >= options.minAmount!);
    }
    if (options?.maxAmount !== undefined) {
      items = items.filter((d) => d.amount <= options.maxAmount!);
    }
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return paginate(items, options?.page, options?.pageSize, '/api/v1/admin/donations');
  },

  createManual: (data: {
    donor_name: string;
    donor_email: string;
    donor_phone?: string;
    amount: number;
    currency?: string;
    method: 'cash' | 'bank_transfer' | 'cheque' | 'online';
    notes?: string;
    program_id?: string | null;
  }) => {
    const donationId = crypto.randomUUID();
    const receiptNo = `SCNSWF-MAN-${Date.now().toString().slice(-6)}`;
    const newDonation: Donation = {
      id: donationId,
      program_id: data.program_id || null,
      donor_name: data.donor_name,
      donor_email: data.donor_email,
      donor_phone: data.donor_phone || null,
      is_anonymous: false,
      amount: data.amount,
      currency: data.currency || 'INR',
      status: 'succeeded',
      receipt_number: receiptNo,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dbStore.update((state) => {
      state.donations.push(newDonation);
    });
    dbStore.syncDocument('donations', newDonation.id, newDonation);
    return newDonation;
  },

  updateStatus: (id: string, status: Donation['status']): Donation | null => {
    let updated: Donation | null = null;
    dbStore.update((state) => {
      const idx = state.donations.findIndex((d) => d.id === id);
      if (idx !== -1) {
        state.donations[idx].status = status;
        state.donations[idx].updated_at = new Date().toISOString();
        updated = state.donations[idx];
      }
    });
    if (updated) {
      dbStore.syncDocument('donations', (updated as Donation).id, updated);
    }
    return updated;
  },
};

export const documentsRepo = {
  findAnnualReports: (options?: { status?: string }) => {
    let items = dbStore.getState().annualReports;
    if (options?.status) {
      items = items.filter((r) => r.status === options.status);
    }
    items.sort((a, b) => b.year - a.year);
    return items;
  },

  findDocuments: (options?: { visibility?: string; category?: string }) => {
    let items = dbStore.getState().documents;
    if (options?.visibility) {
      items = items.filter((d) => d.visibility === options.visibility);
    }
    if (options?.category) {
      items = items.filter((d) => d.category === options.category);
    }
    return items;
  },

  createDocument: (data: Omit<DocumentItem, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: DocumentItem = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.documents.push(newItem));
    dbStore.syncDocument('documents', newItem.id, newItem);
    return newItem;
  },

  createAnnualReport: (data: Omit<AnnualReport, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: AnnualReport = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    dbStore.update((state) => state.annualReports.push(newItem));
    dbStore.syncDocument('annualReports', newItem.id, newItem);
    return newItem;
  },
};

export { dbStore };

export const usersRepo = {
  findByEmail: (email: string) => {
    const normalized = email.toLowerCase().trim();
    return dbStore.getState().users.find((u) => u.email.toLowerCase() === normalized) || null;
  },

  findById: (id: string) => {
    return dbStore.getState().users.find((u) => u.id === id) || null;
  },

  findProfileByUserId: (userId: string) => {
    return dbStore.getState().adminProfiles.find((p) => p.userId === userId) || null;
  },

  create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    dbStore.update((state) => {
      state.users.push(newUser);
    });
    dbStore.syncDocument('users', newUser.id, newUser);
    return newUser;
  },

  updatePassword: (id: string, passwordHash: string, salt: string): User | null => {
    let updated: User | null = null;
    dbStore.update((state) => {
      const idx = state.users.findIndex((u) => u.id === id);
      if (idx !== -1) {
        state.users[idx].passwordHash = passwordHash;
        state.users[idx].salt = salt;
        state.users[idx].updatedAt = new Date().toISOString();
        updated = state.users[idx];
      }
    });
    if (updated) {
      dbStore.syncDocument('users', (updated as User).id, updated);
    }
    return updated;
  },

  findAll: (options?: {
    q?: string;
    role?: string;
    systemRole?: string;
    status?: string;
    verified?: boolean;
    page?: number;
    pageSize?: number;
  }) => {
    let users = [...dbStore.getState().users];
    if (options?.q) {
      const q = options.q.toLowerCase().trim();
      users = users.filter((u) => {
        const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
        return (
          fullName.includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.includes(q))
        );
      });
    }
    if (options?.role) {
      users = users.filter(
        (u) => u.role === options.role || u.registrationRole === options.role
      );
    }
    if (options?.systemRole) {
      users = users.filter((u) => {
        const sr =
          u.systemRole ||
          (u.role === 'super_admin' ? 'superadmin' : u.isStaff ? 'staff' : 'user');
        return sr === options.systemRole;
      });
    }
    if (options?.status) {
      users = users.filter((u) => {
        const st = u.status || (u.isActive ? 'active' : 'suspended');
        return st === options.status;
      });
    }
    if (options?.verified !== undefined) {
      users = users.filter((u) => Boolean(u.emailVerified) === options.verified);
    }
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return paginate(users, options?.page, options?.pageSize, '/api/v1/admin/users');
  },

  update: (id: string, data: Partial<User>): User | null => {
    let updated: User | null = null;
    dbStore.update((state) => {
      const idx = state.users.findIndex((u) => u.id === id);
      if (idx !== -1) {
        state.users[idx] = {
          ...state.users[idx],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        updated = state.users[idx];
      }
    });
    if (updated) {
      dbStore.syncDocument('users', id, updated);
    }
    return updated;
  },

  suspend: (id: string): User | null => {
    return usersRepo.update(id, { status: 'suspended', isActive: false });
  },

  reactivate: (id: string): User | null => {
    return usersRepo.update(id, { status: 'active', isActive: true });
  },

  delete: (id: string): boolean => {
    let deleted = false;
    dbStore.update((state) => {
      const idx = state.users.findIndex((u) => u.id === id);
      if (idx !== -1) {
        state.users.splice(idx, 1);
        deleted = true;
      }
    });
    if (deleted) {
      dbStore.deleteDocument('users', id);
    }
    return deleted;
  },

  changeSystemRole: (id: string, systemRole: 'user' | 'staff' | 'superadmin'): User | null => {
    const isStaff = systemRole === 'staff' || systemRole === 'superadmin';
    const role = systemRole === 'superadmin' ? 'super_admin' : systemRole === 'staff' ? 'admin' : 'volunteer';
    return usersRepo.update(id, { systemRole, isStaff, role });
  },
};

export const auditRepo = {
  log: (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const entry: AuditLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    dbStore.update((state) => state.auditLogs.push(entry));
    dbStore.syncDocument('auditLogs', entry.id, entry);
    return entry;
  },

  findAll: () => {
    return dbStore.getState().auditLogs;
  },

  findAllFiltered: (options?: {
    actorId?: string;
    action?: string;
    entityType?: string;
    page?: number;
    pageSize?: number;
  }) => {
    let logs = [...dbStore.getState().auditLogs];
    if (options?.actorId) {
      logs = logs.filter((l) => l.actor_user_id === options.actorId || l.actor_email === options.actorId);
    }
    if (options?.action) {
      logs = logs.filter((l) => l.action.toLowerCase().includes(options.action!.toLowerCase()));
    }
    if (options?.entityType) {
      logs = logs.filter((l) => l.entity_type.toLowerCase() === options.entityType!.toLowerCase());
    }
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return paginate(logs, options?.page, options?.pageSize, '/api/v1/admin/audit');
  },

  findById: (id: string) => {
    return dbStore.getState().auditLogs.find((l) => l.id === id) || null;
  },
};
