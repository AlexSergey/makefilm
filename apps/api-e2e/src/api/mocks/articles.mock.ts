import { ArticleEntity } from '@api/modules/article/entities/article.entity';
import { DataSource, QueryRunner } from 'typeorm';

export type Clean = () => Promise<void>;
export type Data = ArticleEntity[];

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
  const articles: ArticleEntity[] = [];

  for (const article of arts) {
    const art = queryRunner.manager.create(ArticleEntity, article);
    await queryRunner.manager.save(ArticleEntity, art);
    articles.push(art);
  }
  await queryRunner.release();

  return {
    clean: async (): Promise<void> => {
      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      const arts = await queryRunner.manager.find(ArticleEntity);

      for (const a of arts) {
        await queryRunner.manager.delete(ArticleEntity, a.id);
      }

      await queryRunner.release();
    },
    data: articles,
    queryRunner,
  };
};

export const getLastId = async (dataSource: DataSource): Promise<string> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  const articles = await queryRunner.manager.find(ArticleEntity);
  const id = articles[articles.length - 1].id;
  await queryRunner.manager.delete(ArticleEntity, id);
  await queryRunner.release();

  return id;
};
