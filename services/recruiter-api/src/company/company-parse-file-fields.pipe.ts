import {
  ArgumentMetadata,
  Injectable,
  MaxFileSizeValidator,
  PipeTransform,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

type Value = {
  logo: Express.Multer.File | null;
  images: Express.Multer.File[] | null;
};

const IMAGE_MAX_SIZE = 5 * (1024 * 1024); // 5Mb

@Injectable()
export class CompanyParseFileFieldsPipe implements PipeTransform {
  private isValid(file: Express.Multer.File) {
    const fileTypeValidator = {
      isValid: (file: Express.Multer.File) => {
        return file.mimetype.includes('image');
      },
    };

    const fileSizeValidator = new MaxFileSizeValidator({
      maxSize: IMAGE_MAX_SIZE,
    });

    if (!fileTypeValidator.isValid(file)) {
      throw new UnsupportedMediaTypeException();
    }

    if (!fileSizeValidator.isValid(file)) {
      throw new UnprocessableEntityException(
        'File size exceeds configured limit',
      );
    }

    return true;
  }

  transform(
    value: Record<string, Express.Multer.File[]>,
    metadata: ArgumentMetadata,
  ) {
    const newValue: Value = {
      logo: null,
      images: null,
    };

    const logo = value['logo'];
    const images = value['images'];
    if (logo !== undefined && logo.length > 0) {
      this.isValid(logo[0]);
      newValue.logo = logo[0];
    }
    if (images !== undefined && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        this.isValid(images[i]);
      }
      newValue.images = images;
    }

    return newValue;
  }
}
