import { useQuery } from '@tanstack/react-query'
import { getGalleryAlbums, getGalleryAlbumImages, GetAlbumsParams } from '../api/gallery'

export const useGalleryAlbums = (params?: GetAlbumsParams) => {
  return useQuery({
    queryKey: ['gallery-albums', params],
    queryFn: () => getGalleryAlbums(params),
  })
}

export const useGalleryAlbumImages = (albumId: string) => {
  return useQuery({
    queryKey: ['gallery-album-images', albumId],
    queryFn: () => getGalleryAlbumImages(albumId),
    enabled: Boolean(albumId),
  })
}
