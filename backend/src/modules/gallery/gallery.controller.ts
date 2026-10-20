import { Request, Response } from 'express';
import { galleryRepo, auditRepo } from '../../db';
import { sendSuccess, sendPaginated, sendError } from '../../utils/response';

export const galleryController = {
  getAlbums: async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.page_size ? parseInt(req.query.page_size as string, 10) : 20;

    const result = galleryRepo.findAlbums({
      status: 'published',
      page,
      pageSize,
    });

    sendPaginated(res, result.data, result.meta);
  },

  getAlbumById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const album = galleryRepo.findAlbumById(id);

    if (!album || album.status !== 'published') {
      sendError(res, 404, 'not_found', 'Gallery album not found.');
      return;
    }

    sendSuccess(res, album);
  },

  getAlbumImages: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const album = galleryRepo.findAlbumById(id);

    if (!album || album.status !== 'published') {
      sendError(res, 404, 'not_found', 'Gallery album not found.');
      return;
    }

    const images = galleryRepo.findImagesByAlbumId(id);
    sendSuccess(res, images);
  },

  createAlbum: async (req: Request, res: Response): Promise<void> => {
    const created = galleryRepo.createAlbum(req.body);

    if (req.user) {
      auditRepo.log({
        actor_user_id: req.user.userId,
        actor_email: req.user.email,
        action: 'create_gallery_album',
        entity_type: 'GalleryAlbum',
        entity_id: created.id,
        details: { title: created.title },
      });
    }

    sendSuccess(res, created, 201);
  },

  createImage: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const album = galleryRepo.findAlbumById(id);
    if (!album) {
      sendError(res, 404, 'not_found', 'Gallery album not found.');
      return;
    }

    const created = galleryRepo.createImage({
      album_id: id,
      image_url: req.body.image_url,
      caption: req.body.caption,
      alt_text: req.body.alt_text,
      display_order: req.body.display_order ?? 0,
    });

    sendSuccess(res, created, 201);
  },
};
