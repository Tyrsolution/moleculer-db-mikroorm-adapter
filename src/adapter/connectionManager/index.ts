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
import { MikroORM } from '@mikro-orm/core';
import MikroORMDbAdapter from '../../adapter';

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
	private readonly _connectionMap: Map<string, MikroORM> = new Map();
	/**
	 * List of connections registered in this connection manager.
	 *
	 * @public
	 * @returns {DataSource[]} - List of connections
	 *
	 * @connectionmanager
	 */
	public get connections(): MikroORM[] {
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
	public get(name: string = 'default'): MikroORM {
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
			const connection: MikroORM = this._connectionMap.get(connectionName)!;
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
		// check if such connection is already registered
		const existConnection = this._connectionMap.get(options.name ?? 'default');
		const throwError = () => {
			logger.debug(`Connection already exists for: ${options.name ?? 'default'}`);
			const error = new Error(`Connection already exists for: ${options.name ?? 'default'}`);
			throw new Errors.MoleculerServerError(
				error.message,
				500,
				'ERR_CONNECTION_ALREADY_EXIST',
			);
		};
		const logDriver = () =>
			options.driver
				? logger.debug(
						`Driver for connection: ${options.name ?? 'default'} is ${options.driver}`,
				  )
				: logger.debug(`Options.driver not present, Setting driver to ${options.type}`);

		logger.debug(`Checking if driver in options object is present: ${options.driver ?? null}`);
		if (!options.driver) {
			switch (options.type) {
				case 'better-sqlite':
					logDriver();
					options.driver = (await import('@mikro-orm/better-sqlite')).BetterSqliteDriver;
					break;
				case 'mongo':
					logDriver();
					options.driver = (await import('@mikro-orm/mongodb')).MongoDriver;
					break;
				case 'mysql':
					logDriver();
					options.driver = (await import('@mikro-orm/mysql')).MySqlDriver;
					break;
				case 'mariadb':
					logDriver();
					options.driver = (await import('@mikro-orm/mariadb')).MariaDbDriver;
					break;
				case 'postgresql':
					logDriver();
					options.driver = (await import('@mikro-orm/postgresql')).PostgreSqlDriver;
					break;
				case 'sqlite':
					logDriver();
					options.driver = (await import('@mikro-orm/sqlite')).SqliteDriver;
					break;

				default:
					break;
			}
		}

		let activeConneciton: any;
		if (newConnection && !existConnection) {
			logger.debug(`Creating new connection for: ${options.name ?? 'default'}`);
			return new MikroORMDbAdapter(options);
		} else {
			logger.debug(`Checking if connection exists for: ${options.name ?? 'default'}`);
			const dbConnection: MikroORM = existConnection?.isConnected()
				? throwError()
				: await MikroORM.init(options).catch((err: any) => {
						throw new Errors.MoleculerServerError(
							err.message,
							500,
							'ERR_CONNECTION_CREATE',
						);
				  });
			logger.debug(`Connection created for: ${options.name ?? 'default'}`);
			await dbConnection
				.isConnected()
				.then((isConnected: boolean) => {
					if (!isConnected) {
						logger.debug(`Connection ${options.name ?? 'default'} not connected`);
						throw new Errors.MoleculerServerError(
							`Connection ${options.name ?? 'default'} not found`,
							500,
							'ERR_CONNECTION_NOT_FOUND',
						);
					}
					logger.debug(`Connection ${options.name ?? 'default'} connected`);
					dbConnection.getSchemaGenerator().updateSchema();
				})
				.catch((err: any) => {
					throw new Errors.MoleculerServerError(
						err.message,
						500,
						'ERR_CONNECTION_CREATE',
					);
				});

			logger.debug(`Setting active connection for: ${options.name ?? 'default'}`);
			activeConneciton = dbConnection;
			logger.debug(`Adding ${options.name ?? 'default'} to connection`);
			activeConneciton.name = options.name ?? 'default';

			// create a new connection
			logger.debug(`Adding ${options.name ?? 'default'} to connection map`);
			this._connectionMap.set(activeConneciton.name, activeConneciton);
		}
		logger.debug(`Returning active connection for: ${options.name ?? 'default'}`);
		return resolve(activeConneciton);
	}
}
