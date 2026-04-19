import { apiClient } from 'lib/apiClient';
import type { MediaDto } from 'types/media.types';

export interface UploadFilePayload {
  uri: string;
  name?: string;
  type?: string;
}

export const uploadService = {
  async uploadFile(payload: UploadFilePayload): Promise<MediaDto> {
    try {
      const formData = new FormData();
      formData.append('files', {
        uri: payload.uri,
        name: payload.name ?? `upload-${Date.now()}.jpg`,
        type: payload.type ?? 'image/jpeg',
      } as any);

      const { data } = await apiClient.post<MediaDto[]>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => data,
      });
      const uploadedFile = data?.[0];

      if (!uploadedFile) {
        throw new Error('Upload response is empty');
      }

      return uploadedFile;
    } catch (error: any) {
      console.error('Upload file failed:', error?.response?.data || error.message || error);
      throw error;
    }
  },
};
