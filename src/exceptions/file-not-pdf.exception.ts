import { BadRequestException } from '@nestjs/common';

export class FileNotPdfException extends BadRequestException {
  constructor(error?: string) {
    super('error.fileNotPdf', error);
  }
}
