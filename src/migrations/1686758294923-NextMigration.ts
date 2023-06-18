import { MigrationInterface, QueryRunner } from "typeorm";

export class NextMigration1686758294923 implements MigrationInterface {
    name = 'NextMigration1686758294923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_dialog" DROP CONSTRAINT "FK_631a2e9594a3444e2aa5cabda5b"`);
        await queryRunner.query(`ALTER TABLE "member_dialog" DROP CONSTRAINT "FK_d65ed976d7871686d67e45ecf19"`);
        await queryRunner.query(`ALTER TABLE "member_dialog" ADD CONSTRAINT "FK_631a2e9594a3444e2aa5cabda5b" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "member_dialog" ADD CONSTRAINT "FK_d65ed976d7871686d67e45ecf19" FOREIGN KEY ("dialog_id") REFERENCES "dialogs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_dialog" DROP CONSTRAINT "FK_d65ed976d7871686d67e45ecf19"`);
        await queryRunner.query(`ALTER TABLE "member_dialog" DROP CONSTRAINT "FK_631a2e9594a3444e2aa5cabda5b"`);
        await queryRunner.query(`ALTER TABLE "member_dialog" ADD CONSTRAINT "FK_d65ed976d7871686d67e45ecf19" FOREIGN KEY ("dialog_id") REFERENCES "dialogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_dialog" ADD CONSTRAINT "FK_631a2e9594a3444e2aa5cabda5b" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
