import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Multer } from 'multer';

const s3 = new AWS.S3();

@Injectable()
export class UploadService {

    async singleUpload(file: Express.Multer.File) {
        const bucketPath = 'images/'
        return await this.uploadToBucket(file, process.env.AWS_S3_BUCKET_NAME || '', 'images/');
    }

    async arrayUpload(files: Array<Express.Multer.File>) {
        if (Array.isArray(files)) {
            const uploadPromises: any[] = [];
            for (const [index, file] of files.entries()) {
                const upload = this.uploadToBucket(file, process.env.AWS_S3_BUCKET_NAME || '', 'images/');
                uploadPromises.push(upload);
            }
            return Promise.all(uploadPromises)
                .then(res => {
                    console.log(res)
                    return res
                })
        }
        throw new BadRequestException('Files must be an Array')
    }

    async uploadToBucket(file: Express.Multer.File, bucketName: string, bucketPath: string = '') {
        return await s3.upload({
            Bucket: bucketName,
            Body: file.buffer,
            Key: `${bucketPath}${file.originalname}`
        }).promise();
    }
}
