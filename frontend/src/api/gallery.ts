import apiClient from './client'
import type { GalleryAlbum, GalleryImage, PaginatedResponse } from '../types'

export interface GetAlbumsParams {
  page?: number
  page_size?: number
}

export const getGalleryAlbums = async (params?: GetAlbumsParams): Promise<PaginatedResponse<GalleryAlbum>> => {
  const response = await apiClient.get<PaginatedResponse<GalleryAlbum>>('/gallery/albums/', { params })
  return response.data
}

export const getGalleryAlbumById = async (id: string): Promise<GalleryAlbum> => {
  const response = await apiClient.get<{ data: GalleryAlbum }>(`/gallery/albums/${id}/`)
  return response.data.data
}

export const getGalleryAlbumImages = async (albumId: string): Promise<GalleryImage[]> => {
  const response = await apiClient.get<{ data: GalleryImage[] }>(`/gallery/albums/${albumId}/images/`)
  return response.data.data
}
