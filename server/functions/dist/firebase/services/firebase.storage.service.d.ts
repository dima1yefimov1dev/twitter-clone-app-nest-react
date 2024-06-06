/// <reference types="node" />
export declare class FirebaseStorageService {
    storage: any;
    bucket: any;
    constructor();
    uploadImage(buffer: Buffer, fileName: string, folderName: string): Promise<string>;
    uploadOrUpdateUserAvatar(buffer: Buffer, fileName: string, uid: string): Promise<string>;
    uploadPostFile(buffer: Buffer, fileName: string, uid: string, postId: string): Promise<string>;
}
