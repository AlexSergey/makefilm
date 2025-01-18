import { ArticlesEntity } from '@api/modules/articles/entities/articles.entity';
import { CreateArticleDto } from '@makefilm/contracts';
import { DataSource, QueryRunner } from 'typeorm';

export type Clean = () => Promise<void>;
export type Data = ArticlesEntity[];

interface CreateArticles {
  clean: Clean;
  data: Data;
  queryRunner: QueryRunner;
}

export const createArticles = async (dataSource: DataSource, arts: CreateArticleDto[]): Promise<CreateArticles> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  const articles: ArticlesEntity[] = [];

  for (const article of arts) {
    const art = queryRunner.manager.create(ArticlesEntity, article);
    await queryRunner.manager.save(ArticlesEntity, art);
    articles.push(art);
  }
  await queryRunner.release();

  return {
    clean: async (): Promise<void> => {
      await dataSource.manager.query(
        `TRUNCATE TABLE "${dataSource.getRepository(ArticlesEntity).metadata.tableName}" CASCADE`,
      );
    },
    data: articles,
    queryRunner,
  };
};

export const getLastId = async (dataSource: DataSource): Promise<string> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  const articles = await queryRunner.manager.find(ArticlesEntity);
  const id = articles[articles.length - 1].id;
  await queryRunner.manager.delete(ArticlesEntity, id);
  await queryRunner.release();

  return id;
};
