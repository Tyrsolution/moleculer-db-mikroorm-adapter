/*
 * moleculer-db-mikroorm-adapter
 * Copyright (c) 2023 TyrSolutions (https://github.com/Tyrsolution/moleculer-db-mikroorm-adapter)
 * MIT Licensed
 */
import { isArray } from 'lodash';
/* import {
	DataSource,
	DataSourceOptions,
	ConnectionNotFoundError,
	AlreadyHasActiveConnectionError,
} from 'typeorm'; */
import { Errors } from 'moleculer';
import MikroORMDbAdapter from '../../adapter';
import { resolve } from 'bluebird';
import { MikroORM, MikroORMOptions } from '@mikro-orm/core';

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
	 * List of connections registered in this connection manager.
	 *
	 * @public
	 * @returns {DataSource[]} - List of connections
	 *
	 * @connectionmanager
	 */
	get connections(): MikroORM[] {
		return Array.from(this.connectionMap.values());
	}

	/**
	 * Internal lookup to quickly get from a connection name to the Connection object.
	 */
	private readonly connectionMap: Map<string, MikroORM> = new Map();

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
	has(name: string): boolean {
		return this.connectionMap.has(name);
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
	get(name: string = 'default'): MikroORM {
		const connection = this.connectionMap.get(name);
		if (!connection) throw new Error(`Connection ${name} not found`);

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
	remove(name: string = 'default'): void {
		const connection = this.connectionMap.get(name);
		if (!connection) throw new Error(`Connection ${name} not found`);
		this.connectionMap.delete(name);
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
	async close(name: string | Array<string> = 'default'): Promise<boolean | Promise<boolean>[]> {
		const throwError = (name: string) => {
			throw new Error(`Connection ${name} not found`);
		};
		const closeConnection = async (name: string) => {
			const connection: MikroORM = this.connectionMap.get(name)!;
			await connection.close();
			this.remove(name);
		};
		return !isArray(name) && this.connectionMap.has(name)
			? await closeConnection(name)
					.then(() => {
						return true;
					})
					.catch(() => {
						return false;
					})
			: isArray(name)
			? name.map(async (connectionName: string) => {
					return this.connectionMap.has(connectionName)
						? await closeConnection(connectionName)
								.then(() => {
									return true;
								})
								.catch(() => {
									return false;
								})
						: throwError(connectionName);
			  })
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
	async create(options: MikroORMOptions, newConnection: boolean = false): Promise<any> {
		// check if such connection is already registered
		const existConnection = this.connectionMap.get(options.name ?? 'default');
		const throwError = () => {
			const error = new Error(`Connection already exists for: ${options.name ?? 'default'}`);
			throw new Errors.MoleculerServerError(
				error.message,
				500,
				'ERR_CONNECTION_ALREADY_EXIST',
			);
		};

		let activeConneciton: any;
		if (newConnection && !existConnection) {
			return new MikroORMDbAdapter(options);
		} else {
			const dbConnection: MikroORM = existConnection?.isConnected()
				? throwError()
				: await MikroORM.init(options).catch((err: any) => {
						throw new Errors.MoleculerServerError(
							err.message,
							500,
							'ERR_CONNECTION_CREATE',
						);
				  });

			await dbConnection.isConnected().then((isConnected: boolean) => {
				if (!isConnected) {
					throw new Errors.MoleculerServerError(
						`Connection ${options.name ?? 'default'} not found`,
						500,
						'ERR_CONNECTION_NOT_FOUND',
					);
				}
				dbConnection.getSchemaGenerator().updateSchema();
			});

			activeConneciton = dbConnection;
			activeConneciton.name = options.name ?? 'default';

			// create a new connection
			this.connectionMap.set(activeConneciton.name, activeConneciton);
		}
		return resolve(activeConneciton);
	}
}