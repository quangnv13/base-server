import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { MongoError, MongoParseError } from 'mongodb';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private static handleResponse(
    response: Response,
    exception: HttpException | Error | MongoError | MongoParseError,
  ): void {
    let responseBody: any = { message: 'Internal server error' };
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      responseBody = exception.getResponse();
      statusCode = exception.getStatus();
    } else {
      responseBody = {
        statusCode: statusCode,
        message: exception.message,
      };
    }
    response.status(statusCode).json(responseBody);
  }

  catch(
    exception: HttpException | Error | MongoError | MongoParseError,
    host: ArgumentsHost,
  ) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    // Handling error message and logging
    this.handleMessage(exception);

    // Response to client
    AllExceptionFilter.handleResponse(response, exception);
  }

  private handleMessage(
    exception: HttpException | Error | MongoError | MongoParseError,
  ) {
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      message = JSON.stringify(exception.getResponse());
    } else {
      message = exception.stack.toString();
    }
    Logger.error(message);
  }
}
