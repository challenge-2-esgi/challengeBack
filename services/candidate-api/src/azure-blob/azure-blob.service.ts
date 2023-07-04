import { BlobServiceClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { v4 as uuidV4 } from 'uuid';

export enum AccessType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Injectable()
export class AzureBlobService {
  constructor(private readonly configService: ConfigService) {}

  private getClient(fileName: string, container: string) {
    const client = BlobServiceClient.fromConnectionString(
      this.configService.get('AZURE_STORAGE_CONNECTION_STRING'),
    );
    client.url;
    const containerClient = client.getContainerClient(container);
    return containerClient.getBlockBlobClient(fileName);
  }

  private getContainer(access: AccessType) {
    if (access === AccessType.PRIVATE) {
      return this.configService.get('AZURE_BLOB_PRIVATE_CONTAINER');
    }
    return this.configService.get('AZURE_BLOB_PUBLIC_CONTAINER');
  }

  private getFileNameFromUrl(fileUrl: string) {
    return fileUrl.substring(fileUrl.lastIndexOf('/') + 1, fileUrl.length);
  }

  async uploadFile(file: Express.Multer.File, access: AccessType) {
    const container = this.getContainer(access);
    const uniqueId = uuidV4() + extname(file.originalname);
    const blobClient = this.getClient(uniqueId, container);
    try {
      await blobClient.uploadData(file.buffer);
    } catch (error) {
      throw new Error(error);
    }
    return blobClient.url;
  }

  async deleteFile(fileUrl: string, access: AccessType) {
    try {
      const container = this.getContainer(access);
      const client = this.getClient(
        this.getFileNameFromUrl(fileUrl),
        container,
      );
      await client.deleteIfExists();
    } catch (error) {}
  }
}
