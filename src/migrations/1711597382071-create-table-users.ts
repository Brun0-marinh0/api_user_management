import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateTableUsers1711595910542 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'isActivated',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'roleId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'SET NULL',
      }),
    );

    // seed to admin
    const adminRoleId = await queryRunner.query(
      `SELECT id FROM roles WHERE description = 'admin'`,
    );

    if (adminRoleId.length > 0) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);

      await queryRunner.query(
        `INSERT INTO users ("name", "lastName", "email", "password", "isActivated", "roleId") VALUES ('Master', 'User', 'master@admin.com', '${hashedAdminPassword}', true, '${adminRoleId[0].id}');`,
      );
    }

    // seed to common users
    const commonRoleId = await queryRunner.query(
      `SELECT id FROM roles WHERE description = 'common'`,
    );

    if (commonRoleId.length > 0) {
      const hashedPassword = await bcrypt.hash('user123', 10);

      await queryRunner.query(
        `INSERT INTO users ("name", "lastName", "email", "password", "isActivated", "roleId") VALUES 
        ('Common', 'User1', 'user1@user.com', '${hashedPassword}', true, '${commonRoleId[0].id}'),
        ('Common', 'User2', 'user2@user.com', '${hashedPassword}', true, '${commonRoleId[0].id}'),
        ('Admin', 'User3', 'user3@user.com', '${hashedPassword}', false, '${adminRoleId[0].id}');`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('roleId') !== -1,
    );
    await queryRunner.dropForeignKey('users', foreignKey);
    await queryRunner.dropColumn('users', 'roleId');
    await queryRunner.dropTable('users');
  }
}
