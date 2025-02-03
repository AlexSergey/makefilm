import { dataSource as _dataSource } from 'database/src/data-source';
import { DataSource } from 'typeorm';

export interface DatabaseManager {
  cleanupDatabase(): Promise<void>;

  destroy(): Promise<void>;

  getDatasource(): DataSource;
}

export const databaseManager = async (): Promise<DatabaseManager> => {
  const dataSource = await _dataSource.initialize();

  const cleanupDatabase = async (): Promise<void> => {
    const entities = dataSource.entityMetadatas;
    const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ');
    await dataSource.query(`TRUNCATE ${tableNames} CASCADE;`);
    // eslint-disable-next-line no-console
    console.log('[TEST DATABASE]: Clean');
  };

  return {
    cleanupDatabase: cleanupDatabase,

    destroy: async (): Promise<void> => {
      await cleanupDatabase();
      await dataSource.destroy();
    },

    getDatasource: (): DataSource => {
      return dataSource;
    },
  };
};
