import { Router } from 'express';
import { galleryController } from './gallery.controller';
import { validateRequest } from '../../middleware/validate';
import { createAlbumSchema, createImageSchema } from './gallery.schema';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/albums', galleryController.getAlbums);
router.get('/albums/', galleryController.getAlbums);
router.get('/albums/:id', galleryController.getAlbumById);
router.get('/albums/:id/', galleryController.getAlbumById);
router.get('/albums/:id/images', galleryController.getAlbumImages);
router.get('/albums/:id/images/', galleryController.getAlbumImages);

export const adminGalleryRouter = Router();
adminGalleryRouter.use(authenticate, authorize(['content_editor']));

adminGalleryRouter.post('/albums', validateRequest({ body: createAlbumSchema }), galleryController.createAlbum);
adminGalleryRouter.post('/albums/', validateRequest({ body: createAlbumSchema }), galleryController.createAlbum);
adminGalleryRouter.post('/albums/:id/images', validateRequest({ body: createImageSchema }), galleryController.createImage);
adminGalleryRouter.post('/albums/:id/images/', validateRequest({ body: createImageSchema }), galleryController.createImage);

export default router;
