import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";
import type { FileStorage, StoredFile } from "./storage.types.js";

class ResumeFileStorage implements FileStorage {
  async saveResumeFile(file: Express.Multer.File, ownerId: string): Promise<StoredFile> {
    if (this.hasCloudinaryConfig()) {
      return this.saveToCloudinary(file, ownerId);
    }
    return this.saveLocally(file, ownerId);
  }

  async deleteFile(file: StoredFile): Promise<void> {
    if (file.provider === "cloudinary" && file.publicId) {
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: "raw",
      });
      return;
    }

    if (file.provider === "local") {
      const localPath = file.url.replace(/^local:\/\//, "");
      await rm(localPath, { force: true });
    }
  }

  private async saveLocally(file: Express.Multer.File, ownerId: string): Promise<StoredFile> {
    const uploadRoot = path.resolve(env.LOCAL_UPLOAD_DIR, "resumes", ownerId);
    await mkdir(uploadRoot, { recursive: true });

    const fileHash = createHash("sha256")
      .update(file.buffer)
      .update(file.originalname)
      .digest("hex")
      .slice(0, 24);

    const extension = path.extname(file.originalname) || ".pdf";

    const filePath = path.join(uploadRoot, `${fileHash}${extension}`);

    await writeFile(filePath, file.buffer);

    return {
      url: `local://${filePath}`,
      provider: "local",
      bytes: file.size,
      originalName: file.originalname,
      mimeType: file.mimetype,
    };
  }

  async saveGeneratedFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    ownerId: string,
    folder: string
  ): Promise<StoredFile> {
    if (this.hasCloudinaryConfig()) {
      return this.saveGeneratedToCloudinary(buffer, fileName, mimeType, ownerId, folder);
    }

    return this.saveGeneratedLocally(buffer, fileName, mimeType, ownerId, folder);
  }

  private async saveGeneratedLocally(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    ownerId: string,
    folder: string
  ): Promise<StoredFile> {
    const uploadRoot = path.resolve(env.LOCAL_UPLOAD_DIR, folder, ownerId);
    await mkdir(uploadRoot, { recursive: true });

    const filePath = path.join(uploadRoot, fileName);

    await writeFile(filePath, buffer);

    return {
      url: `local://${filePath}`,
      provider: "local",
      bytes: buffer.length,
      originalName: fileName,
      mimeType,
    };
  }

  private async saveGeneratedToCloudinary(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    ownerId: string,
    folder: string
  ): Promise<StoredFile> {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });

    const ext = path.extname(fileName).replace(".", "");
    const baseName = path.parse(fileName).name;

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      bytes: number;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `career-os/${folder}/${ownerId}`,
          resource_type: "raw",
          public_id: `${baseName}.${ext}`, // 🔥 IMPORTANT FIX
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }
          resolve(uploadResult);
        }
      );

      stream.end(buffer);
    });

    return {
      url: result.secure_url,
      provider: "cloudinary",
      publicId: result.public_id,
      bytes: result.bytes,
      originalName: fileName,
      mimeType,
    };
  }

  private async saveToCloudinary(file: Express.Multer.File, ownerId: string): Promise<StoredFile> {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });

    const ext = path.extname(file.originalname).replace(".", "");
    const baseName = path.parse(file.originalname).name;

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      bytes: number;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `career-os/resumes/${ownerId}`,
          resource_type: "raw",
          public_id: `${baseName}.${ext}`, // 🔥 FIXED
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }
          resolve(uploadResult);
        }
      );

      stream.end(file.buffer);
    });

    return {
      url: result.secure_url,
      provider: "cloudinary",
      publicId: result.public_id,
      bytes: result.bytes,
      originalName: file.originalname,
      mimeType: file.mimetype,
    };
  }

  private hasCloudinaryConfig() {
    return Boolean(
      env.CLOUDINARY_CLOUD_NAME &&
        env.CLOUDINARY_API_KEY &&
        env.CLOUDINARY_API_SECRET
    );
  }
}

export const resumeFileStorage = new ResumeFileStorage();