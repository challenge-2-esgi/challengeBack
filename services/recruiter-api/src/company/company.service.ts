import { Injectable } from '@nestjs/common';
import {
  AccessType,
  AzureBlobService,
} from 'src/azure-blob/azure-blob.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private azureBlobService: AzureBlobService,
  ) {}

  private exclude<Company, Key extends keyof Company>(
    company: Company,
    keys: Key[],
  ): Omit<Company, Key> {
    return Object.fromEntries(
      Object.entries(company).filter(([key]) => !keys.includes(key as Key)),
    ) as Omit<Company, Key>;
  }

  async create(
    dto: CreateCompanyDto,
    ownerId: string,
    logo: Express.Multer.File | null,
    images: Express.Multer.File[] | null,
  ) {
    let logoUrl = null;
    if (logo != null) {
      logoUrl = await this.azureBlobService.uploadFile(logo, AccessType.PUBLIC);
    }

    let imageUrls = [];
    if (images != null) {
      imageUrls = await this.azureBlobService.uploadFiles(
        images,
        AccessType.PUBLIC,
      );
    }

    const address = {
      streetNumber: dto.streetNumber,
      street: dto.street,
      city: dto.city,
      postcode: dto.postcode,
      state: dto.state,
      country: dto.country,
    };
    const company = await this.prisma.company.create({
      data: {
        name: dto.name,
        siren: dto.siren,
        website: dto.website,
        logo: logoUrl,
        images: imageUrls,
        size: dto.size,
        sector: dto.sector,
        description: dto.description,
        motivation: dto.motivation,
        ownerId: ownerId,
        address: {
          create: address,
        },
      },
      include: {
        address: true,
      },
    });

    return this.exclude(company, ['addressId']);
  }

  async findAll() {
    const companies = await this.prisma.company.findMany({
      include: { address: true },
    });

    return companies.map((company) => this.exclude(company, ['addressId']));
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        address: true,
      },
    });
    return this.exclude(company, ['addressId']);
  }

  async findByOwnerId(ownerId: string) {
    const company = await this.prisma.company.findFirstOrThrow({
      where: {
        ownerId: ownerId,
      },
      include: {
        address: true,
      },
    });
    return this.exclude(company, ['addressId']);
  }

  async update(
    id: string,
    dto: UpdateCompanyDto,
    logo: Express.Multer.File | null,
    images: Express.Multer.File[] | null,
  ) {
    const address = {
      streetNumber: dto.streetNumber,
      street: dto.street,
      city: dto.city,
      postcode: dto.postcode,
      state: dto.state,
      country: dto.country,
    };

    const company = await this.prisma.company.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    // update logo
    let logoUrl = company.logo;
    if (dto.removeLogo) {
      company.logo !== null &&
        (await this.azureBlobService.deleteFile(
          company.logo,
          AccessType.PUBLIC,
        ));
    }

    if (logo !== null) {
      logoUrl = await this.azureBlobService.uploadFile(logo, AccessType.PUBLIC);
    }

    // update images
    let imageUrls = company.images;
    if (dto.removeImages) {
      company.images.length > 0 &&
        (await this.azureBlobService.deleteFiles(
          company.images.map((image) => image.toString()),
          AccessType.PUBLIC,
        ));
    }

    if (images !== null) {
      imageUrls = await this.azureBlobService.uploadFiles(
        images,
        AccessType.PUBLIC,
      );
    }

    const updatedCompany = await this.prisma.company.update({
      where: {
        id: id,
      },
      data: {
        name: dto.name,
        siren: dto.siren,
        website: dto.website,
        size: dto.size,
        sector: dto.sector,
        description: dto.description,
        motivation: dto.motivation,
        ownerId: company.ownerId,
        logo: logoUrl,
        images: imageUrls,
        address: {
          update: address,
        },
      },
      include: {
        address: true,
      },
    });

    return this.exclude(updatedCompany, ['addressId']);
  }

  async remove(id: string) {
    const deletedCompany = await this.prisma.company.delete({
      where: {
        id: id,
      },
    });
    await this.prisma.address.delete({
      where: {
        id: deletedCompany.addressId,
      },
      include: {
        companies: true,
      },
    });
    if (deletedCompany.logo != null) {
      await this.azureBlobService.deleteFile(
        deletedCompany.logo,
        AccessType.PUBLIC,
      );
    }
    if (deletedCompany.images != null) {
      const imageUrls = deletedCompany.images.map((imageUrl) =>
        imageUrl.toString(),
      );
      await this.azureBlobService.deleteFiles(imageUrls, AccessType.PUBLIC);
    }
  }
}
