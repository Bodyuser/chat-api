import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1686758045597 implements MigrationInterface {
    name = 'NewMigration1686758045597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "online" boolean NOT NULL DEFAULT true, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "avatar_path" character varying NOT NULL DEFAULT '/uploads/user.png', "socketId" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dialogs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_75ffe676a97ca2eb5510ec88b11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "userId" integer, "dialogId" integer, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "member_dialog" ("member_id" integer NOT NULL, "dialog_id" integer NOT NULL, CONSTRAINT "PK_291a77439fa0ca2c7df003ffc15" PRIMARY KEY ("member_id", "dialog_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_631a2e9594a3444e2aa5cabda5" ON "member_dialog" ("member_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d65ed976d7871686d67e45ecf1" ON "member_dialog" ("dialog_id") `);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_4838cd4fc48a6ff2d4aa01aa646" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_da5e0eb03e15dd7db2bb86fc153" FOREIGN KEY ("dialogId") REFERENCES "dialogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_dialog" ADD CONSTRAINT "FK_631a2e9594a3444e2aa5cabda5b" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_dialog" ADD CONSTRAINT "FK_d65ed976d7871686d67e45ecf19" FOREIGN KEY ("dialog_id") REFERENCES "dialogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_dialog" DROP CONSTRAINT "FK_d65ed976d7871686d67e45ecf19"`);
        await queryRunner.query(`ALTER TABLE "member_dialog" DROP CONSTRAINT "FK_631a2e9594a3444e2aa5cabda5b"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_da5e0eb03e15dd7db2bb86fc153"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_4838cd4fc48a6ff2d4aa01aa646"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d65ed976d7871686d67e45ecf1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_631a2e9594a3444e2aa5cabda5"`);
        await queryRunner.query(`DROP TABLE "member_dialog"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "dialogs"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
