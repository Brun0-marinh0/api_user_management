import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableRoles1711587732433 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'description',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    //seed
    await queryRunner.query(
      `INSERT INTO roles (description) VALUES ('admin'), ('common');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles`);

    await queryRunner.dropTable('roles');
  }
}
