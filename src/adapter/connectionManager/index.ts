/* eslint-disable no-underscore-dangle */
/* eslint-disable capitalized-comments */
/*
 * moleculer-db-mikroorm-adapter
 * Copyright (c) 2023 TyrSolutions (https://github.com/Tyrsolution/moleculer-db-mikroorm-adapter)
 * MIT Licensed
 */
import { isArray } from 'lodash';
import Moleculer, { Errors } from 'moleculer';
import { resolve } from 'bluebird';
// import { MikroORM } from '@mikro-orm/core';
import MikroORMDbAdapter from '../../adapter';
import {
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
	initORM,
	Services,
} from './connection';

/**
 * ConnectionManager is used to store and manage multiple orm connections.
 * It also provides useful factory methods to simplify connection creation.
 *
 * @name ConnectionManager
 * @module Service
 *
 * @class ConnectionManager
 */
export default class ConnectionManager {
	/**
	 * Internal lookup to quickly get from a connection name to the Connection object.
	 */
	private readonly _connectionMap: Map<
		string,
		BSMikroORM | MongoMikroORM | MYSQLMikroORM | MariaMicroORM | PostMikroORM | SqliteMiroOrm
	> = new Map();
	/**
	 * List of connections registered in this connection manager.
	 *
	 * @public
	 * @returns {DataSource[]} - List of connections
	 *
	 * @connectionmanager
	 */
	public get connections(): (
		| BSMikroORM
		| MongoMikroORM
		| MYSQLMikroORM
		| MariaMicroORM
		| PostMikroORM
		| SqliteMiroOrm
	)[] {
		return Array.from(this._connectionMap.values());
	}

	// -------------------------------------------------------------------------
	// Public Methods
	// -------------------------------------------------------------------------

	/**
	 * Checks if connection with the given name exist in the manager.
	 *
	 * @public
	 * @param {string} name - Connection name
	 * @returns {boolean} - True if connection exist, false otherwise
	 *
	 * @connectionmanager
	 */
	public has(name: string): boolean {
		return this._connectionMap.has(name);
	}

	/**
	 * Gets registered connection with the given name.
	 * If connection name is not given then it will get a default connection.
	 * Throws error if connection with the given name was not found.
	 *
	 * @public
	 * @param {string} name - Connection name
	 * @returns {DataSource} - Connection
	 *
	 * @connectionmanager
	 */
	public get(
		name: string = 'default',
	): BSMikroORM | MongoMikroORM | MYSQLMikroORM | MariaMicroORM | PostMikroORM | SqliteMiroOrm {
		const connection = this._connectionMap.get(name);
		if (!connection) {
			throw new Error(`Connection ${name} not found`);
		}

		return connection;
	}

	/**
	 * Removes registered connection with the given name.
	 * If connection name is not given then it will get a default connection.
	 * Throws error if connection with the given name was not found.
	 *
	 * @public
	 * @param {string} name - Connection name
	 *
	 * @connectionmanager
	 */
	public remove(name: string = 'default'): void {
		const connection = this._connectionMap.get(name);
		if (!connection) {
			throw new Error(`Connection ${name} not found`);
		}
		this._connectionMap.delete(name);
	}

	/**
	 * closes registered connection with the given name and removes it from
	 * ConnectionManager.
	 * If connection name is not given then it will get a default connection.
	 * Throws error if connection with the given name was not found.
	 *
	 * @public
	 * @param {string | Array<string>} name - Connection name
	 *
	 * @connectionmanager
	 */
	public async close(name: string | string[] = 'default'): Promise<boolean | Promise<boolean>[]> {
		const throwError = (connectionName: string) => {
			throw new Error(`Connection ${connectionName} not found`);
		};
		const closeConnection = async (connectionName: string) => {
			const connection:
				| BSMikroORM
				| MongoMikroORM
				| MYSQLMikroORM
				| MariaMicroORM
				| PostMikroORM
				| SqliteMiroOrm = this._connectionMap.get(connectionName)!;
			await connection.close();
			this.remove(connectionName);
		};
		return !isArray(name) && this._connectionMap.has(name)
			? await closeConnection(name)
					.then(() => true)
					.catch(() => false)
			: isArray(name)
				? name.map(async (connectionName: string) =>
						this._connectionMap.has(connectionName)
							? await closeConnection(connectionName)
									.then(() => true)
									.catch(() => false)
							: throwError(connectionName),
					)
				: throwError(name);
	}

	/**
	 * Creates a new connection based on the given connection options and registers it in the manager.
	 * Connection won't be established, you'll need to manually call connect method to establish connection.
	 *
	 * @public
	 * @param {Object} options - Mikro-ORM data source connection options
	 * @param {boolean} newConnection - Toggle to create a new instance of MikroORMDbAdapter.
	 * @returns {Promise<connection>} - Connection
	 *
	 * @connectionmanager
	 */
	public async create(
		options: any,
		// options: MikroORMOptions<any>,
		logger: Moleculer.LoggerInstance,
		newConnection: boolean = false,
	): Promise<any> {
		if (!logger) {
			throw new Errors.MoleculerServerError(
				'Logger not provided',
				500,
				'ERR_LOGGER_NOT_FOUND',
			);
		}
		const connectionOptions = { ...options };
		// delete connectionOptions.type;
		// check if such connection is already registered
		const existConnection = this._connectionMap.get(connectionOptions.name ?? 'default');
		const throwError = () => {
			logger.debug(`Connection already exists for: ${connectionOptions.name ?? 'default'}`);
			const error = new Error(
				`Connection already exists for: ${connectionOptions.name ?? 'default'}`,
			);
			throw new Errors.MoleculerServerError(
				error.message,
				500,
				'ERR_CONNECTION_ALREADY_EXIST',
			);
		};
		/* const logDriver = () =>
			connectionOptions.driver
				? logger.debug(
						`Driver for connection: ${connectionOptions.name ?? 'default'} is ${connectionOptions.driver}`,
					)
				: logger.debug(`Options.driver not present, Setting driver to ${options.type}`);

		logger.debug(
			`Checking if driver in options object is present: ${connectionOptions.driver ?? null}`,
		); */
		// eslint-disable-next-line @typescript-eslint/naming-convention
		/* let MikroORMDriverObject: any;
		if (!connectionOptions.driver) {
			switch (options.type) {
				case 'better-sqlite':
					logDriver();
					MikroORMDriverObject = BSMikroORM;
					break;
				case 'mongo':
					logDriver();
					MikroORMDriverObject = MongoMikroORM;
					break;
				case 'mysql':
					logDriver();
					MikroORMDriverObject = MYSQLMikroORM;
					break;
				case 'mariadb':
					logDriver();
					MikroORMDriverObject = MariaMicroORM;
					break;
				case 'postgresql':
					logDriver();
					MikroORMDriverObject = PostMikroORM;
					break;
				case 'sqlite':
					logDriver();
					MikroORMDriverObject = SqliteMiroOrm;
					break;

				default:
					break;
			}
		} */

		// console.warn('MikroORM driver export: ', await MikroORMDriverObject);
		let activeConneciton: any;
		let entityManager: any;
		if (newConnection && !existConnection) {
			logger.debug(`Creating new connection for: ${connectionOptions.name ?? 'default'}`);
			return new MikroORMDbAdapter(connectionOptions);
		} else {
			logger.debug(
				`Checking if connection exists for: ${connectionOptions.name ?? 'default'}`,
			);
			const dbConnection: any = existConnection?.isConnected()
				? throwError()
				: await initORM(connectionOptions).catch((err: any) => {
						throw new Errors.MoleculerServerError(
							err.message,
							500,
							'ERR_CONNECTION_CREATE',
						);
					});
			/* : await MikroORMDriverObject.init(connectionOptions).catch((err: any) => {
						throw new Errors.MoleculerServerError(
							err.message,
							500,
							'ERR_CONNECTION_CREATE',
						);
					}); */
			logger.debug(`Connection created for: ${connectionOptions.name ?? 'default'}`);
			await dbConnection.orm
				.isConnected()
				.then((isConnected: boolean) => {
					if (!isConnected) {
						logger.debug(
							`Connection ${connectionOptions.name ?? 'default'} not connected`,
						);
						throw new Errors.MoleculerServerError(
							`Connection ${connectionOptions.name ?? 'default'} not found`,
							500,
							'ERR_CONNECTION_NOT_FOUND',
						);
					}
					logger.debug(`Connection ${connectionOptions.name ?? 'default'} connected`);
					dbConnection.orm.getSchemaGenerator().updateSchema();
				})
				.catch((err: any) => {
					throw new Errors.MoleculerServerError(
						err.message,
						500,
						'ERR_CONNECTION_CREATE',
					);
				});

			logger.debug(`Setting active connection for: ${connectionOptions.name ?? 'default'}`);
			activeConneciton = dbConnection.orm;
			logger.debug(`Adding ${connectionOptions.name ?? 'default'} to connection`);
			activeConneciton.name = connectionOptions.name ?? 'default';
			activeConneciton.driverType = connectionOptions.type;
			entityManager = dbConnection.em;
			// create a new connection
			logger.debug(`Adding ${activeConneciton.name ?? 'default'} to connection map`);
			this._connectionMap.set(activeConneciton.name, activeConneciton);
		}
		logger.debug(`Returning active connection for: ${activeConneciton.name ?? 'default'}`);
		return {
			// orm: activeConneciton.orm,
			orm: activeConneciton,
			// orm: resolve(activeConneciton.orm),
			// em: activeConneciton.em,
			em: entityManager,
			// em: resolve(activeConneciton.em),
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
	}
}
