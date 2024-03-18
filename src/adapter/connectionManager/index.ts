/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable capitalized-comments */
/*
 * moleculer-db-mikroorm-adapter
 * Copyright (c) 2023 TyrSolutions (https://github.com/Tyrsolution/moleculer-db-mikroorm-adapter)
 * MIT Licensed
 */
import Moleculer, { Errors } from 'moleculer';
import { has } from 'lodash';
import MikroORMDbAdapter from '../../adapter';
import {
	MikroORMConnection,
	EntityManager,
	EntityRepository,
	Services,
	MikroORMConnectionOptions,
	initORM,
	BSMikroORM,
	MongoMikroORM,
	MYSQLMikroORM,
	MariaMicroORM,
	PostMikroORM,
	SqliteMiroOrm,
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

	private readonly _connectionMap: Map<string, MikroORMConnection> = new Map();
	/**
	 * List of connections registered in this connection manager.
	 *
	 * @public
	 * @returns {DataSource[]} - List of connections
	 *
	 * @connectionmanager
	 */
	public get connections(): MikroORMConnection[] {
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
	/* public remove(name: string = 'default'): void {
		const connection = this._connectionMap.get(name);
		if (!connection) {
			throw new Error(`Connection ${name} not found`);
		}
		this._connectionMap.delete(name);
	} */

	public remove(name: string = 'default'): void {
		if (!this._connectionMap.delete(name)) {
			throw new Error(`Connection ${name} not found`);
		}
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
	public async close(
		name: string | string[] = 'default',
	): Promise<boolean | boolean[] | Promise<boolean>[]> {
		const throwError = (connectionName: string) => {
			throw new Error(`Connection ${connectionName} not found`);
		};

		const closeConnection = async (connectionName: string) => {
			if (!this._connectionMap.has(connectionName)) {
				throwError(connectionName);
			}

			const connection: MikroORMConnection = this._connectionMap.get(connectionName)!;
			await connection.close();
			this.remove(connectionName);
			return true;
		};

		const closeConnectionSafe = async (connectionName: string) => {
			try {
				return await closeConnection(connectionName);
			} catch {
				return false;
			}
		};

		if (Array.isArray(name)) {
			return Promise.all(name.map(closeConnectionSafe));
		} else {
			return closeConnectionSafe(name);
		}
	}

	/**
	 * Creates a new database connection or retrieves an existing one.
	 *
	 * This method does the following:
	 * - Validates that a logger is provided.
	 * - Retrieves or creates a new connection based on the provided options.
	 * - If a new connection is requested and an existing connection does not exist, it creates a new MikroORMDbAdapter.
	 * - If a new connection is not requested or an existing connection exists, it checks if the connection is already connected.
	 * - If the connection is already connected, it throws an error.
	 * - If the connection is not connected, it initializes the ORM and updates the schema.
	 * - It then sets the active connection and adds it to the connection map.
	 *
	 * @public
	 * @param {object} options - The options for creating the connection. It includes the configuration for the connection,
	 * the logger instance, a flag indicating whether a new connection should be created, and a map of custom ORM drivers.
	 * @param {MikroORMConnectionOptions} options.config - Mikro-ORM data source connection options
	 * @param {Moleculer.LoggerInstance} options.logger - Moleculer logger
	 * @param {boolean} options.newConnection - Toggle to create a new instance of MikroORMDbAdapter.
	 * @param {object} options.customORMDriverMap - Object containing custom ORM drivers mapped.
	 *
	 * @returns {Promise<object>} A promise that resolves to an object containing the ORM, the entity manager, and the entity
	 * repository for the active connection.
	 *
	 * @throws {moleculer.Errors.MoleculerServerError} If a logger is not provided, if a connection already exists for the
	 * provided name, or if an error occurs while creating the connection, it throws a MoleculerServerError with a message
	 * that includes the error, a status code of 500, and an error code.
	 * Connection won't be established, you'll need to manually call connect method to establish connection.
	 *
	 * @connectionmanager
	 */
	public async create(options: {
		config: MikroORMConnectionOptions;
		logger: Moleculer.LoggerInstance;
		newConnection?: boolean;
		customORMDriverMap?: Record<string, any>;
	}): Promise<any> {
		if (!options.logger) {
			throw new Errors.MoleculerServerError(
				'Logger not provided',
				500,
				'ERR_LOGGER_NOT_FOUND',
			);
		}
		const logger = options.logger;
		const connectionName = options.config.name ?? 'default';
		const connectionOptions = { ...options.config };
		const existConnection = this._connectionMap.get(connectionName);
		if (!has(options, 'newConnection')) {
			options.newConnection = false;
		}
		const throwError = (message: string, code: string) => {
			logger.debug(message);
			throw new Errors.MoleculerServerError(message, 500, code);
		};

		if (options.newConnection && !existConnection) {
			logger.debug(`Creating new connection for: ${connectionName}`);
			return new MikroORMDbAdapter(connectionOptions);
		} else {
			logger.debug(`Checking if connection exists for: ${connectionName}`);
			// @ts-ignore
			const dbConnection: Services<any, EntityManager, EntityRepository<any>> | undefined =
				(await existConnection?.isConnected())
					? throwError(
							`Connection already exists for: ${connectionName}`,
							'ERR_CONNECTION_ALREADY_EXIST',
						)
					: await initORM(connectionOptions, options.customORMDriverMap).catch(
							(err: any) => {
								throwError(err.message, 'ERR_CONNECTION_CREATE');
							},
						);

			logger.debug(`Connection created for: ${connectionName}`);
			await dbConnection!.orm
				.isConnected()
				.then(async (isConnected: boolean) => {
					if (!isConnected) {
						throwError(
							`Connection ${connectionName} not connected`,
							'ERR_CONNECTION_NOT_FOUND',
						);
					}
					logger.debug(`Connection ${connectionName} connected`);
					await dbConnection!.orm.getSchemaGenerator().updateSchema();
				})
				.catch((err: any) => {
					throwError(err.message, 'ERR_CONNECTION_CREATE');
				});

			logger.debug(`Setting active connection for: ${connectionName}`);
			const activeConneciton = dbConnection!.orm;
			logger.debug(`Adding ${connectionName} to connection`);
			activeConneciton.name = connectionName;
			activeConneciton.driverType = connectionOptions.type;
			const entityManager = dbConnection!.entityManager;
			const entityRepository = dbConnection!.entityRepository;

			logger.debug(`Adding ${activeConneciton.name} to connection map`);
			this._connectionMap.set(activeConneciton.name, activeConneciton);

			logger.debug(`Returning active connection for: ${activeConneciton.name}`);
			return {
				orm: activeConneciton,
				entityManager,
				entityRepository,
			};
		}
	}
}
/* export {
	ConnectionManager as default,
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
	defineBSConfig,
	defineMongoConfig,
	defineMYSQLConfig,
	defineMariaConfig,
	definePostConfig,
	defineSqliteConfig,
}; */
