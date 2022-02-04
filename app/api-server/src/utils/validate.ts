import { Type, ValidationPipe } from '@nestjs/common';

const validationPipe = new ValidationPipe({
  transform: true,
  skipMissingProperties: true,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validate = async (value: any, type: Type<any>): Promise<any> => {
  return await validationPipe.transform(value, {
    type: 'param',
    metatype: type,
  });
};
