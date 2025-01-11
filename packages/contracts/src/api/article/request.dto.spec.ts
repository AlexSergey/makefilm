import { validate } from 'class-validator';

import { CreateArticleDto, UpdateArticleDto } from './request.dto';

describe('CreateArticleDto', () => {
  it('should validate a valid CreateArticleDto', async () => {
    const dto = new CreateArticleDto();
    dto.title = 'Valid Title';
    dto.description = 'Valid Description';

    const errors = await validate(dto);

    expect(errors.length).toBe(0); // не должно быть ошибок
  });

  it('should fail validation if title is empty', async () => {
    const dto = new CreateArticleDto();
    dto.title = '';
    dto.description = 'Valid Description';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation if description is empty', async () => {
    const dto = new CreateArticleDto();
    dto.title = 'Valid Title';
    dto.description = '';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });
});

describe('UpdateArticleDto', () => {
  it('should validate a valid UpdateArticleDto with optional fields', async () => {
    const dto = new UpdateArticleDto();
    dto.title = 'Valid Title';
    dto.description = 'Valid Description';

    const errors = await validate(dto);

    expect(errors.length).toBe(0); // не должно быть ошибок
  });

  it('should validate UpdateArticleDto with only title', async () => {
    const dto = new UpdateArticleDto();
    dto.title = 'Valid Title';

    const errors = await validate(dto);

    expect(errors.length).toBe(0); // не должно быть ошибок
  });

  it('should validate UpdateArticleDto with only description', async () => {
    const dto = new UpdateArticleDto();
    dto.description = 'Valid Description';

    const errors = await validate(dto);

    expect(errors.length).toBe(0); // не должно быть ошибок
  });

  it('should fail validation if title is empty', async () => {
    const dto = new UpdateArticleDto();
    dto.title = '';
    dto.description = 'Valid Description';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation if description is empty', async () => {
    const dto = new UpdateArticleDto();
    dto.title = 'Valid Title';
    dto.description = '';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });
});
