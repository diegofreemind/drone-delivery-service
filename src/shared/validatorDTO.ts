import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError, isNotEmptyObject } from 'class-validator';

export const validatorDto = async <T extends ClassConstructor<any>>(
  dto: T,
  obj: Object
) => {
  if (!isNotEmptyObject(obj)) {
    throw new Error('Empty Payload');
  }

  const targetClass = plainToInstance(dto, obj);
  const errors: ValidationError[] = await validate(targetClass);

  if (errors.length > 0) {
    const details = errors.map((error: ValidationError) => {
      if (error?.constraints) {
        return Object.values(error.constraints);
      }
    });

    throw new Error(details.join(', '));
  }
};
