import { useMutation } from '@tanstack/react-query';
import { uploadService } from 'services/upload.service';
import type { UploadFilePayload } from 'services/upload.service';

export const useUpload = () => {
  return useMutation({
    mutationFn: (payload: UploadFilePayload) => uploadService.uploadFile(payload),
  });
};
