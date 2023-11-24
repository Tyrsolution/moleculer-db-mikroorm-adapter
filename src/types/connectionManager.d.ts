import { MikroORM } from '@mikro-orm/core';
import Moleculer from 'moleculer';

declare class ConnectionManager {
	/**
	 * Internal lookup to quickly get from a connection name to the Connection object.
	 */
	private readonly _connectionMap;
	/**
	 * List of connections registered in this connection manager.
	 *
	 * @public
	 * @returns {MikroORM[]} - List of connections
	 *
	 * @connectionmanager
	 */
	public get connections(): MikroORM[];

	/**
	 * Checks if connection with the given name exist in the manager.
	 *
	 * @public
	 * @param {string} name - Connection name
	 * @returns {boolean} - True if connection exist, false otherwise
	 *
	 * @connectionmanager
	 */
	public has(name: string): boolean;
	/**
	 * Gets registered connection with the given name.
	 * If connection name is not given then it will get a default connection.
	 * Throws error if connection with the given name was not found.
	 *
	 * @public
	 * @param {string} name - Connection name
	 * @returns {MikroORM} - Connection
	 *
	 * @connectionmanager
	 */
	public get(name?: string): MikroORM;
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
	public remove(name?: string): void;
	/**
	 * Closes registered connection with the given name and removes it from
	 * ConnectionManager.
	 * If connection name is not given then it will get a default connection.
	 * Throws error if connection with the given name was not found.
	 *
	 * @public
	 * @param {string | Array<string>} name - Connection name
	 *
	 * @connectionmanager
	 */
	public close(name?: string | string[]): Promise<boolean | Promise<boolean>[]>;
	/**
	 * Creates a new connection based on the given connection options and registers it in the manager.
	 * Connection won't be established, you'll need to manually call connect method to establish connection.
	 *
	 * @public
	 * @param {Object} options - Mikro-ORM data source connection options
	 * @returns {Promise<connection>} - Connection
	 *
	 * @connectionmanager
	 */
	public create(
		options: any,
		logger: Moleculer.LoggerInstance,
		newConnection?: boolean,
	): Promise<any>;
}
