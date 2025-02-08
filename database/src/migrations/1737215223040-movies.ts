import { MigrationInterface, QueryRunner } from 'typeorm';

export class Movies1737215223040 implements MigrationInterface {
  name = 'Movies1737215223040';

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "genres_movies_movies" DROP CONSTRAINT "FK_813855b76fd64529ac88c52e1d4"`);
    await queryRunner.query(`ALTER TABLE "genres_movies_movies" DROP CONSTRAINT "FK_d745651ebd8ac2434f2838acacc"`);
    await queryRunner.query(`ALTER TABLE "directors_movies_movies" DROP CONSTRAINT "FK_91ed383441b53f9e59707296b7d"`);
    await queryRunner.query(`ALTER TABLE "directors_movies_movies" DROP CONSTRAINT "FK_74e264a37fa1b06447b0d9bf690"`);
    await queryRunner.query(`ALTER TABLE "actors_movies_movies" DROP CONSTRAINT "FK_1c41841d9b60ed2abb9a502b091"`);
    await queryRunner.query(`ALTER TABLE "actors_movies_movies" DROP CONSTRAINT "FK_825f14d1fd2d89acece8a93237c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_813855b76fd64529ac88c52e1d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d745651ebd8ac2434f2838acac"`);
    await queryRunner.query(`DROP TABLE "genres_movies_movies"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_91ed383441b53f9e59707296b7"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_74e264a37fa1b06447b0d9bf69"`);
    await queryRunner.query(`DROP TABLE "directors_movies_movies"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1c41841d9b60ed2abb9a502b09"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_825f14d1fd2d89acece8a93237"`);
    await queryRunner.query(`DROP TABLE "actors_movies_movies"`);
    await queryRunner.query(`DROP TABLE "movies"`);
    await queryRunner.query(`DROP TABLE "genres"`);
    await queryRunner.query(`DROP TABLE "directors"`);
    await queryRunner.query(`DROP TYPE "public"."directors_type_enum"`);
    await queryRunner.query(`DROP TABLE "actors"`);
    await queryRunner.query(`DROP TYPE "public"."actors_type_enum"`);
    await queryRunner.query(`DROP TABLE "creator"`);
    await queryRunner.query(`DROP TYPE "public"."creator_type_enum"`);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."creator_type_enum" AS ENUM('actor', 'director')`);
    await queryRunner.query(
      `CREATE TABLE "creator" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."creator_type_enum" array NOT NULL, CONSTRAINT "PK_43e489c9896f9eb32f7a0b912c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."actors_type_enum" AS ENUM('actor', 'director')`);
    await queryRunner.query(
      `CREATE TABLE "actors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."actors_type_enum" array NOT NULL, CONSTRAINT "PK_d8608598c2c4f907a78de2ae461" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."directors_type_enum" AS ENUM('actor', 'director')`);
    await queryRunner.query(
      `CREATE TABLE "directors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."directors_type_enum" array NOT NULL, CONSTRAINT "PK_a9ae28f00c93801aa034a2c1773" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "genres" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movies" ("description" text NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "thumbnail" character varying NOT NULL, "title" character varying NOT NULL, "year" integer NOT NULL, CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "actors_movies_movies" ("actorsId" uuid NOT NULL, "moviesId" uuid NOT NULL, CONSTRAINT "PK_97e424dee598a0c54f23be2db00" PRIMARY KEY ("actorsId", "moviesId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_825f14d1fd2d89acece8a93237" ON "actors_movies_movies" ("actorsId") `);
    await queryRunner.query(`CREATE INDEX "IDX_1c41841d9b60ed2abb9a502b09" ON "actors_movies_movies" ("moviesId") `);
    await queryRunner.query(
      `CREATE TABLE "directors_movies_movies" ("directorsId" uuid NOT NULL, "moviesId" uuid NOT NULL, CONSTRAINT "PK_6cf6472ce8ff3482dde72ebe709" PRIMARY KEY ("directorsId", "moviesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_74e264a37fa1b06447b0d9bf69" ON "directors_movies_movies" ("directorsId") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_91ed383441b53f9e59707296b7" ON "directors_movies_movies" ("moviesId") `);
    await queryRunner.query(
      `CREATE TABLE "genres_movies_movies" ("genresId" uuid NOT NULL, "moviesId" uuid NOT NULL, CONSTRAINT "PK_b4d48b1da32c35dbea0d3e440dd" PRIMARY KEY ("genresId", "moviesId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_d745651ebd8ac2434f2838acac" ON "genres_movies_movies" ("genresId") `);
    await queryRunner.query(`CREATE INDEX "IDX_813855b76fd64529ac88c52e1d" ON "genres_movies_movies" ("moviesId") `);
    await queryRunner.query(
      `ALTER TABLE "actors_movies_movies" ADD CONSTRAINT "FK_825f14d1fd2d89acece8a93237c" FOREIGN KEY ("actorsId") REFERENCES "actors"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "actors_movies_movies" ADD CONSTRAINT "FK_1c41841d9b60ed2abb9a502b091" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "directors_movies_movies" ADD CONSTRAINT "FK_74e264a37fa1b06447b0d9bf690" FOREIGN KEY ("directorsId") REFERENCES "directors"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "directors_movies_movies" ADD CONSTRAINT "FK_91ed383441b53f9e59707296b7d" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "genres_movies_movies" ADD CONSTRAINT "FK_d745651ebd8ac2434f2838acacc" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "genres_movies_movies" ADD CONSTRAINT "FK_813855b76fd64529ac88c52e1d4" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
