import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { DataTable, Column } from '../../components/DataTable';
import { StatusPill } from '../../components/StatusPill';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { usePermissions } from '../../hooks/usePermissions';
import { adminApi } from '../../api/adminApi';

type ContentType = 'programs' | 'events' | 'gallery' | 'stories';

export default function ContentPage() {
  const { isSuperadmin } = usePermissions();
  const [activeType, setActiveType] = useState<ContentType>('programs');
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // New item modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({
    isOpen: false,
    id: '',
    title: '',
  });

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.listContent(activeType);
      setItems(data || []);
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [activeType]);

  const handleDelete = async () => {
    try {
      await adminApi.deleteContent(activeType, confirmDialog.id);
      setConfirmDialog({ isOpen: false, id: '', title: '' });
      fetchContent();
    } catch (err) {
      console.error('Failed to delete content:', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      const autoSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let payload: any = {
        title: title.trim(),
        status,
      };

      if (activeType === 'programs') {
        payload = {
          ...payload,
          slug: autoSlug,
          summary: description.slice(0, 150),
          description: description,
          problem_addressed: 'Health disparities in underserved communities.',
          geographical_coverage: 'Odisha and eastern districts',
          cover_image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
          display_order: items.length + 1,
        };
      } else if (activeType === 'events') {
        payload = {
          ...payload,
          slug: autoSlug,
          description: description,
          location: 'Bhubaneswar, Odisha',
          start_datetime: new Date().toISOString(),
          end_datetime: new Date(Date.now() + 86400000).toISOString(),
        };
      } else if (activeType === 'gallery') {
        payload = {
          ...payload,
          description: description,
        };
      } else if (activeType === 'stories') {
        payload = {
          ...payload,
          slug: autoSlug,
          summary: description.slice(0, 150),
          body: description,
          published_at: new Date().toISOString(),
          cover_image_url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
        };
      }

      await adminApi.createContent(activeType, payload);
      setIsAddModalOpen(false);
      setTitle('');
      setDescription('');
      setSlug('');
      fetchContent();
    } catch (err) {
      console.error('Failed to create content item:', err);
      alert('Failed to create content item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Title',
      cell: (row) => (
        <div>
          <div className="font-semibold text-white">{row.title}</div>
          {row.slug && <div className="text-[10px] text-zinc-500 font-mono">/{row.slug}</div>}
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusPill status={row.status || 'published'} size="sm" />,
    },
    {
      header: 'Created',
      cell: (row) => (
        <span className="text-zinc-400 text-xs">
          {new Date(row.created_at || row.createdAt || Date.now()).toLocaleDateString()}
        </span>
      ),
    },
    ...(isSuperadmin
      ? [
          {
            header: 'Actions',
            className: 'w-20 text-right',
            cell: (row: any) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDialog({
                    isOpen: true,
                    id: row.id,
                    title: row.title,
                  });
                }}
                className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                title="Delete item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white font-heading">
            Website Content Management
          </h2>
          <p className="text-xs text-zinc-400">
            Publish, edit, and organize healthcare programs, community events, and stories
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/10 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New {activeType.slice(0, -1)}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[rgba(110,231,183,0.12)] gap-4 text-xs font-semibold">
        {(['programs', 'events', 'gallery', 'stories'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`pb-3 capitalize transition-colors ${
              activeType === type
                ? 'border-b-2 border-emerald-400 text-emerald-300'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {type === 'stories' ? 'Impact Stories' : type}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage={`No ${activeType} found.`}
      />

      {/* Create Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-[rgba(110,231,183,0.2)] bg-[#071f14] shadow-2xl p-6 text-zinc-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white font-heading capitalize">
                Add New {activeType.slice(0, -1)}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title..."
                  className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] p-2.5 text-zinc-200 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-from-title"
                  className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] p-2.5 text-zinc-200 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Description / Content
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description..."
                  className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] p-2.5 text-zinc-200 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Publishing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-[rgba(110,231,183,0.18)] bg-[#04140c] p-2.5 text-zinc-200 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="published">Published (Visible on site)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/40 text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  {isSubmitting ? 'Saving...' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Content Item"
        message={`Are you sure you want to permanently delete "${confirmDialog.title}"?`}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: '', title: '' })}
      />
    </div>
  );
}
