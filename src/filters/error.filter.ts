import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.BAD_REQUEST) {
      console.error(error.stack);
    }

    if (status === HttpStatus.UNAUTHORIZED) {
      console.error(error.stack);
    }

    if (status === HttpStatus.NOT_FOUND) {
      console.error(error.stack);
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(error.stack);
    }

    return response.status(status).send(error);
  }
}
