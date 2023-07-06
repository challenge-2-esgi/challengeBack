import {
  ArgumentMetadata,
  Injectable,
  MaxFileSizeValidator,
  PipeTransform,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

type Value = Express.Multer.File | null;

const IMAGE_MAX_SIZE = 5 * (1024 * 1024); // 5Mb

@Injectable()
export class ApplicationsParseFileFieldsPipe implements PipeTransform {
  private isValid(file: Express.Multer.File) {
    const fileTypeValidator = {
      isValid: (file: Express.Multer.File) => {
        return (
          file.mimetype.includes('image') ||
          file.mimetype.includes('application/pdf')
        );
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

  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    let newValue: Value = null;

    const file = value;
    if (file !== undefined) {
      this.isValid(file);
      newValue = file;
    }
    return newValue;
  }
}
