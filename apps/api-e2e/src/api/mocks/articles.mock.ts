import { Article } from '@api/modules/article/entities/article';
import { DataSource, QueryRunner } from 'typeorm';

export type Clean = () => Promise<void>;
export type Data = Article[];

interface Article {
  description: string;
  title: string;
}

interface CreateArticles {
  clean: Clean;
  data: Data;
  queryRunner: QueryRunner;
}

export const createArticles = async (dataSource: DataSource, arts: Article[]): Promise<CreateArticles> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  const articles: Article[] = [];

  for (const article of arts) {
    const art = queryRunner.manager.create(Article, article);
    await queryRunner.manager.save(Article, art);
    articles.push(art);
  }
  await queryRunner.release();

  return {
    clean: async (): Promise<void> => {
      await dataSource.manager.query(
        `TRUNCATE TABLE "${dataSource.getRepository(Article).metadata.tableName}" CASCADE`,
      );
    },
    data: articles,
    queryRunner,
  };
};

export const getLastId = async (dataSource: DataSource): Promise<string> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  const articles = await queryRunner.manager.find(Article);
  const id = articles[articles.length - 1].id;
  await queryRunner.manager.delete(Article, id);
  await queryRunner.release();

  return id;
};
