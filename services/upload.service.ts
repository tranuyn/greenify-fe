import { apiClient } from 'lib/apiClient';
import type { ApiResponse } from 'types/common.types';
import type { MediaDto } from 'types/media.types';

export interface UploadFilePayload {
  uri: string;
  name?: string;
  type?: string;
}

export const uploadService = {
  async uploadFile(payload: UploadFilePayload): Promise<MediaDto> {
    const formData = new FormData();
    formData.append('file', {
      uri: payload.uri,
      name: payload.name ?? `upload-${Date.now()}.jpg`,
      type: payload.type ?? 'image/jpeg',
    } as any);
    const { data } = await apiClient.post<MediaDto>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
