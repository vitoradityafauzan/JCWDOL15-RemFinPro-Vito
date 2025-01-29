import { Request } from 'express';
import multer from 'multer';
import path from 'path';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const uploader = (filePrefix: string, folderName?: string) => {
  const defaultDir = path.join(__dirname, '../../public');

  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback,
    ) => {
      const destination = folderName ? defaultDir + folderName : defaultDir;
      cb(null, destination);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback,
    ) => {
      const originalNameParts = file.originalname.split('.');
      const fileExtension = originalNameParts[originalNameParts.length - 1];
      const newFileName = filePrefix + Date.now() + '.' + fileExtension;
      cb(null, newFileName);
    },
  });

  const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error('Only .jpg, .jpeg, .gif, and .png formats are allowed!'),
        false,
      );
    }
  };
  return multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter,
  });
};
