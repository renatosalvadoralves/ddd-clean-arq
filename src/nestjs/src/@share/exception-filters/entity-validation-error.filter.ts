import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EntityValidationError } from 'mycore/shared/domain';
import { Response } from 'express';
import { union, values } from 'lodash';

@Catch(EntityValidationError)
export class EntityValidationErrorFilter implements ExceptionFilter {
  catch(exception: EntityValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = 422;

    response.status(statusCode).json({
      statusCode,
      error: 'Unprocessable Entity',
      message: union(...values(exception.error)),
    });
  }
}
