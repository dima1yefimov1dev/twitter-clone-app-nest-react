import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getDownloadURL } from 'firebase-admin/storage';

@Injectable()
export class FirebaseStorageService {
  storage;
  bucket;

  constructor() {
    this.storage = admin.storage();
    this.bucket = this.storage.bucket();
  }

  async uploadImage(
    buffer: Buffer,
    fileName: string,
    folderName: string,
  ): Promise<string> {
    try {
      const metadata = {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000',
      };
      const fileRef = this.bucket.file(`${folderName}/${fileName}`);

      await fileRef.save(buffer, { metadata });
      const imgUrl = await getDownloadURL(fileRef);
      return imgUrl;
    } catch (error) {
      console.error('File upload error:', error);
      throw new HttpException('File upload error', HttpStatus.BAD_REQUEST);
    }
  }

  async uploadOrUpdateUserAvatar(
    buffer: Buffer,
    fileName: string,
    uid: string,
  ) {
    const folderName = `users-avatars/${uid}`;
    const existingFiles = await this.bucket.getFiles({ prefix: folderName });

    if (existingFiles[0].length > 0) {
      await existingFiles[0][0].delete();
    }

    return await this.uploadImage(buffer, fileName, folderName);
  }

  async uploadPostFile(
    buffer: Buffer,
    fileName: string,
    uid: string,
    postId: string,
  ) {
    const foldername = `posts/${uid}/${postId}`;

    return await this.uploadImage(buffer, fileName, foldername);
  }
}
