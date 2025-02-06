import { MigrationInterface, QueryRunner } from 'typeorm';

export class Articles1737214515704 implements MigrationInterface {
  name = 'Articles1737214515704';

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "articles"`);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "articles" ("createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "description" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`,
    );
  }
}
