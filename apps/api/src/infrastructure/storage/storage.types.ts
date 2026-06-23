export interface StoredFile {
  url: string;
  provider: "cloudinary" | "local";
  publicId?: string;
  bytes: number;
  originalName: string;
  mimeType: string;
}

export interface FileStorage {
  saveResumeFile(
    file: Express.Multer.File,
    ownerId: string
  ): Promise<StoredFile>;

  saveGeneratedFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    ownerId: string,
    folder: string
  ): Promise<StoredFile>;

  deleteFile(
    file: StoredFile
  ): Promise<void>;
}

// export interface StorageProvider {
//   upload(
//     key: string,
//     buffer: Buffer,
//     mimeType: string
//   ): Promise<string>;

//   delete?(key: string): Promise<void>;
// }
