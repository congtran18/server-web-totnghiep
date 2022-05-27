import { storage } from 'firebase-admin';
import { v4 as uuid } from 'uuid';

export const uploadFileHelper = async (
  storage: storage.Storage,
  file: Express.Multer.File,
) => {
  const bucket = storage.bucket(process.env.BUCKET);
  const fileName = `${Date.now()}-${uuid()}.${file.originalname
    .split('.')
    .pop()}`;

  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({ resumable: false });
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`;
  await blobStream.end(file.buffer);
  return publicUrl;
};
