import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auth1740232896232 implements MigrationInterface {
  name = 'Auth1740232896232';

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TYPE "public"."sessions_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."sessions_authprovider_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'moderator', 'notconfirmed', 'unauthorized', 'user')`,
    );
    await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'not_active')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "email" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'notconfirmed', "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "username" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."sessions_authprovider_enum" AS ENUM('google', 'local')`);
    await queryRunner.query(`CREATE TYPE "public"."sessions_status_enum" AS ENUM('active', 'not_active')`);
    await queryRunner.query(
      `CREATE TABLE "sessions" ("authProvider" "public"."sessions_authprovider_enum" NOT NULL DEFAULT 'local', "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ip" character varying NOT NULL, "lat" real NOT NULL, "lng" real NOT NULL, "status" "public"."sessions_status_enum" NOT NULL DEFAULT 'active', "token" character varying NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userAgent" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
