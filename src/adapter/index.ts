/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable dot-notation */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable capitalized-comments */
/*
 * moleculer-db-typeorm-adapter
 * Copyright (c) 2023 TyrSolutions (https://github.com/Tyrsolution/moleculer-db-mikroorm-adapter)
 * MIT Licensed
 */

'use strict';
import 'reflect-metadata';
import {
	capitalize,
	cloneDeep,
	compact,
	defaultsDeep,
	find,
	flattenDeep,
	get,
	has,
	isArray,
	isFunction,
	isObject,
	isString,
	isUndefined,
	map,
	replace,
	set,
	uniq,
	unset,
} from 'lodash';
import { all, method, reject, resolve } from 'bluebird';
import moleculer, { Service, ServiceBroker, Errors, Context } from 'moleculer';
import {
	AnyEntity,
	EntityManager,
	EntityRepository,
	EntitySchema,
	MikroORM,
	MikroORMOptions,
} from '@mikro-orm/core';
import flatten from 'flat';
import { ObjectId } from '@mikro-orm/mongodb';
import { ListParams } from '../types/mikroormadapter';
import { name, version, repository } from '../../package.json';
import ConnectionManager from './connectionManager';

/**
 * Moleculer Mikro-ORM Adapter
 *
 * @name moleculer-db-mikroorm-adapter
 * @module Service
 * @class MikroORMDbAdapter
 */
/**
 * Settings for Mikro-ORM adapter
 *
 * @module Settings
 * @param {DataSourceOptions} opts - Mikro-ORM connection options
 *
 * @example
 * ```js
 * {
 * 	  name: 'greeter',
 *    type: 'better-sqlite3',
 *    database: 'temp/test.db',
 *    synchronize: true,
 *    logging: ['query', 'error'],
 *    entities: [TypeProduct]
 * }
 * ```
 */
export default class MikroORMDbAdapter<Entity extends AnyEntity> {
	// Dynamic property key
	[index: string]: any;
	/**
	 * Grants access to the connection manager instance which is used to create and manage connections.
	 * Called using this.adapter.connectionManager
	 *
	 * @static
	 * @property {ConnectionManager} connectionManager
	 *
	 * @properties
	 */
	public connectionManager: ConnectionManager | undefined;
	/**
	 * Grants access to the entity manager of the connection.
	 * Called using this.adapter.manager
	 * @static
	 * @property {EntityManager} manager
	 *
	 * @properties
	 */
	public manager: EntityManager | undefined;
	/**
	 * Grants access to the entity repository of the connection.
	 * Called using this.adapter.repository
	 * @static
	 * @property {Repository<Entity>} repository
	 *
	 * @properties
	 */
	public repository: EntityRepository<Entity> | undefined;

	public orm: MikroORM | undefined;

	public entityName: string | undefined;
	public logger: moleculer.LoggerInstance | undefined;

	private _entity: EntitySchema<Entity> | EntitySchema<Entity>[] | undefined;
	/**
	 * Creates an instance of Mikro-ORM db service.
	 *
	 * @param {DataSourceOptions} opts
	 *
	 */
	public constructor(opts?: MikroORMOptions) {
		this.opts = opts;
	}

	/**
	 * Initialize adapter.
	 * It will be called in `broker.start()` and is used internally.
	 * @methods
	 * @param {ServiceBroker} broker
	 * @param {Service} service
	 * @memberof MikroORMDbAdapter
	 */
	public init(broker: ServiceBroker, service: Service) {
		this.broker = broker;
		this.service = service;
		this.logger = this.broker.logger;
		const entityFromService = this.service.schema.model;
		const entityArray: EntitySchema<Entity>[] = [];
		has(this.opts, 'entities')
			? (this._entity = [...this.opts.entities])
			: isArray(entityFromService)
			? (entityFromService.forEach((entity) => {
					const isValid = !!entity.constructor;
					if (!isValid) {
						new Errors.MoleculerServerError(
							'Invalid model. It should be a mikro-orm entity',
						);
					}
					entityArray.push(entity);
			  }),
			  (this._entity = entityArray))
			: !isUndefined(entityFromService) && !!entityFromService.constructor
			? (this._entity = entityFromService)
			: new Errors.MoleculerServerError('Invalid model. It should be a mikro-orm entity');
	}

	/**
	 * Connects to database.
	 * It will be called in `broker.start()` and is used internally.
	 * @methods
	 * @public
	 * @returns {Promise}
	 */
	public async connect(): Promise<any> {
		const logger = this.logger!;
		logger.debug('Adding logger to adapter...');
		/**
		 * set connection manager on this.adapter
		 */
		this.connectionManager = new ConnectionManager();
		/**
		 * create connection using this.opts & initialize db connection
		 */
		const orm: any = await this.connectionManager.create(this.opts);
		logger.info(`${this.service.name} has connected to ${orm.name} database`);

		/**
		 * array of entities
		 */
		const entityArrray: { [key: string]: any } = isArray(this._entity)
			? (this._entity as unknown as EntitySchema)
			: [this._entity as unknown as EntitySchema];

		/**
		 * get entity methods
		 *
		 * @param {Object} obj -- entity object
		 * @returns {Array<string>}
		 */
		const entityMethods = (obj: { [key: string]: any } = {}) => {
			const members = Object.getOwnPropertyNames(obj);
			const methods = members.filter((el) => typeof obj[el] === 'function');
			return methods;
		};

		logger.debug(`Adding entities to adapter: ${JSON.stringify(entityArrray)}`);
		/**
		 * add additional entities and methods to adapter
		 * under entity name this.adapter.entityName
		 */
		entityArrray.forEach((entity: AnyEntity, index: number) => {
			const dbRepository: any = orm.em.fork().getRepository(entity);
			const dbManager: EntityManager = orm.em.fork();
			const repositoryEntityManager: any = dbRepository.getEntityManager();
			const entityName = entity.name;
			const entityMethodNames = entityMethods(entity);

			logger.debug(
				`Adding custom methods on entity to adapter: ${JSON.stringify(entityMethodNames)}`,
			);
			/**
			 * object for entity methods to this.adapter.entityName
			 * getRepository function required for this to work
			 */
			const methodsToAdd: { [key: string]: any } = {
				_entity: this._entity,
				opts: this.opts,
				orm,
				manager: dbManager,
				repository: dbRepository,
				entityName,
				/* getRepository: function getRepository() {
					const dataSource = db;
					if (!dataSource) throw new Error(`DataSource is not set for this entity.`);
					return dbManager.getRepository(entity);
				}, */
			};
			/**
			 * add base entity methods to this.adapter
			 * or add additional methods to methods object
			 */
			entityMethodNames.forEach((entityMethod) => {
				index === 0
					? (this[entityMethod] = entity[entityMethod])
					: (methodsToAdd[entityMethod] = entity[entityMethod]);
			});
			logger.debug('Adding entity manager methods to adapter...');
			/**
			 * add entity manager methods to this.adapter or methods object
			 * methods prefixed with _ to avoid conflict with adapter custom methods
			 */
			[
				/**
				 * Base orm entity manager methods
				 */
				'addFilter',
				// 'assign',
				'begin',
				// 'canPopulate',
				'clear',
				'clearCache',
				'commit',
				// 'count',
				// 'create',
				// 'find',
				// 'findAndCount',
				// 'findOne',
				// 'findOneOrFail',
				// 'flush',
				'fork',
				'getComparator',
				'getConnection',
				'getDriver',
				'getEntityFactory',
				'getEventManager',
				'getFilterParams',
				'getHydrator',
				'getMetadata',
				'getPlatform',
				// 'getReference',
				'getRepository',
				'getTransactionContext',
				'getUnitOfWork',
				'getValidator',
				'insert',
				'insertMany',
				'isInTransaction',
				'lock',
				// 'map',
				// 'merge',
				// 'nativeDelete',
				// 'nativeInsert',
				// 'nativeUpdate',
				// 'persist',
				// 'persistAndFlush',
				// 'persistLater',
				// 'populate',
				'refresh',
				// 'remove',
				// 'removeAndFlush',
				// 'removeLater',
				'repo',
				'resetTransactionContext',
				'rollback',
				'setFilterParams',
				'setFlushMode',
				'setTransactionContext',
				'transactional',
				// 'upsert',
				// 'upsertMany',
				/**
				 * SQL orm entity manager methods
				 */
				// 'createQueryBuilder',
				'execute',
				// 'getKnex',
				// 'qb',
				'raw',
				/**
				 * Mongo orm entity manager methods
				 */
				// 'aggregate',
				// 'getCollection',
			].forEach((entityManagerMethod) => {
				/**
				 * add base entity methods to this.adapter if index === 0
				 * or add additional methods to methods object
				 */
				if (repositoryEntityManager[entityManagerMethod]) {
					logger.debug(`Adding entity manager method to adapter: ${entityManagerMethod}`);
					index === 0
						? /* ? (this[entityManagerMethod] = repositoryEntityManager[entityManagerMethod])
						: (methodsToAdd[entityManagerMethod] =
								repositoryEntityManager[entityManagerMethod]); */
						  (this[`_${entityManagerMethod}`] =
								repositoryEntityManager[entityManagerMethod])
						: (methodsToAdd[`_${entityManagerMethod}`] =
								repositoryEntityManager[entityManagerMethod]);
				}
			});
			logger.debug('Adding repository methods to adapter...');
			/**
			 * add entity repository methods to this.adapter or methods object
			 * methods prefixed with _ to avoid conflict with adapter custom methods
			 */
			[
				/**
				 * Base reposiitory methods
				 */
				'assign',
				'canPopulate',
				'count',
				'create',
				'find',
				'findAll',
				'findAndCount',
				'findOne',
				'findOneOrFail',
				'flush',
				'getEntityManager',
				'getReference',
				'map',
				'merge',
				'nativeDelete',
				'nativeInsert',
				'nativeUpdate',
				'persist',
				'persistAndFlush',
				'persistLater',
				'populate',
				'remove',
				'removeAndFlush',
				'removeLater',
				'upsert',
				'upsertMany',
				/**
				 * Knex reposiitory methods
				 */
				'createQueryBuilder',
				'getKnex',
				'qb',
				/**
				 * Mongo reposiitory methods
				 */
				'aggregate',
				'getCollection',
			].forEach((repositoryMethod) => {
				/**
				 * add base entity methods to this.adapter if index === 0
				 * or add additional methods to methods object
				 */
				if (dbRepository[repositoryMethod]) {
					logger.debug(`Adding repository method to adapter: ${repositoryMethod}`);
					index === 0
						? /* ? (this[repositoryMethod] = dbRepository[repositoryMethod])
						: (methodsToAdd[repositoryMethod] = dbRepository[repositoryMethod]); */
						  (this[`_${repositoryMethod}`] = dbRepository[repositoryMethod])
						: (methodsToAdd[`_${repositoryMethod}`] = dbRepository[repositoryMethod]);
				}
			});
			/**
			 * apply entity methods object to this.adapter.entityName
			 */
			index !== 0
				? (logger.debug(
						`Adding methods to ${entityName} adapter: ${JSON.stringify(methodsToAdd)}`,
				  ),
				  (this[entityName] = {
						...methodsToAdd,
						insert: this.insert,
						// updateById: this.updateById,
						// removeById: this.removeById,
						count: this.count,
						find: this.find,
						findOne: this.findOne,
						// findByIdWO: this.findByIdWO,
						// findById: this.findById,
						getPopulations: this.getPopulations,
						list: this.list,
						beforeSaveTransformID: this.beforeSaveTransformID,
						afterRetrieveTransformID: this.afterRetrieveTransformID,
						encodeID: this.encodeID,
						toMongoObjectId: this.toMongoObjectId,
						fromMongoObjectId: this.fromMongoObjectId,
						beforeQueryTransformID: this.beforeQueryTransformID,
						decodeID: this.decodeID,
						transformDocuments: this.transformDocuments,
						beforeEntityChange: this.beforeEntityChange,
						entityChanged: this.entityChanged,
						clearCache: this.clearCache,
						filterFields: this.filterFields,
						excludeFields: this.excludeFields,
						_excludeFields: this._excludeFields,
						populateDocs: this.populateDocs,
						validateEntity: this.validateEntity,
						entityToObject: this.entityToObject,
						authorizeFields: this.authorizeFields,
						sanitizeParams: this.sanitizeParams,
						broker: this.broker,
						service: this.service,
				  }))
				: null;
		});
		logger.debug('Adding forked entity manager to adapter...');
		/**
		 * set entity manager on this.adapter
		 */
		this.manager = orm.em.fork();
		/**
		 * set entity manager on this.adapter
		 */
		this._em = orm.em.fork();
		logger.debug('Adding forked repository to adapter...');
		/**
		 * set repository on this.adapter
		 */
		this.repository = orm.em
			.fork()
			.getRepository(isArray(this._entity) ? this._entity[0] : this._entity!);
		logger.debug('Adding orm to adapter...');
		/**
		 * set datasource on this.adapter
		 */
		this.orm = orm;
		logger.debug('Adding entity name to adapter...');
		/**
		 * set datasource on this.adapter
		 */
		this.entityName = orm.em.getRepository(
			isArray(this._entity) ? this._entity[0] : this._entity!,
		).entityName;
		logger.debug('Adding getEntityManager to adapter...');
		/**
		 * needed for Mikro-ORM to work, method passthrough.
		 */
		this.getEntityManager = this._getEntityManager;
	}

	/**
	 * Disconnects all connections from database and connection manager.
	 * It will be called in `broker.stop()` and is used internally.
	 * @methods
	 * @public
	 * @returns {Promise}
	 * @memberof MikroORMDbAdapter
	 */
	public async disconnect(): Promise<any> {
		this.connectionManager!.connections.forEach(async (connection: any) => {
			this.logger!.info(`Attempting to disconnect from database ${connection.name}...`);
			await this.connectionManager!.close(connection.name)
				.then((disconnected: any) =>
					disconnected === true
						? this.logger!.info(`Disconnected from database ${connection.name}`)
						: this.logger!.info(
								`Failed to disconnect from database ${connection.name}`,
						  ),
				)
				.catch((error: any) => {
					this.logger!.error(`Failed to disconnect from database ${error}`);
					new Errors.MoleculerServerError(
						`Failed to disconnect from database ${error}`,
						500,
						'FAILED_TO_DISCONNECT_FROM_DATABASE',
						error,
					);
				});
		});
		return resolve();
	}

	// -------------------------------------------------------------------------
	// Public Methods
	// -------------------------------------------------------------------------

	/**
	 * Create new record or records.
	 *
	 * @methods
	 * @param {Object | Array<Object>} entityOrEntities - record(s) to create
	 * @param {Object?} options - Optional MongoDB insert options
	 * @returns {Promise<Object | Array<Object>>}
	 * @memberof MikroORMDbAdapter
	 */
	public async create<T extends Entity>(
		ctx: Context,
		entityOrEntities: T | T[],
		options?: any,
	): Promise<any> {
		this.logger!.debug('Transforming entity id...');
		const entity = this.beforeSaveTransformID(entityOrEntities, this.service.settings.idField);
		this.logger!.debug(`Attempting to create entity: ${JSON.stringify(entity)}`);
		return isArray(entityOrEntities)
			? await this['_upsertMany'](entity, options)
					.then(async (doc: any) => {
						this.logger!.debug('Transforming created entity...');
						return await this.transformDocuments(ctx, ctx.params, doc);
					})
					.catch((err: any) => {
						this.logger!.error(`Failed to create entity: ${err}`);
						return new Errors.MoleculerServerError(
							`Failed to create entity: ${JSON.stringify(entity)}`,
							500,
							'FAILED_TO_CREATE_ENTITY',
							err,
						);
					})
			: await this['_create'](entity, options)
					.then(async (doc: any) => {
						this.logger!.debug('Transforming created entity...');
						return await this.transformDocuments(ctx, ctx.params, doc);
					})
					.catch((err: any) => {
						this.logger!.error(`Failed to create entity: ${err}`);
						return new Errors.MoleculerServerError(
							`Failed to create entity: ${JSON.stringify(entity)}`,
							500,
							'FAILED_TO_CREATE_ENTITY',
							err,
						);
					});
	}

	/**
	 * Create many new entities.
	 *
	 * @methods
	 *
	 * @param {Context} ctx - Context instance.
	 * @param {Object?} entityOrEntities - entity or entities to create.
	 * @param {Object?} options - Create options.
	 *
	 * @returns {Object|Object[]} Saved entity(ies).
	 */
	public insert(ctx: Context, entityOrEntities: any, options?: any): object | object[] {
		return resolve()
			.then(async () => {
				if (isArray(entityOrEntities)) {
					return (
						all(
							entityOrEntities.map(
								async (entity: any) =>
									await this.beforeEntityChange('create', entity, ctx),
							),
						)
							.then(async (entities) => {
								this.logger!.debug(`Validating entities to create: ${entities}`);
								return this.validateEntity(entities);
							})
							.then((entities) =>
								all(
									entities.map(async (entity: any) =>
										this.beforeEntityChange('create', entity, ctx),
									),
								),
							)
							// Apply idField
							.then((entities) => {
								if (this.service.settings.idField === '_id') {
									return entities;
								}
								return entities.map((entity) => {
									this.logger!.debug('Transforming entity id...');
									return this.beforeSaveTransformID(
										entity,
										this.service.settings.idField,
									);
								});
							})
							.then(async (entities) => {
								this.logger!.debug(`Attempting to create entities: ${entities}`);
								return await this['_upserttMany'](entities, options);
							})
							.then(
								async (entities) =>
									await this.findById(
										ctx,
										Object.entries(entities.insertedIds).map(
											(key) => key[1],
										) as any,
									),
							)
							.then(
								async (entities) =>
									await this.transformDocuments(ctx, ctx.params, entities),
							)
					);
				} else if (!isArray(entityOrEntities) && isObject(entityOrEntities)) {
					return (
						this.beforeEntityChange('create', entityOrEntities, ctx)
							.then(async (entity: any) => await this.validateEntity(entity))
							// Apply idField
							.then((entity: any) =>
								this.beforeSaveTransformID(entity, this.service.settings.idField),
							)
							.then(async (entity: any) => {
								this.logger!.debug(`Attempting to create entity: ${entity}`);
								return await this['_create'](entity, options);
							})
							.then(async (entities) => await this.findById(ctx, entities.insertedId))
					);
				}
				return reject(
					new Errors.MoleculerClientError(
						"Invalid request! The 'params' must contain 'entityOrEntities'!",
						400,
					),
				);
			})
			.then(async (docs) => await this.transformDocuments(ctx, ctx.params, docs))
			.then(async (json) => await this.entityChanged('created', json, ctx).then(() => json))
			.catch((err: any) => {
				this.logger!.error(`Failed to create entity: ${err}`);
				return new Errors.MoleculerServerError(
					`Failed to create entity: ${JSON.stringify(entityOrEntities)}`,
					500,
					'FAILED_TO_CREATE_ENTITY',
					err,
				);
			});
	}

	/**
	 * Update an entity by ID
	 * @methods
	 * @param {Context} ctx - request context
	 * @param {any} id - ID of record to be updated
	 * @param {Object} update - Object with update data
	 * @returns {Promise} - Updated record
	 * @memberof MikroORMDbAdapter
	 */
	/* public async updateById(ctx: Context, id: any, update: any): Promise<any> {
		const params = this.sanitizeParams(ctx, update);
		this.logger!.debug(`Updating entity by ID '${id}' with ${JSON.stringify(params)}`);
		const updatedColumn: any =
			this.repository!.metadata.ownColumns[0].entityMetadata.updateDateColumn;
		if (!isUndefined(updatedColumn) && this.opts.type === 'mongodb') {
			params[updatedColumn!.propertyName] = new Date();
		}
		const entity = await this['_update'](
			this.opts.type !== 'mongodb' ? id : this.toMongoObjectId(id),
			params,
		)
			.then(async (docs: any) => {
				this.logger!.debug(`Updated entity by ID '${id}': ${docs}`);
				const entity = await this.findById(ctx, null, id);
				this.logger!.debug('Transforming update docs...');
				return this.transformDocuments(ctx, params, entity);
			})
			.catch((error: any) => {
				this.logger!.error(`Failed to updateById ${error}`);
				new Errors.MoleculerServerError(
					`Failed to updateById ${error}`,
					500,
					'FAILED_TO_UPDATE_BY_ID',
					error,
				);
			});
		return this.afterRetrieveTransformID(entity, this.service.settings.idField);
	} */

	/**
	 * Remove an entity by ID
	 *
	 * @param {any} id
	 * @returns {Promise}
	 * @memberof MemoryDbAdapter
	 */
	public async removeById(id: any) {
		const transformId: any = this.beforeQueryTransformID(id);
		return await this['_removeAndFlush']({ [transformId]: id }).catch((error: any) => {
			this.logger!.error(`Failed to updateById ${error}`);
			return new Errors.MoleculerServerError(
				`Failed to updateById ${error}`,
				500,
				'FAILED_TO_UPDATE_BY_ID',
				error,
			);
		});
	}

	/**
	 * Count number of matching documents in the db to a query.
	 *
	 * @methods
	 * @param {Object} options - count options
	 * @param {Object?} query - query options
	 * @returns {Promise<number>}
	 * @memberof MikroORMDbAdapter
	 */
	public async count(where?: any, options?: any): Promise<number> {
		return this['_count'](where, options);
	}

	/**
	 * Finds entities that match given find options.
	 *
	 * @methods
	 * @param {Context} ctx - request context
	 * @param {Object} findManyOptions - find many options
	 * @returns {Promise<T[] | number[]>}
	 * @memberof MikroORMDbAdapter
	 */
	public async find<T extends Entity>(ctx: Context): Promise<[T[], number]> {
		// const params = this.sanitizeParams(ctx, ctx.params);
		const params = ctx.params;
		return await this['_find'](params)
			.then(async (docs: any) => {
				this.logger!.debug('Transforming find docs...');
				return await this.transformDocuments(ctx, params, docs);
			})
			.catch((error: any) => {
				this.logger!.error(`Failed to find ${error}`);
				return new Errors.MoleculerServerError(
					`Failed to find ${error}`,
					500,
					'FAILED_TO_FIND_ONE_BY_OPTIONS',
					error,
				);
			});
	}

	/**
	 * Finds first item by a given find options.
	 * If entity was not found in the database - returns null.
	 * Available Options props:
	 * - comment
	 * - select
	 * - where
	 * - relations
	 * - relationLoadStrategy
	 * - join
	 * - order
	 * - cache
	 * - lock
	 * - withDeleted
	 * - loadRelationIds
	 * - loadEagerRelations
	 * - transaction
	 *
	 * @methods
	 * @param {Context} ctx - request context
	 * @param {Object} findOptions - find options
	 * @returns {Promise<T | undefined>}
	 * @memberof MikroORMDbAdapter
	 */
	public async findOne<T extends Entity>(
		ctx: Context,
		findOptions?: any,
	): Promise<T | undefined> {
		const params = this.sanitizeParams(ctx, ctx.params);
		const entity = await this['_findOne'](findOptions)
			.then(async (docs: any) => {
				this.logger!.debug('Transforming findOne docs...');
				return await this.transformDocuments(ctx, params, docs);
			})
			.catch((error: any) => {
				this.logger!.error(`Failed to findOne: ${error}`);
				return new Errors.MoleculerServerError(
					`Failed to findOne ${error}`,
					500,
					'FAILED_TO_FIND_ONE',
					error,
				);
			});
		/* return this.afterRetrieveTransformID(entity, this.service.settings.idField) as
			| T
			| undefined; */
		return entity as T | undefined;
	}

	/**
	 * Gets item by id(s). Can use find options, no where clause.
	 * @methods
	 * @param {Context} ctx - request context
	 * @param {Partial<T>} key - primary db id column name
	 * @param {string | number | string[] | number[]} id - id(s) of entity
	 * @param {Object} findOptions - find options, like relations, order, etc. No where clause
	 * @returns {Promise<T | undefined>}
	 * @memberof MikroORMDbAdapter
	 */
	/* async findByIdWO<T extends Entity>(
		ctx: Context,
		key: string | undefined | null = this.service.settings.idField,
		id: string | number | string[] | number[],
		findOptions?: any,
	): Promise<T | undefined> {
		const transformId = this.beforeQueryTransformID(key);
		const params = this.sanitizeParams(ctx, ctx.params);
		const entity =
			this.opts.type !== 'mongodb'
				? isArray(id)
					? await this['_find']({
							where: { [transformId]: In([...id]) },
							...findOptions,
					  })
							.then((docs: any) => {
								this.logger!.debug('Transforming findByIdWO docs...');
								return this.transformDocuments(ctx, params, docs);
							})
							.catch((error: any) => {
								this.logger!.error(`Failed to findByIdWO ${error}`);
								new Errors.MoleculerServerError(
									`Failed to findByIdWO ${error}`,
									500,
									'FAILED_TO_FIND_BY_ID_WO',
									error,
								);
							})
					: await this['_findOneOrFail']({
							where: { [transformId]: In([id]) },
							...findOptions,
					  })
							.then((docs: any) => {
								this.logger!.debug('Transforming findByIdWO docs...');
								return this.transformDocuments(ctx, params, docs);
							})
							.catch((error: any) => {
								this.logger!.error(`Failed to findByIdWO ${error}`);
								new Errors.MoleculerServerError(
									`Failed to findByIdWO ${error}`,
									500,
									'FAILED_TO_FIND_BY_ID_WO',
									error,
								);
							})
				: isArray(id)
				? await this['_find']({
						where: {
							[transformId]: {
								$in: [
									...map(id, (recordId: any) => this.toMongoObjectId(recordId)),
								],
								// $in: [...[id.forEach((recordId: any) => new ObjectId(recordId))]],
							},
							...findOptions,
						},
				  })
						.then((docs: any) => {
							this.logger!.debug('Transforming findByIdWO docs...');
							return this.transformDocuments(ctx, params, docs);
						})
						.catch((error: any) => {
							this.logger!.error(`Failed to findByIdWO ${error}`);
							new Errors.MoleculerServerError(
								`Failed to findByIdWO ${error}`,
								500,
								'FAILED_TO_FIND_BY_ID_WO',
								error,
							);
						})
				: await this['_findOneOrFail']({
						where: { [transformId]: { $in: [this.toMongoObjectId(id)] } },
						...findOptions,
				  })
						.then((docs: any) => {
							this.logger!.debug('Transforming findByIdWO docs...');
							return this.transformDocuments(ctx, params, docs);
						})
						.catch((error: any) => {
							this.logger!.error(`Failed to findByIdWO ${error}`);
							new Errors.MoleculerServerError(
								`Failed to findByIdWO ${error}`,
								500,
								'FAILED_TO_FIND_BY_ID_WO',
								error,
							);
						}); // needed for mongodb
		return this.afterRetrieveTransformID(entity, this.service.settings.idField) as
			| T
			| undefined;
	} */

	/**
	 * Gets item by id(s). No find options can be provided
	 * @methods
	 * @param {Context} ctx - request context
	 * @param {Partial<T>} key - primary db id column name
	 * @param {string | number | string[] | number[]} id - id(s) of entity
	 * @returns {Promise<T | undefined>}
	 * @memberof MikroORMDbAdapter
	 *
	 */
	public async findById<T extends Entity>(
		ctx: Context,
		// key: string | undefined | null = this.service.settings.idField,
		id: string | number | string[] | number[],
	): Promise<T | undefined> {
		// const transformId = this.beforeQueryTransformID(key);
		const params = this.sanitizeParams(ctx, ctx.params);
		// const entity =

		return isArray(id)
			? // ? await this['_find']([...map(id, (recordId: any) => this.toMongoObjectId(recordId))])
			  await this['_find'](id)
					.then(async (docs: any) => {
						this.logger!.debug('Transforming findByIdWO docs...');
						return await this.transformDocuments(ctx, params, docs);
					})
					.catch((error: any) => {
						this.logger!.error(`Failed to findById ${error}`);
						return new Errors.MoleculerServerError(
							`Failed to findById ${error}`,
							500,
							'FAILED_TO_FIND_BY_ID',
							error,
						);
					})
			: // : await this['_findOneOrFail'](this.toMongoObjectId(id))
			  await this['_findOneOrFail'](id)
					.then(async (docs: any) => {
						this.logger!.debug('Transforming findByIdWO docs...');
						return await this.transformDocuments(ctx, params, docs);
					})
					.catch((error: any) => {
						this.logger!.error(`Failed to findById ${error}`);
						return new Errors.MoleculerServerError(
							`Failed to findById ${error}`,
							500,
							'FAILED_TO_FIND_BY_ID',
							error,
						);
					});
	}

	/**
	 * Populates entity(ies) by id(s) of another record.
	 *
	 * @methods
	 *
	 * @param {Context} ctx - Context instance.
	 * @param {Object?} params - Parameters.
	 *
	 * @returns {Object|Array<Object>} Found entity(ies).
	 *
	 * @throws {EntityNotFoundError} - 404 Entity not found
	 */
	public getPopulations(ctx: Context, params?: any): object | object[] {
		const id = params.id;
		let origDoc: any;
		const shouldMapping = params.mapping === true;
		return this['findById'](ctx, id)
			.then(async (doc) => {
				if (!doc) {
					return Promise.reject(
						new Errors.MoleculerServerError(
							`Failed to findById ${id}`,
							500,
							'FAILED_TO_FIND_BY_ID',
						),
					);
				}

				if (shouldMapping) {
					origDoc = isArray(doc) ? doc.map((d) => cloneDeep(d)) : cloneDeep(doc);
				} else {
					origDoc = doc;
				}

				return this.transformDocuments(ctx, params, doc);
			})
			.then((json) => {
				if (params.mapping !== true) {
					return json;
				}

				const res: any = {};
				if (isArray(json)) {
					json.forEach((doc, i) => {
						const docId = this.encodeID(
							// @ts-ignore
							this.afterRetrieveTransformID(
								origDoc[i],
								this.service.settings.idField,
							)[this.service.settings.idField],
						);
						res[docId] = doc;
					});
				} else if (isObject(json)) {
					const docId = this.encodeID(
						// @ts-ignore
						this.afterRetrieveTransformID(origDoc, this.service.settings.idField)[
							this.service.settings.idField
						],
					);
					res[docId] = json;
				}
				return res;
			});
	}

	/**
	 * List entities from db using filters and pagination results.
	 * @methods
	 * @param {Context} ctx - Context instance.
	 * @param {ListParams<Object>?} params - Optional parameters.
	 * @returns {Object} List of found entities and count.
	 * @memberof MikroORMDbAdapter
	 */
	public list(ctx: Context, params: any): object {
		const countParams = Object.assign({}, params);
		// Remove pagination params
		if (countParams && countParams.limit) {
			countParams.limit = null;
		}
		if (countParams && countParams.offset) {
			countParams.offset = null;
		}
		if (params.limit == null) {
			if (this.service.settings.limit > 0 && params.pageSize! > this.service.settings.limit) {
				params.limit = this.service.settings.limit;
			} else {
				params.limit = params.pageSize;
			}
		}
		this.logger!.debug(`Listing entities with ${JSON.stringify(params)}`);
		return Promise.all([
			this.logger!.warn('Finding rows and counting using params: ', params),
			// Get rows
			// this['find'](params),
			// this.logger!.warn('Getting count using params: ', countParams),
			// Get count of all rows
			// this['count'](countParams),
			this['_findAndCount']({}, params),
		]).then(
			async (res) =>
				await this.transformDocuments(ctx, params, res[1][0]).then((docs) => ({
					// Rows
					rows: docs,
					// Total rows
					total: res[1][1],
					// Page
					page: params.page,
					// Page size
					pageSize: params.pageSize,
					// Total pages
					totalPages: Math.floor((res[1][1] + params.pageSize! - 1) / params.pageSize!),
				})),
		);
	}

	/**
	 * Transforms user defined idField into expected db id field name.
	 * @methods
	 * @param {Object} entity - Record to be saved
	 * @param {String} idField - user defined service idField
	 * @returns {Object} - Modified entity
	 * @memberof MikroORMDbAdapter
	 */
	public beforeSaveTransformID(entity: any, idField: string): object {
		let newEntity = cloneDeep(entity);
		// gets the idField from the entity
		const dbIDField =
			this.opts.type === 'mongodb'
				? '_id'
				: find(this.manager?.getMetadata()['metadata'][this.entityName!].props, {
						primary: true,
				  }).name;

		if (idField !== dbIDField && entity[idField] !== undefined) {
			newEntity = JSON.parse(
				replace(
					JSON.stringify(newEntity),
					new RegExp(`"${idField}":`, 'g'),
					`"${dbIDField}":`,
				),
			);
		}

		return newEntity;
	}

	/**
	 * Transforms db field name into user defined idField service property
	 * @methods
	 * @param {Object} entity = Record retrieved from db
	 * @param {String} idField - user defined service idField
	 * @returns {Object} - Modified entity
	 * @memberof MikroORMDbAdapter
	 */
	public afterRetrieveTransformID(entity: any, idField: string): object {
		// gets the idField from the entity
		const dbIDField = find(this.manager?.getMetadata()['metadata'][this.entityName!].props, {
			primary: true,
		}).name;
		let newEntity;
		if (!entity.hasOwnProperty(idField)) {
			newEntity = JSON.parse(
				replace(
					JSON.stringify(entity),
					new RegExp(`"${dbIDField}":`, 'g'),
					`"${idField}":`,
				),
			);
		} else {
			newEntity = entity;
		}
		return newEntity;
	}

	/**
	 * Encode ID of entity.
	 * @methods
	 * @param {any} id
	 * @returns {any}
	 * @memberof MikroORMDbAdapter
	 */
	public encodeID(id: any): any {
		return id;
	}

	/**
	 * Convert id to mongodb ObjectId.
	 * @methods
	 * @param {any} id
	 * @returns {any}
	 * @memberof MikroORMDbAdapter
	 */
	public toMongoObjectId(id: any): ObjectId {
		return new ObjectId(id);
	}

	/**
	 * Convert mongodb ObjectId to string.
	 * @methods
	 * @param {any} id
	 * @returns {any}
	 * @memberof MikroORMDbAdapter
	 */
	public fromMongoObjectId(id: any): string {
		return id.toString();
	}

	/**
	 * Transform user defined idField service property into the expected id field of db.
	 * @methods
	 * @param {any} idField - user defined service idField
	 * @returns {Object} - Record to be saved
	 * @memberof MikroORMDbAdapter
	 */
	public beforeQueryTransformID(idField: any): any {
		const dbIDField =
			this.opts.type === 'mongodb'
				? '_id'
				: find(this.manager?.getMetadata()['metadata'][this.entityName!].props, {
						primary: true,
				  }).name;
		if (idField !== dbIDField) {
			return dbIDField;
		}
		return idField;
	}

	/**
	 * Decode ID of entity.
	 * @methods
	 * @param {any} id
	 * @returns {any}
	 * @memberof MikroORMDbAdapter
	 */
	public decodeID(id: any): any {
		return id;
	}

	/**
	 * Transform the fetched documents by converting id to user defind idField,
	 * filtering the fields according to the fields service property,
	 * and populating the document with the relations specified in the populate service property.
	 * @methods
	 * @param {Context} ctx - Context of the request
	 * @param {Object} 	params - Params of the request
	 * @param {Array|Object} docs - Records to be transformed
	 * @returns {Array|Object} - Transformed records
	 * @memberof MikroORMDbAdapter
	 */
	public async transformDocuments(ctx: any, params: any, docs: any): Promise<any[] | object> {
		this.logger!.debug('Transforming documents..');
		let isDoc = false;
		this.logger!.debug(`Setting userDefinedIDField to ${this.service.settings.idField}`);
		const userDefinedIDField = this.service.settings.idField;
		this.logger!.debug('Checking if docs is an array or an object..');
		if (!isArray(docs)) {
			this.logger!.debug('Docs is not an array');
			if (isObject(docs)) {
				this.logger!.debug('Docs is an object, converting to array..');
				isDoc = true;
				docs = [docs];
			} else {
				this.logger!.debug('Docs is not an object, returning docs..');
				return resolve(docs);
			}
		}

		return (
			resolve(docs)
				// Convert entity to JS object
				.then((entity) =>
					all(
						entity.map((doc: any) => {
							this.logger!.debug('Converting entity to JS object...');
							return this.entityToObject(doc);
						}),
					),
				)

				// Apply idField
				.then((entity) =>
					entity.map((doc: any) => {
						this.logger!.debug('Applying idField to docs...');
						return this.afterRetrieveTransformID(doc, userDefinedIDField);
						// return this.afterRetrieveTransformID(doc, userDefinedIDField);
						// return doc;
					}),
				)
				// Encode IDs
				.then((entity) =>
					entity.map((doc: { [x: string]: any }) => {
						this.logger!.debug('Encoding IDs..');
						doc[userDefinedIDField] = this.encodeID(doc[userDefinedIDField]);
						return doc;
					}),
				)
				// Populate
				.then(async (json) => {
					this.logger!.debug(`Populating docs with ${params.populate}..`);
					return ctx && params.populate
						? await this.populateDocs(ctx, json, params.populate)
						: json;
				})

				// TODO onTransformHook

				// Filter fields
				.then((json) => {
					this.logger!.debug('Attempting to filter fields..');
					if (ctx && params.fields) {
						this.logger!.debug('Fields found in params..');
						const fields = isString(params.fields)
							? // Compatibility with < 0.4
							  /* istanbul ignore next */
							  params.fields.split(/\s+/)
							: params.fields;
						// Authorize the requested fields
						this.logger!.debug('Authorizing fields..');
						const authFields = this.authorizeFields(fields);
						this.logger!.debug('Filtering fields and returning object..');
						return json.map((item: any) => this.filterFields(item, authFields));
					} else {
						this.logger!.debug(
							'No fields found in params, returning filtered object..',
						);
						return json.map((item: any) =>
							this.filterFields(item, this.service.settings.fields),
						);
					}
				})

				// Filter excludeFields
				.then((json) => {
					this.logger!.debug('Attempting to filter excludeFields..');
					const askedExcludeFields =
						ctx && params.excludeFields
							? isString(params.excludeFields)
								? params.excludeFields.split(/\s+/)
								: params.excludeFields
							: [];
					const excludeFields = askedExcludeFields.concat(
						this.service.settings.excludeFields || [],
					);
					if (Array.isArray(excludeFields) && excludeFields.length > 0) {
						this.logger!.debug(
							'ExcludeFields found in params, returning filtered object..',
						);
						return json.map((doc: any) => this._excludeFields(doc, excludeFields));
					} else {
						this.logger!.debug('No excludeFields found in params, returning object..');
						return json;
					}
				})

				// Return
				.then((json) => {
					this.logger!.debug('Returning json object..');
					return isDoc ? json[0] : json;
				})
				.catch((err) => {
					/* istanbul ignore next */
					this.logger!.error('Transforming documents is failed!', err);
					throw new Errors.MoleculerServerError(
						`Failed to transform documents ${err}`,
						500,
						'FAILED_TO_TRANSFORM_DOCUMENTS',
						err,
					);
				})
		);
	}

	/**
	 * Call before entity lifecycle events
	 * @methods
	 * @param {String} type
	 * @param {Object} entity
	 * @param {Context} ctx
	 * @returns {Promise}
	 * @memberof MikroORMDbAdapter
	 */
	public async beforeEntityChange(type: string | undefined, entity: any, ctx: any): Promise<any> {
		const eventName = `beforeEntity${capitalize(type)}`;
		if (this.service.schema[eventName] == null) {
			return resolve(entity);
		}
		return resolve(this.service.schema[eventName].call(this, entity, ctx));
	}

	/**
	 * Clear the cache & call entity lifecycle events
	 * @methods
	 * @param {String} type
	 * @param {Object|Array<Object>|Number} json
	 * @param {Context} ctx
	 * @returns {Promise}
	 * @memberof MikroORMDbAdapter
	 */
	public async entityChanged(type: string | undefined, json: any, ctx: any): Promise<any> {
		return await this.clearCache().then(async () => {
			const eventName = `entity${capitalize(type)}`;
			if (this.service.schema[eventName] != null) {
				return await this.service.schema[eventName].call(this, json, ctx);
			}
		});
	}

	/**
	 * Clear cached entities
	 * @methods
	 * @returns {Promise}
	 * @memberof MikroORMDbAdapter
	 */
	public async clearCache(): Promise<any> {
		this.broker[this.service.settings.cacheCleanEventType](`cache.clean.${this.fullName}`);
		if (this.broker.cacher) {
			return await this.broker.cacher.clean(`${this.fullName}.**`);
		}
		return resolve();
	}

	/**
	 * Filter fields in the entity object
	 * @methods
	 * @param {Object} doc - Record to be filtered.
	 * @param {Array<String>} fields - Filter properties of model.
	 * @returns	{Object} - Filtered record
	 * @memberof MikroORMDbAdapter
	 */
	public filterFields(doc: any, fields: any[]): object {
		// Apply field filter (support nested paths)
		if (isArray(fields)) {
			const res = {};
			fields.forEach((n) => {
				const v = get(doc, n);
				if (v !== undefined) {
					set(res, n, v);
				}
			});
			return res;
		}

		return doc;
	}

	/**
	 * Exclude fields in the entity object
	 * @methods
	 * @param {Object} doc - Record to be filtered.
	 * @param {Array<String>} fields - Exclude properties of model.
	 * @returns	{Object} - Recored without excluded fields
	 * @memberof MikroORMDbAdapter
	 */
	public excludeFields(doc: any, fields: string | any[]): object {
		if (Array.isArray(fields) && fields.length > 0) {
			return this._excludeFields(doc, fields);
		}

		return doc;
	}
	/**
	 * Populate documents for relations.
	 * Used when relations between records between different databases can't be done.
	 * Populates the retreived record by calling service action with the `id` of the relation.
	 * Does not update related document at this time
	 * @methods
	 * @param {Context} ctx - Request context
	 * @param {Array|Object} docs - Records to be populated
	 * @param {Array?} populateFields - Fields to be populated
	 * @returns	{Promise} - Record with populated fields of relation
	 * @memberof MikroORMDbAdapter
	 */
	public async populateDocs(ctx: any, docs: any, populateFields?: any[]): Promise<any> {
		this.logger!.debug('Attempting to populate documents..');
		if (
			!this.service.settings.populates ||
			!isArray(populateFields) ||
			populateFields.length === 0
		) {
			return resolve(docs);
		}

		if (docs == null || (!isObject(docs) && !isArray(docs))) {
			return resolve(docs);
		}

		const settingPopulateFields = Object.keys(this.service.settings.populates);

		/* Group populateFields by populatesFields for deep population.
			(e.g. if "post" in populates and populateFields = ["post.author", "post.reviewer", "otherField"])
			then they would be grouped together: { post: ["post.author", "post.reviewer"], otherField:["otherField"]}
			*/
		const groupedPopulateFields = populateFields.reduce((obj, populateField) => {
			const settingPopulateField = settingPopulateFields.find(
				(settingPopulateFieldString) =>
					settingPopulateFieldString === populateField ||
					populateField.startsWith(settingPopulateFieldString + '.'),
			);
			if (settingPopulateField != null) {
				if (obj[settingPopulateField] == null) {
					obj[settingPopulateField] = [populateField];
				} else {
					obj[settingPopulateField].push(populateField);
				}
			}
			return obj;
		}, {});

		const promises = [];
		for (const populatesField of settingPopulateFields) {
			let rule = this.service.settings.populates[populatesField];
			if (groupedPopulateFields[populatesField] == null) {
				continue;
			} // skip

			// if the rule is a function, save as a custom handler
			if (isFunction(rule)) {
				rule = {
					handler: method(rule),
				};
			}

			// If the rule is string, convert to object
			if (isString(rule)) {
				rule = {
					action: rule,
				};
			}

			if (rule.field === undefined) {
				rule.field = populatesField;
			}

			const arr = isArray(docs) ? docs : [docs];

			// Collect IDs from field of docs (flatten, compact & unique list)
			const idList = uniq(flattenDeep(compact(arr.map((doc) => get(doc, rule.field)))));
			// Replace the received models according to IDs in the original docs
			const resultTransform = (populatedDocs: any) => {
				arr.forEach((doc) => {
					const id = get(doc, rule.field);
					if (isArray(id)) {
						const models = compact(id.map((docId) => populatedDocs[docId]));
						set(doc, populatesField, models);
					} else {
						set(doc, populatesField, populatedDocs[id]);
					}
				});
			};

			if (rule.handler) {
				promises.push(rule.handler.call(this, idList, arr, rule, ctx));
			} else if (idList.length > 0) {
				// Call the target action & collect the promises
				const params = Object.assign(
					{
						id: idList,
						mapping: true,
						populate: [
							// Transform "post.author" into "author" to pass to next populating service
							...groupedPopulateFields[populatesField]
								.map((populateField: string | any[]) =>
									populateField.slice(populatesField.length + 1),
								) // +1 to also remove any leading "."
								.filter((field: string) => field !== ''),
							...(rule.populate ? rule.populate : []),
						],
					},
					rule.params || {},
				);

				if (params.populate.length === 0) {
					delete params.populate;
				}

				promises.push(ctx.call(rule.action, params).then(resultTransform));
			}
		}

		return all(promises).then(() => docs);
	}

	/**
	 * Validate an entity by validator.
	 * Uses the `entityValidator` setting. If no validator function is supplied, returns record.
	 * @methods
	 * @param {Object} entity - Record to be validated
	 * @returns {Promise} - Validated record or unvalitaded record if no validator function is supplied.
	 * @memberof MikroORMDbAdapter
	 */
	public async validateEntity(entity: any): Promise<any> {
		if (!isFunction(this.service.settings.entityValidator)) {
			return resolve(entity);
		}

		const entities = isArray(entity) ? entity : [entity];
		return all(
			entities.map((entityToValidate) =>
				this.service.settings.entityValidator.call(this, entityToValidate),
			),
		).then(() => entity);
	}

	/**
	 * Convert DB entity to JSON object
	 * @methods
	 * @param {any} entity - Record to be converted
	 * @returns {Object} - JSON object of record
	 * @memberof MikroORMDbAdapter
	 */
	public entityToObject(entity: any): object {
		return entity;
	}

	/**
	 * Authorize the required field list. Remove fields which does not exist in the `this.service.settings.fields`
	 * @methods
	 * @param {Array} askedFields - List of fields to be authorized
	 * @returns {Array} - Authorized list of fields
	 * @memberof MikroORMDbAdapter
	 */
	public authorizeFields(askedFields: any[]): any[] {
		if (this.service.settings.fields && this.service.settings.fields.length > 0) {
			let allowedFields: any[] = [];
			if (isArray(askedFields) && askedFields.length > 0) {
				askedFields.forEach((askedField) => {
					if (this.service.settings.fields.indexOf(askedField) !== -1) {
						allowedFields.push(askedField);
						return;
					}

					if (askedField.indexOf('.') !== -1) {
						const parts = askedField.split('.');
						while (parts.length > 1) {
							parts.pop();
							if (this.service.settings.fields.indexOf(parts.join('.')) !== -1) {
								allowedFields.push(askedField);
								return;
							}
						}
					}

					const nestedFields = this.service.settings.fields.filter(
						(settingField: string) => settingField.startsWith(askedField + '.'),
					);
					if (nestedFields.length > 0) {
						allowedFields = allowedFields.concat(nestedFields);
					}
				});
				// return _.intersection(f, this.service.settings.fields);
			}
			return allowedFields;
		}

		return askedFields;
	}

	/**
	 * Sanitize context parameters at `find` action.
	 *
	 * @methods
	 *
	 * @param {Context} ctx - Request context
	 * @param {Object} params - Request parameters
	 * @returns {Object} - Sanitized parameters
	 * @memberof MikroORMDbAdapter
	 */
	public sanitizeParams(ctx: any, params: any) {
		const p = Object.assign({}, params);

		// Convert from string to number
		if (typeof p.limit === 'string') {
			p.limit = Number(p.limit);
		}
		if (typeof p.offset === 'string') {
			p.offset = Number(p.offset);
		}
		if (typeof p.page === 'string') {
			p.page = Number(p.page);
		}
		if (typeof p.pageSize === 'string') {
			p.pageSize = Number(p.pageSize);
		}
		// Convert from string to POJO
		if (typeof p.query === 'string') {
			p.query = JSON.parse(p.query);
		}

		if (typeof p.sort === 'string') {
			p.sort = p.sort.split(/[,\s]+/);
		}

		if (typeof p.fields === 'string') {
			p.fields = p.fields.split(/[,\s]+/);
		}

		if (typeof p.excludeFields === 'string') {
			p.excludeFields = p.excludeFields.split(/[,\s]+/);
		}

		if (typeof p.populate === 'string') {
			p.populate = p.populate.split(/[,\s]+/);
		}

		if (typeof p.searchFields === 'string') {
			p.searchFields = p.searchFields.split(/[,\s]+/);
		}

		console.log('ctx.action.name', ctx.action.name);
		if (ctx.action.name.endsWith('.list')) {
			// Default `pageSize`
			if (!p.pageSize) {
				p.pageSize = this.service.settings.pageSize;
			}

			// Default `page`
			if (!p.page) {
				p.page = 1;
			}

			// Limit the `pageSize`
			if (
				this.service.settings.maxPageSize > 0 &&
				p.pageSize > this.service.settings.maxPageSize
			) {
				p.pageSize = this.service.settings.maxPageSize;
			}

			// Calculate the limit & offset from page & pageSize
			p.limit = p.pageSize;
			p.offset = (p.page - 1) * p.pageSize;
		}
		// Limit the `limit`
		if (this.service.settings.maxLimit > 0 && p.limit > this.service.settings.maxLimit) {
			p.limit = this.service.settings.maxLimit;
		}

		return p;
	}

	/**
	 * Exclude fields in the entity object. Internal use only, must ensure `fields` is an Array
	 */
	private _excludeFields(doc: any, fields: any[]) {
		const res = cloneDeep(doc);
		fields.forEach((field) => {
			unset(res, field);
		});
		return res;
	}
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MikroORMServiceSchemaMixin = (mixinOptions?: any) => {
	const mixin = defaultsDeep(
		{
			// Must overwrite it
			name: '',

			// Service's metadata
			metadata: {
				$category: 'database',
				$description: 'Mikro-ORM Data Access service',
				$official: false,
				$package: {
					name,
					version,
					repo: repository ? repository.url : null,
				},
			},

			// Store adapter (NeDB adapter is the default)
			adapter: null,

			/**
			 * Default settings
			 */
			settings: {
				/** @type {String} Name of ID field. */
				idField: '_id',

				// eslint-disable-next-line max-len
				/** @type {Array<String>?} Field filtering list. It must be an `Array`. If the value is `null` or `undefined` doesn't filter the fields of entities. */
				fields: null,

				/** @type {Array<String>?} List of excluded fields. It must be an `Array`. The value is `null` or `undefined` will be ignored. */
				excludeFields: null,

				/** @type {Array?} Schema for population. [Read more](#populating). */
				populates: null,

				/** @type {Number} Default page size in `list` action. */
				pageSize: 10,

				/** @type {Number} Maximum page size in `list` action. */
				maxPageSize: 100,

				/** @type {Number} Maximum value of limit in `find` action. Default: `-1` (no limit) */
				maxLimit: -1,

				/** @type {Object|Function} Validator schema or a function to validate the incoming entity in `create` & 'insert' actions. */
				entityValidator: null,

				/** @type {Boolean} Whether to use dot notation or not when updating an entity. Will **not** convert Array to dot notation. Default: `false` */
				useDotNotation: false,

				/** @type {String} Type of cache clean event type. Values: "broadcast" or "emit" */
				cacheCleanEventType: 'broadcast',
			},

			/**
			 * Actions
			 */
			actions: {
				/**
				 * Find entities by query.
				 *
				 * @actions
				 * @cached
				 *
				 * @param {String|Array<String>} populate - Populated fields.
				 * @param {String|Array<String>} fields - Fields filter.
				 * @param {String|Array<String>} excludeFields - List of excluded fields.
				 * @param {Number?} limit - Max count of rows.
				 * @param {Number?} offset - Count of skipped rows.
				 * @param {String?} sort - Sorted fields.
				 * @param {String?} search - Search text.
				 * @param {String|Array<String>} searchFields - Fields for searching.
				 * @param {Object?} query - Query object. Passes to adapter.
				 *
				 * @returns {Array<Object>} List of found entities.
				 */
				find: {
					cache: {
						keys: [
							'populate',
							'fields',
							'excludeFields',
							'limit',
							'offset',
							'sort',
							'search',
							'searchFields',
							'query',
						],
					},
					params: {
						populate: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						fields: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						excludeFields: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						take: {
							type: 'number',
							integer: true,
							min: 0,
							optional: true,
							convert: true,
						},
						skip: {
							type: 'number',
							integer: true,
							min: 0,
							optional: true,
							convert: true,
						},
						limit: {
							type: 'number',
							integer: true,
							min: 0,
							optional: true,
							convert: true,
						},
						offset: {
							type: 'number',
							integer: true,
							min: 0,
							optional: true,
							convert: true,
						},
						sort: { type: 'string', optional: true },
						search: { type: 'string', optional: true },
						searchFields: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						query: [
							{ type: 'object', optional: true },
							{ type: 'string', optional: true },
						],
					},
					handler(
						ctx: Context<{
							params: any;
						}>,
					): any {
						// @ts-ignore
						const params = this.adapter.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return this._find(params);
					},
				},

				/**
				 * Get count of entities by query.
				 *
				 * @actions
				 * @cached
				 *
				 * @param {String?} search - Search text.
				 * @param {String|Array<String>} searchFields - Fields list for searching.
				 * @param {Object?} query - Query object. Passes to adapter.
				 *
				 * @returns {Number} Count of found entities.
				 */
				count: {
					cache: {
						keys: ['search', 'searchFields', 'query'],
					},
					params: {
						options: { type: 'object', optional: true },
						query: { type: 'object', optional: true },
					},
					handler(ctx: Context<{ options?: any }, { query?: any }>): any {
						// @ts-ignore
						const params = this.adapter.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return this._count(params);
					},
				},

				/**
				 * List entities by filters and pagination results.
				 *
				 * @actions
				 * @cached
				 *
				 * @param {String|Array<String>} populate - Populated fields.
				 * @param {String|Array<String>} fields - Fields filter.
				 * @param {String|Array<String>} excludeFields - List of excluded fields.
				 * @param {Number?} page - Page number.
				 * @param {Number?} pageSize - Size of a page.
				 * @param {String?} sort - Sorted fields.
				 * @param {String?} search - Search text.
				 * @param {String|Array<String>} searchFields - Fields for searching.
				 * @param {Object?} query - Query object. Passes to adapter.
				 *
				 * @returns {Object} List of found entities and count with pagination info.
				 */
				list: {
					cache: {
						keys: [
							'populate',
							'fields',
							'excludeFields',
							'page',
							'pageSize',
							'sort',
							'search',
							'searchFields',
							'query',
						],
					},
					rest: 'GET /',
					params: {
						populate: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						fields: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						excludeFields: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						page: {
							type: 'number',
							integer: true,
							min: 1,
							optional: true,
							convert: true,
						},
						pageSize: {
							type: 'number',
							integer: true,
							min: 0,
							optional: true,
							convert: true,
						},
						sort: { type: 'string', optional: true },
						search: { type: 'string', optional: true },
						searchFields: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						query: [
							{ type: 'object', optional: true },
							{ type: 'string', optional: true },
						],
					},
					handler(ctx: Context<{ params: ListParams }>): any {
						// @ts-ignore
						const sanatizedParams = this.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return this._list(ctx, sanatizedParams);
					},
				},

				/**
				 * Create a new entity.
				 *
				 * @actions
				 *
				 * @param {Object | Array<Object>} entityOrEntities - Entity to save.
				 * @param {Object} options - Optional MongoDb insert options.
				 *
				 * @returns {Object} Saved entity.
				 */
				create: {
					rest: 'POST /',
					params: {
						entityOrEntities: [{ type: 'object' }, { type: 'array' }],
						options: { type: 'object', optional: true },
					},
					handler(ctx: Context): any {
						// @ts-ignore
						const params = this.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						// return this.adapter.create(ctx, entityOrEntities, options);
						return this._create(ctx, params);
					},
				},

				/**
				 * Create many new entities.
				 *
				 * @actions
				 *
				 * @param {Object?} entity - Entity to save.
				 * @param {Array<Object>?} entities - Entities to save.
				 *
				 * @returns {Object|Array<Object>} Saved entity(ies).
				 */
				insert: {
					rest: 'PUT /',
					params: {
						entityOrEntities: [{ type: 'object' }, { type: 'array' }],
						options: { type: 'object', optional: true },
					},
					handler(ctx: Context): any {
						// @ts-ignore
						const params = this.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return this._insert(ctx, params);
					},
				},

				/**
				 * Get entity by ID.
				 *
				 * @actions
				 * @cached
				 *
				 * @param {any|Array<any>} id - ID(s) of entity.
				 * @param {String|Array<String>} populate - Field list for populate.
				 * @param {String|Array<String>} fields - Fields filter.
				 * @param {String|Array<String>} excludeFields - List of excluded fields.
				 * @param {Boolean?} mapping - Convert the returned `Array` to `Object` where the key is the value of `id`.
				 *
				 * @returns {Object|Array<Object>} Found entity(ies).
				 *
				 * @throws {EntityNotFoundError} - 404 Entity not found
				 */
				get: {
					cache: {
						keys: ['id', 'populate', 'fields', 'excludeFields', 'mapping'],
					},
					rest: 'GET /:id',
					params: {
						id: [{ type: 'string' }, { type: 'number' }, { type: 'array' }],
						populate: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						relations: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						fields: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						excludeFields: [
							{ type: 'string', optional: true },
							{ type: 'array', optional: true, items: 'string' },
						],
						mapping: { type: 'boolean', optional: true },
					},
					handler(ctx: Context): any {
						// @ts-ignore
						const params = this.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return this._get(ctx, /* null, */ params);
					},
				},

				/**
				 * Update an entity by ID.
				 * > After update, clear the cache & call lifecycle events.
				 *
				 * @actions
				 *
				 * @param {any} id - ID of entity.
				 * @returns {Object} Updated entity.
				 *
				 * @throws {EntityNotFoundError} - 404 Entity not found
				 */
				update: {
					rest: 'PUT /:id',
					params: {
						id: { type: 'any' },
					},
					handler(ctx: Context): any {
						// @ts-ignore
						const params = this.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return this._update(ctx, params);
					},
				},

				/**
				 * Remove an entity by ID.
				 *
				 * @actions
				 *
				 * @param {any} id - ID of entity.
				 * @returns {Number} Count of removed entities.
				 *
				 * @throws {EntityNotFoundError} - 404 Entity not found
				 */
				remove: {
					rest: 'DELETE /:id',
					params: {
						id: { type: 'any' },
						options: { type: 'object', optional: true },
					},
					handler(ctx: Context): any {
						// @ts-ignore
						return this._remove(ctx, ctx.params);
					},
				},
			},

			/**
			 * Methods
			 */
			methods: {
				/**
				 * Connect to database.
				 */
				connect(): any {
					// @ts-ignore
					return this.adapter.connect().then(() => {
						// Call an 'afterConnected' handler in schema
						// @ts-ignore
						if (isFunction(this.schema.afterConnected)) {
							try {
								// @ts-ignore
								return this.schema.afterConnected.call(this);
							} catch (err) {
								/* istanbul ignore next */
								// @ts-ignore
								this.logger.error('afterConnected error!', err);
							}
						}
					});
				},

				/**
				 * Disconnect from database.
				 */
				disconnect(): any {
					// @ts-ignore
					if (isFunction(this.adapter.disconnect)) {
						// @ts-ignore
						return this.adapter.disconnect();
					}
				},

				/**
				 * Sanitize context parameters at `find` action.
				 *
				 * @methods
				 *
				 * @param {Context} ctx - Request context
				 * @param {Object} params - Request parameters
				 * @returns {Object} - Sanitized parameters
				 * @memberof MikroORMDbAdapter
				 */
				sanitizeParams(ctx: any, params: any): any {
					// @ts-ignore
					return this.adapter.sanitizeParams(ctx, params);
				},

				/**
				 * Get entity(ies) by ID(s).
				 *
				 * @methods
				 * @param {any|Array<any>} id - ID or IDs.
				 * @param {Boolean?} decoding - Need to decode IDs.
				 * @returns {Object|Array<Object>} Found entity(ies).
				 */
				getById(
					ctx: Context,
					// @ts-ignore
					// key: string | undefined | null = this.settings.idField,
					id: string | any[],
					decoding: boolean,
				): any {
					return resolve().then(() =>
						// @ts-ignore
						this.adapter.findById(
							ctx,
							// key,
							// @ts-ignore
							decoding ? this.adapter.decodeID(id) : id,
						),
					);
				},

				/**
				 * Call before entity lifecycle events
				 *
				 * @methods
				 * @param {String} type
				 * @param {Object} entity
				 * @param {Context} ctx
				 * @returns {Promise}
				 */
				beforeEntityChange(type: string | undefined, entity: any, ctx: any): any {
					/* const eventName = `beforeEntity${capitalize(type)}`;
					// @ts-ignore
					if (this.schema[eventName] == null) {
						return resolve(entity);
					}
					// @ts-ignore
					return resolve(this.schema[eventName].call(this, entity, ctx)); */
					// @ts-ignore
					return this.adapter.beforeEntityChange(type, entity, ctx);
				},

				/**
				 * Clear the cache & call entity lifecycle events
				 *
				 * @methods
				 * @param {String} type
				 * @param {Object|Array<Object>|Number} json
				 * @param {Context} ctx
				 * @returns {Promise}
				 */
				entityChanged(type: string | undefined, json: any, ctx: any): any {
					// @ts-ignore
					return this.adapter.entityChanged(type, json, ctx);
				},

				/**
				 * Clear cached entities
				 *
				 * @methods
				 * @returns {Promise}
				 */
				clearCache(): any {
					// @ts-ignore
					this.broker[this.settings.cacheCleanEventType](`cache.clean.${this.fullName}`);
					// @ts-ignore
					if (this.broker.cacher) {
						// @ts-ignore
						return this.broker.cacher.clean(`${this.fullName}.**`);
					}
					return resolve();
				},

				/**
				 * Transform the fetched documents
				 * @methods
				 * @param {Context} ctx
				 * @param {Object} 	params
				 * @param {Array|Object} docs
				 * @returns {Array|Object}
				 */
				transformDocuments(ctx: Context, params: any, docs: any): any {
					// @ts-ignore
					return this.adapter.transformDocuments(ctx, params, docs);
				},

				/**
				 * Filter fields in the entity object
				 *
				 * @param {Object} 	doc
				 * @param {Array<String>} 	fields	Filter properties of model.
				 * @returns	{Object}
				 */
				filterFields(doc: any, fields: any): any {
					// @ts-ignore
					return this.adapter.filterFields(doc, fields);
				},

				/**
				 * Exclude fields in the entity object
				 *
				 * @param {Object} 	doc
				 * @param {Array<String>} 	fields	Exclude properties of model.
				 * @returns	{Object}
				 */
				excludeFields(doc: any, fields: string | any[]): any {
					// @ts-ignore
					return this.adapter.excludeFields(doc, fields);
				},

				/**
				 * Authorize the required field list. Remove fields which is not exist in the `this.settings.fields`
				 *
				 * @param {Array} askedFields
				 * @returns {Array}
				 */
				authorizeFields(askedFields: any): any {
					// @ts-ignore
					return this.adapter.authorizeFields(askedFields);
				},

				/**
				 * Populate documents.
				 *
				 * @param {Context} 		ctx
				 * @param {Array|Object} 	docs
				 * @param {Array?}			populateFields
				 * @returns	{Promise}
				 */
				populateDocs(ctx: Context, docs: any, populateFields: any) {
					// @ts-ignore
					return this.adapter.populateDocs(ctx, docs, populateFields);
				},

				/**
				 * Validate an entity by validator.
				 * @methods
				 * @param {Object} entity
				 * @returns {Promise}
				 */
				validateEntity(entity: any) {
					// @ts-ignore
					return this.adapter.validateEntity(entity);
				},

				/**
				 * Encode ID of entity.
				 *
				 * @methods
				 * @param {any} id
				 * @returns {any}
				 */
				encodeID(id: any): any {
					// @ts-ignore
					return this.adapter.encodeID(id);
				},

				/**
				 * Decode ID of entity.
				 *
				 * @methods
				 * @param {any} id
				 * @returns {any}
				 */
				decodeID(id: any): any {
					// @ts-ignore
					return this.adapter.decodeID(id);
				},

				/**
				 * Find entities by query.
				 *
				 * @methods
				 *
				 * @param {Context} ctx - Context instance.
				 * @param {Object?} params - Parameters.
				 *
				 * @returns {Array<Object>} List of found entities.
				 */
				_find(ctx: Context, params: any): object[] {
					// @ts-ignore
					return this.adapter
						.find(ctx, params)
						.then((docs: any[]) => this.transformDocuments(ctx, params, docs));
				},

				/**
				 * Get count of entities by query.
				 *
				 * @methods
				 *
				 * @param {Context} ctx - Context instance.
				 * @param {Object?} params - Parameters.
				 *
				 * @returns {Number} Count of found entities.
				 */
				_count(ctx: Context, params: any): number {
					// Remove pagination params
					if (params?.limit) {
						params.limit = null;
					}
					if (params?.offset) {
						params.offset = null;
					}
					// @ts-ignore
					return this.adapter.count(params);
				},

				/**
				 * List entities by filters and pagination results.
				 *
				 * @methods
				 *
				 * @param {Context} ctx - Context instance.
				 * @param {Object?} params - Parameters.
				 *
				 * @returns {Object} List of found entities and count.
				 */
				_list(ctx: Context, params: ListParams): any {
					// @ts-ignore
					return this.adapter.list(ctx, params);
				},

				/**
				 * Create a new entity.
				 *
				 * @methods
				 *
				 * @param {Context} ctx - Context instance.
				 * @param {Object?} params - Parameters.
				 *
				 * @returns {Object} Saved entity.
				 */
				_create(ctx: Context, params: any): any {
					const { entityOrEntities, options } = params;
					return this.beforeEntityChange('create', entityOrEntities, ctx)
						.then(async (entity: any) => {
							// @ts-ignore
							this.logger.debug(`Validating entity(s) to create: ${entity}`);
							return await this.validateEntity(entity);
						})
						.then(async (entity: any) => {
							// @ts-ignore
							this.logger.debug(`Attempting to create entity: ${entity}`);
							// @ts-ignore
							return await this.adapter.create(ctx, entity, options);
						})
						.then(async (doc: any) => {
							// @ts-ignore
							this.logger.debug('Transforming created entity...');
							return await this.transformDocuments(ctx, params, doc);
						})
						.then(
							async (json: any) =>
								await this.entityChanged('created', json, ctx).then(() => json),
						)
						.catch((err: any) => {
							// @ts-ignore
							this.logger.error(`Failed to create entity: ${err}`);
							new Errors.MoleculerServerError(
								`Failed to create entity(s): ${entityOrEntities}`,
								500,
								'FAILED_TO_CREATE_ENTITY',
								err,
							);
						});
				},

				/**
				 * Create many new entities.
				 *
				 * @methods
				 *
				 * @param {Context} ctx - Context instance.
				 * @param {Object?} params - Parameters.
				 *
				 * @returns {Object|Array.<Object>} Saved entity(ies).
				 */
				_insert(ctx: Context, params: any): object | object[] {
					const { entityOrEntities, options } = params;
					return (
						this.beforeEntityChange('create', entityOrEntities, ctx)
							// @ts-ignore
							.then((entity: any) => {
								// @ts-ignore
								this.logger.debug(`Validating entity(s) to insert: ${entity}`);
								// @ts-ignore
								return this.validateEntity(entity);
							})
							// Apply idField
							.then((entity: any) => {
								// @ts-ignore
								this.logger.debug('Transforming entity id...');
								// @ts-ignore
								return this.adapter.beforeSaveTransformID(
									entity,
									// @ts-ignore
									this.settings.idField,
								);
							})
							.then(async (entity: any) => {
								// @ts-ignore
								this.logger.debug(`Attempting to insert entity: ${entity}`);
								// @ts-ignore
								return await this.adapter.insert(ctx, entity, options);
							})
							.then((docs: any) => this.transformDocuments(ctx, {}, docs))
							.then((json: any) =>
								// @ts-ignore
								this.entityChanged('created', json, ctx).then(() => json),
							)
					);
				},

				/**
				 * Get entity by ID.
				 *
				 * @methods
				 *
				 * @param {Context} ctx - Context instance.
				 * @param {Object?} params - Parameters.
				 *
				 * @returns {Object|Array<Object>} Found entity(ies).
				 *
				 * @throws {EntityNotFoundError} - 404 Entity not found
				 */
				_get(
					ctx: Context,
					// @ts-ignore
					// key: string | undefined | null = this.settings.idField,
					params: any,
				): object | object[] {
					const id = params.id;
					let origDoc: any;
					const shouldMapping = params.mapping === true;
					return this.getById(ctx, /* key, */ id, true)
						.then((doc: any) => {
							if (!doc) {
								return Promise.reject(
									new Errors.MoleculerClientError(
										'Entity not found',
										400,
										'',
										id,
									),
								);
							}

							if (shouldMapping) {
								origDoc = isArray(doc)
									? doc.map((d) => cloneDeep(d))
									: cloneDeep(doc);
							} else {
								origDoc = doc;
							}
							// @ts-ignore
							return doc;
						})
						.then((json: any) => {
							if (params.mapping !== true) {
								return json;
							}

							const res: { [key: string]: any } = {};
							if (isArray(json)) {
								json.forEach((doc, i) => {
									// @ts-ignore
									const entityId = this.adapter.encodeID(
										// @ts-ignore
										// this.adapter.afterRetrieveTransformID(
										origDoc[i],
										// 	// @ts-ignore
										// 	this.settings.idField,
										// 	// @ts-ignore
										// )[this.settings.idField],
									);
									res[entityId] = doc;
								});
							} else if (isObject(json)) {
								// @ts-ignore
								const entityId = this.adapter.encodeID(
									// @ts-ignore
									// this.adapter.afterRetrieveTransformID(
									origDoc,
									// @ts-ignore
									// 	this.settings.idField,
									// 	// @ts-ignore
									// )[this.settings.idField],
								);
								res[entityId] = json;
							}
							return res;
						});
				},

				/**
				 * Update an entity by ID.
				 * > After update, clear the cache & call lifecycle events.
				 *
				 * @methods
				 *
				 * @param {Context} ctx - Context instance.
				 * @param {Object?} params - Parameters.
				 * @returns {Object} Updated entity.
				 *
				 * @throws {EntityNotFoundError} - 404 Entity not found
				 */
				_update(ctx: Context, params: any): any {
					let id: any;
					// @ts-ignore
					return this.beforeEntityChange('update', params, ctx)
						.then((update: any) => {
							let sets: { [key: string]: any } = {};
							// Convert fields from params to "$set" update object
							Object.keys(update).forEach((prop) => {
								// @ts-ignore
								if (prop === 'id' || prop === this.settings.idField) {
									// @ts-ignore
									id = this.decodeID(update[prop]);
								} else {
									sets[prop] = update[prop];
								}
							});
							// @ts-ignore
							if (this.settings.useDotNotation) {
								sets = flatten(sets, { safe: true });
							}
							return sets;
						})
						.then(async (entity: any) => {
							// @ts-ignore
							this.logger.debug(
								`Updating entity by ID '${id}' with ${JSON.stringify(entity)}`,
							);
							// @ts-ignore
							return await this.adapter.updateById(ctx, id, entity);
						})
						.then((json: any) =>
							// @ts-ignore
							this.entityChanged('updated', json, ctx).then(() => json),
						)
						.catch((error: any) => {
							// @ts-ignore
							this.logger.error(`Failed to update: ${error}`);
							return new Errors.MoleculerServerError(
								`Failed to update ${error}`,
								500,
								'FAILED_TO_UPDATE',
								error,
							);
						});
				},

				/**
				 * Remove an entity by ID.
				 *
				 * @methods
				 *
				 * @param {Context} ctx - Context instance.
				 * @param {Object?} params - Parameters.
				 *
				 * @throws {EntityNotFoundError} - 404 Entity not found
				 */
				_remove(ctx: Context, params: any): any {
					// @ts-ignore
					const id = this.adapter.decodeID(params.id);
					let entity: any;
					return (
						Promise.resolve()
							.then(async () => {
								entity = await this.getById(ctx, /* null, */ id, true);
								return entity;
							})
							// @ts-ignore
							.then((removeEntity) =>
								this.beforeEntityChange('remove', removeEntity, ctx),
							)
							// @ts-ignore
							.then(() => this.adapter.removeById(id))
							.then((doc) => {
								if (doc.deletedCount === 0) {
									return Promise.reject(
										new Errors.MoleculerClientError(
											'Entity not found',
											400,
											'',
											id,
										),
									);
								}
								// @ts-ignore
								return this.transformDocuments(ctx, params, entity).then(
									(json: any) =>
										// @ts-ignore
										this.entityChanged('removed', json, ctx).then(() => json),
								);
							})
					);
				},
			},

			/**
			 * Service created lifecycle event handler
			 */
			created() {
				// Compatibility with < 0.4
				if (isString(this.settings.fields)) {
					this.settings.fields = this.settings.fields.split(/\s+/);
				}

				if (isString(this.settings.excludeFields)) {
					this.settings.excludeFields = this.settings.excludeFields.split(/\s+/);
				}

				// if (!this.schema.adapter) this.adapter = new MemoryAdapter();
				// else this.adapter = this.schema.adapter;
				this.adapter = this.schema.adapter;

				this.adapter.init(this.broker, this);

				// Transform entity validation schema to checker function
				if (
					this.broker.validator &&
					isObject(this.settings.entityValidator) &&
					!isFunction(this.settings.entityValidator)
				) {
					const check = this.broker.validator.compile(this.settings.entityValidator);
					this.settings.entityValidator = async (entity: any) => {
						let res = check(entity);
						if (check.async === true || res.then instanceof Function) {
							res = await res;
						}
						if (res === true) {
							return Promise.resolve();
						} else {
							return Promise.reject(
								new Errors.ValidationError('Entity validation error!', '', res),
							);
						}
					};
				}
			},

			/**
			 * Service started lifecycle event handler
			 */
			async started() {
				if (this.adapter) {
					// eslint-disable-next-line no-shadow
					return new Promise((resolve) => {
						const connecting = () => {
							this.connect()
								.then(resolve)
								.catch((err: any) => {
									this.logger.error('Connection error!', err);
									setTimeout(() => {
										this.logger.warn('Reconnecting...');
										connecting();
									}, 1000);
								});
						};

						connecting();
					});
				}

				/* istanbul ignore next */
				return Promise.reject(new Error('Please set the store adapter in schema!'));
			},

			/**
			 * Service stopped lifecycle event handler
			 */
			stopped() {
				if (this.adapter) {
					return this.adapter.disconnect();
				}
			},
		},
		mixinOptions,
	);
	return mixin;
};
