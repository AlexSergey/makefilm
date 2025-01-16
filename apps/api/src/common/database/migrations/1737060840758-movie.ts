import { MigrationInterface, QueryRunner } from 'typeorm';

export class Movie1737060840758 implements MigrationInterface {
  name = 'Movie1737060840758';

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "genre_movies_movie" DROP CONSTRAINT "FK_e59764a417d4f8291747b744faa"`);
    await queryRunner.query(`ALTER TABLE "genre_movies_movie" DROP CONSTRAINT "FK_dff457c114a6294863814818b0f"`);
    await queryRunner.query(`ALTER TABLE "director_movies_movie" DROP CONSTRAINT "FK_68d8bb20a8b3e6a839e1f651115"`);
    await queryRunner.query(`ALTER TABLE "director_movies_movie" DROP CONSTRAINT "FK_e65748d9ee8d8c1b87984a58f2e"`);
    await queryRunner.query(`ALTER TABLE "actor_movies_movie" DROP CONSTRAINT "FK_45708bd514560bac8a3a54470d5"`);
    await queryRunner.query(`ALTER TABLE "actor_movies_movie" DROP CONSTRAINT "FK_48fa78b2634b01bf58ad1686ef5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e59764a417d4f8291747b744fa"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_dff457c114a6294863814818b0"`);
    await queryRunner.query(`DROP TABLE "genre_movies_movie"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_68d8bb20a8b3e6a839e1f65111"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e65748d9ee8d8c1b87984a58f2"`);
    await queryRunner.query(`DROP TABLE "director_movies_movie"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_45708bd514560bac8a3a54470d"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_48fa78b2634b01bf58ad1686ef"`);
    await queryRunner.query(`DROP TABLE "actor_movies_movie"`);
    await queryRunner.query(`DROP TABLE "articles"`);
    await queryRunner.query(`DROP TABLE "movie"`);
    await queryRunner.query(`DROP TABLE "genre"`);
    await queryRunner.query(`DROP TABLE "director"`);
    await queryRunner.query(`DROP TYPE "public"."director_type_enum"`);
    await queryRunner.query(`DROP TABLE "actor"`);
    await queryRunner.query(`DROP TYPE "public"."actor_type_enum"`);
    await queryRunner.query(`DROP TABLE "creator"`);
    await queryRunner.query(`DROP TYPE "public"."creator_type_enum"`);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."creator_type_enum" AS ENUM('actor', 'director')`);
    await queryRunner.query(
      `CREATE TABLE "creator" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."creator_type_enum" array NOT NULL, CONSTRAINT "PK_43e489c9896f9eb32f7a0b912c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."actor_type_enum" AS ENUM('actor', 'director')`);
    await queryRunner.query(
      `CREATE TABLE "actor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."actor_type_enum" array NOT NULL, CONSTRAINT "PK_05b325494fcc996a44ae6928e5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."director_type_enum" AS ENUM('actor', 'director')`);
    await queryRunner.query(
      `CREATE TABLE "director" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."director_type_enum" array NOT NULL, CONSTRAINT "PK_b85b179882f31c43324ef124fea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "genre" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movie" ("description" text NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "thumbnail" character varying NOT NULL, "title" character varying NOT NULL, "year" integer NOT NULL, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "articles" ("createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "description" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "actor_movies_movie" ("actorId" uuid NOT NULL, "movieId" uuid NOT NULL, CONSTRAINT "PK_bb8e9dcbccde7d3edd9383fb25a" PRIMARY KEY ("actorId", "movieId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_48fa78b2634b01bf58ad1686ef" ON "actor_movies_movie" ("actorId") `);
    await queryRunner.query(`CREATE INDEX "IDX_45708bd514560bac8a3a54470d" ON "actor_movies_movie" ("movieId") `);
    await queryRunner.query(
      `CREATE TABLE "director_movies_movie" ("directorId" uuid NOT NULL, "movieId" uuid NOT NULL, CONSTRAINT "PK_1ed70efdc7409b799405d4a9096" PRIMARY KEY ("directorId", "movieId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_e65748d9ee8d8c1b87984a58f2" ON "director_movies_movie" ("directorId") `);
    await queryRunner.query(`CREATE INDEX "IDX_68d8bb20a8b3e6a839e1f65111" ON "director_movies_movie" ("movieId") `);
    await queryRunner.query(
      `CREATE TABLE "genre_movies_movie" ("genreId" uuid NOT NULL, "movieId" uuid NOT NULL, CONSTRAINT "PK_5b787840ea6352039c37c32e8f0" PRIMARY KEY ("genreId", "movieId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_dff457c114a6294863814818b0" ON "genre_movies_movie" ("genreId") `);
    await queryRunner.query(`CREATE INDEX "IDX_e59764a417d4f8291747b744fa" ON "genre_movies_movie" ("movieId") `);
    await queryRunner.query(
      `ALTER TABLE "actor_movies_movie" ADD CONSTRAINT "FK_48fa78b2634b01bf58ad1686ef5" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "actor_movies_movie" ADD CONSTRAINT "FK_45708bd514560bac8a3a54470d5" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "director_movies_movie" ADD CONSTRAINT "FK_e65748d9ee8d8c1b87984a58f2e" FOREIGN KEY ("directorId") REFERENCES "director"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "director_movies_movie" ADD CONSTRAINT "FK_68d8bb20a8b3e6a839e1f651115" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "genre_movies_movie" ADD CONSTRAINT "FK_dff457c114a6294863814818b0f" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "genre_movies_movie" ADD CONSTRAINT "FK_e59764a417d4f8291747b744faa" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
