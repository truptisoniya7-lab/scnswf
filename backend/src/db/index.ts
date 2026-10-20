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
    return newItem;
  },

  findAllPartnership: () => {
    return dbStore.getState().partnershipRequests.filter((a) => !a.is_deleted);
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
          state.newsletterSubscribers.push({
            id: crypto.randomUUID(),
            email: data.email,
            subscribed_at: new Date().toISOString(),
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    });
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

  updateStatus: (id: string, status: Donation['status']) => {
    let updated: Donation | null = null;
    dbStore.update((state) => {
      const idx = state.donations.findIndex((d) => d.id === id);
      if (idx !== -1) {
        state.donations[idx].status = status;
        state.donations[idx].updated_at = new Date().toISOString();
        updated = state.donations[idx];
      }
    });
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
};

export const auditRepo = {
  log: (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const entry: AuditLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    dbStore.update((state) => state.auditLogs.push(entry));
    return entry;
  },

  findAll: () => {
    return dbStore.getState().auditLogs;
  },
};
