import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as admin from 'firebase-admin';
import { uploadFileHelper } from './upload-file';

const s3 = new AWS.S3();

@Injectable()
export class StorageService {

    async uploadFile(file: Express.Multer.File): Promise<string> {
        return await uploadFileHelper(admin.storage(), file);
      }
    
      async deleteFile(key: string) {
        const bucket = admin.storage().bucket(process.env.BUCKET);
        try {
          bucket.file(key).delete();
        } catch (err) {
          console.log(err);
          return false;
        }
        return true;
      }
    
      async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
        const urls: string[] = [];
        files.map(async (file: Express.Multer.File) => {
          urls.push(await uploadFileHelper(admin.storage(), file));
        });
        return await urls;
      }
}
