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

type MikroORMConnection =
	| BSMikroORM
	| MongoMikroORM
	| MYSQLMikroORM
	| MariaMicroORM
	| PostMikroORM
	| SqliteMiroOrm;

type EntityManager =
	| BSEntityManager
	| MongoEntityManager
	| MYSQLEntityManager
	| MariaEntityManager
	| PostEntityManager
	| SqliteEntityManager;

type EntityRepository<T extends object> =
	| BSEntityRepository<T>
	| MongoEntityRepository<T>
	| MYSQLEntityRepository<T>
	| MariaEntityRepository<T>
	| PostEntityRepository<T>
	| SqliteEntityRepository<T>;

interface Services<
	T extends MikroORMConnection,
	U extends EntityManager,
	V extends EntityRepository<any>,
> {
	orm: T;
	entityManager: U;
	entityRepository: V;
}

interface BaseOptions {
	type: string;
}

interface OptionsBS extends BaseOptions, BSOptions {}
interface OptionsMongo extends BaseOptions, MongoOptions {}
interface OptionsMYSQL extends BaseOptions, MYSQLOptions {}
interface OptionsMaria extends BaseOptions, MariaOptions {}
interface OptionsPost extends BaseOptions, PostOptions {}
interface OptionsSqlite extends BaseOptions, SqliteOptions {}

type MikroORMConnectionOptions =
	| OptionsBS
	| OptionsMongo
	| OptionsMYSQL
	| OptionsMaria
	| OptionsPost
	| OptionsSqlite;

const ormMap: { [key: string]: any } = {
	'better-sqlite': {
		orm: BSMikroORM,
		entityRepository: BSEntityRepository,
		entityManager: BSEntityManager,
	},
	// eslint-disable-next-line quote-props
	mongo: {
		orm: MongoMikroORM,
		entityRepository: MongoEntityRepository,
		entityManager: MongoEntityManager,
	},
	// eslint-disable-next-line quote-props
	mysql: {
		orm: MYSQLMikroORM,
		entityRepository: MYSQLEntityRepository,
		entityManager: MYSQLEntityManager,
	},
	// eslint-disable-next-line quote-props
	mariadb: {
		orm: MariaMicroORM,
		entityRepository: MariaEntityRepository,
		entityManager: MariaEntityManager,
	},
	// eslint-disable-next-line quote-props
	postgresql: {
		orm: PostMikroORM,
		entityRepository: PostEntityRepository,
		entityManager: PostEntityManager,
	},
	// eslint-disable-next-line quote-props
	sqlite: {
		orm: SqliteMiroOrm,
		entityRepository: SqliteEntityRepository,
		entityManager: SqliteEntityManager,
	},
};
const defineConfigMap: { [key: string]: any } = {
	'better-sqlite': {
		defineConfig: defineBSConfig,
	},
	// eslint-disable-next-line quote-props
	mongo: {
		defineConfig: defineMongoConfig,
	},
	// eslint-disable-next-line quote-props
	mysql: {
		defineConfig: defineMYSQLConfig,
	},
	// eslint-disable-next-line quote-props
	mariadb: {
		defineConfig: defineMariaConfig,
	},
	// eslint-disable-next-line quote-props
	postgresql: {
		defineConfig: definePostConfig,
	},
	// eslint-disable-next-line quote-props
	sqlite: {
		defineConfig: defineSqliteConfig,
	},
};

const initORM = async (
	config: MikroORMConnectionOptions,
	ormMapObject = ormMap,
	// options?: MikroORMConnectionOptions,
): Promise<Services<MikroORMConnection, EntityManager, EntityRepository<any>> | undefined> => {
	if (config && config.type in ormMapObject) {
		const { type, ...restConfig } = config;
		const orm = await ormMapObject[type].orm.init({ ...restConfig /* ...options  */ });
		const entityRepository = ormMapObject[type].entityRepository;

		return {
			orm,
			entityManager: orm.em.fork(),
			entityRepository,
		};
	}

	return undefined;
};

export type {
	MikroORMConnection,
	EntityManager,
	EntityRepository,
	Services,
	BaseOptions,
	OptionsBS,
	OptionsMongo,
	OptionsMYSQL,
	OptionsMaria,
	OptionsPost,
	OptionsSqlite,
	MikroORMConnectionOptions,
};

export {
	// MikroORMConnection,
	// EntityManager,
	// EntityRepository,
	// Services,
	// BaseOptions,
	// OptionsBS,
	// OptionsMongo,
	// OptionsMYSQL,
	// OptionsMaria,
	// OptionsPost,
	// OptionsSqlite,
	// MikroORMConnectionOptions,
	ormMap,
	initORM,
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
	defineConfigMap,
	defineBSConfig,
	defineMongoConfig,
	defineMYSQLConfig,
	defineMariaConfig,
	definePostConfig,
	defineSqliteConfig,
};
