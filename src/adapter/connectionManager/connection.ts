/* eslint-disable capitalized-comments */
import {
	MikroORM as BSMikroORM,
	Options as BSOptions,
	EntityManager as BSEntityManager,
	EntityRepository as BSEntityRepository,
	defineConfig as defineBSConfig,
} from '@mikro-orm/better-sqlite';
import {
	MikroORM as MongoMikroORM,
	Options as MongoOptions,
	EntityManager as MongoEntityManager,
	EntityRepository as MongoEntityRepository,
	defineConfig as defineMongoConfig,
} from '@mikro-orm/mongodb';
import {
	MikroORM as MYSQLMikroORM,
	Options as MYSQLOptions,
	EntityManager as MYSQLEntityManager,
	EntityRepository as MYSQLEntityRepository,
	defineConfig as defineMYSQLConfig,
} from '@mikro-orm/mysql';
import {
	MikroORM as MariaMicroORM,
	Options as MariaOptions,
	EntityManager as MariaEntityManager,
	EntityRepository as MariaEntityRepository,
	defineConfig as defineMariaConfig,
} from '@mikro-orm/mariadb';
import {
	MikroORM as PostMikroORM,
	Options as PostOptions,
	EntityManager as PostEntityManager,
	EntityRepository as PostEntityRepository,
	defineConfig as definePostConfig,
} from '@mikro-orm/postgresql';
import {
	MikroORM as SqliteMiroOrm,
	Options as SqliteOptions,
	EntityManager as SqliteEntityManager,
	EntityRepository as SqliteEntityRepository,
	defineConfig as defineSqliteConfig,
} from '@mikro-orm/sqlite';

export type MikroORMConnection =
    | BSMikroORM
    | MongoMikroORM
    | MYSQLMikroORM
    | MariaMicroORM
    | PostMikroORM
    | SqliteMiroOrm;

export type EntityManager =
    | BSEntityManager
    | MongoEntityManager
    | MYSQLEntityManager
    | MariaEntityManager
    | PostEntityManager
	| SqliteEntityManager;

export type EntityRepository<T extends object> =
	| BSEntityRepository<T>
	| MongoEntityRepository<T>
	| MYSQLEntityRepository<T>
	| MariaEntityRepository<T>
	| PostEntityRepository<T>
	| SqliteEntityRepository<T>;

export interface Services<T extends MikroORMConnection, U extends EntityManager, V extends EntityRepository<any>> {
	orm: T;
	entityManager: U;
	entityRepository: V;
}

export interface BaseOptions {
    type: string;
}

export interface OptionsBS extends BaseOptions, BSOptions {}
export interface OptionsMongo extends BaseOptions, MongoOptions {}
export interface OptionsMYSQL extends BaseOptions, MYSQLOptions {}
export interface OptionsMaria extends BaseOptions, MariaOptions {}
export interface OptionsPost extends BaseOptions, PostOptions {}
export interface OptionsSqlite extends BaseOptions, SqliteOptions {}

export type MikroORMConnectionOptions =
    | OptionsBS
    | OptionsMongo
    | OptionsMYSQL
    | OptionsMaria
    | OptionsPost
    | OptionsSqlite;

export const initORM = async (
    config: MikroORMConnectionOptions,
    options?: MikroORMConnectionOptions,
): Promise<Services<MikroORMConnection, EntityManager, EntityRepository<any>> | undefined> => {
    const ormMap: { [key: string]: any } = {
        "better-sqlite": { orm: BSMikroORM, entity: BSEntityRepository },
        "mongo": { orm: MongoMikroORM, entity: MongoEntityRepository },
        "mysql": { orm: MYSQLMikroORM, entity: MYSQLEntityRepository },
        "mariadb": { orm: MariaMicroORM, entity: MariaEntityRepository },
        "postgresql": { orm: PostMikroORM, entity: PostEntityRepository },
        "sqlite": { orm: SqliteMiroOrm, entity: SqliteEntityRepository },
    };

    if (config && config.type in ormMap) {
        const { type, ...restConfig } = config;
        const orm = await ormMap[type].orm.init({ ...restConfig, ...options });
        const entityRepository = ormMap[type].entity;

        return {
            orm,
            entityManager: orm.em.fork(),
            entityRepository,
        };
    }

    return undefined;
};

export {
	BSMikroORM,
	MongoMikroORM,
	MYSQLMikroORM,
	MariaMicroORM,
	PostMikroORM,
	SqliteMiroOrm,
	BSEntityManager,
	MongoEntityManager,
	MYSQLEntityManager,
	MariaEntityManager,
	PostEntityManager,
	SqliteEntityManager,
	BSEntityRepository,
	MongoEntityRepository,
	MYSQLEntityRepository,
	MariaEntityRepository,
	PostEntityRepository,
	SqliteEntityRepository,
	defineBSConfig,
	defineMongoConfig,
	defineMYSQLConfig,
	defineMariaConfig,
	definePostConfig,
	defineSqliteConfig,
};
