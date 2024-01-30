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

export interface Services {
	orm: BSMikroORM | MongoMikroORM | MYSQLMikroORM | MariaMicroORM | PostMikroORM | SqliteMiroOrm;
	em:
		| BSEntityManager
		| MongoEntityManager
		| MYSQLEntityManager
		| MariaEntityManager
		| PostEntityManager
		| SqliteEntityManager;
	repository: any;
}

export interface OptionsBS extends BSOptions {
	type: string;
}

export interface OptionsMongo extends MongoOptions {
	type: string;
}

export interface OptionsMYSQL extends MYSQLOptions {
	type: string;
}

export interface OptionsMaria extends MariaOptions {
	type: string;
}

export interface OptionsPost extends PostOptions {
	type: string;
}

export interface OptionsSqlite extends SqliteOptions {
	type: string;
}

export const initORM = async (
	config: any,
	options?: OptionsBS | OptionsMongo | OptionsMYSQL | OptionsMaria | OptionsPost | OptionsSqlite,
): Promise<Services | undefined> => {
	let orm:
		| BSMikroORM
		| MongoMikroORM
		| MYSQLMikroORM
		| MariaMicroORM
		| PostMikroORM
		| SqliteMiroOrm = {} as any;

	let repository: any = null;

	if (config) {
		switch (config.type) {
			case 'better-sqlite':
				delete config.type;
				orm = (await BSMikroORM.init({
					...config,
					...options,
				})) as BSMikroORM;
				repository = BSEntityRepository;
				break;
			case 'mongo':
				delete config.type;
				orm = (await MongoMikroORM.init({
					...config,
					...options,
				})) as MongoMikroORM;
				repository = MongoEntityRepository;
				break;
			case 'mysql':
				delete config.type;
				orm = (await MYSQLMikroORM.init({
					...config,
					...options,
				})) as MYSQLMikroORM;
				repository = MYSQLEntityRepository;
				break;
			case 'mariadb':
				delete config.type;
				orm = (await MariaMicroORM.init({
					...config,
					...options,
				})) as MariaMicroORM;
				repository = MariaEntityRepository;
				break;
			case 'postgresql':
				delete config.type;
				orm = (await PostMikroORM.init({
					...config,
					...options,
				})) as PostMikroORM;
				repository = PostEntityRepository;
				break;
			case 'sqlite':
				delete config.type;
				orm = (await SqliteMiroOrm.init({
					...config,
					...options,
				})) as SqliteMiroOrm;
				repository = SqliteEntityRepository;
				break;

			default:
				break;
		}
	}
	return {
		orm,
		em: orm.em,
		repository,
	};
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
