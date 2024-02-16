/* eslint-disable @typescript-eslint/naming-convention */
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
	forEach,
	get,
	has,
	isArray,
	isFunction,
	isObject,
	isString,
	isUndefined,
	replace,
	set,
	uniq,
	unset,
} from 'lodash';
import { all, method, reject, resolve } from 'bluebird';
import moleculer, {
	Service,
	ServiceBroker,
	Errors,
	Context,
	ServiceSettingSchema,
} from 'moleculer';
import {
	AbstractNamingStrategy,
	AbstractSchemaGenerator,
	ArrayCollection,
	ArrayType,
	BaseEntity,
	BigIntType,
	BlobType,
	BooleanType,
	ChangeSet,
	ChangeSetComputer,
	ChangeSetPersister,
	CheckConstraintViolationException,
	Collection,
	Configuration,
	Connection,
	ConnectionException,
	ConstraintViolationException,
	DatabaseDriver,
	DatabaseObjectExistsException,
	DatabaseObjectNotFoundException,
	DateTimeType,
	DateType,
	DeadlockException,
	DecimalType,
	DefaultLogger,
	DoubleType,
	DriverException,
	EntityAssigner,
	EntityCaseNamingStrategy,
	EntityComparator,
	EntityFactory,
	EntityHelper,
	EntityLoader,
	EntityManager,
	EntityMetadata,
	EntityRepository,
	EntitySchema,
	EntitySerializer,
	EntityTransformer,
	EntityValidator,
	EnumArrayType,
	EnumType,
	EventManager,
	ExceptionConverter,
	FileCacheAdapter,
	FloatType,
	ForeignKeyConstraintViolationException,
	Hydrator,
	IdentityMap,
	IntegerType,
	InvalidFieldNameException,
	// JavaScriptMetadataProvider,
	JsonType,
	LockWaitTimeoutException,
	MediumIntType,
	MemoryCacheAdapter,
	MetadataDiscovery,
	MetadataError,
	MetadataProvider,
	MetadataStorage,
	MikroORM,
	MongoNamingStrategy,
	NonUniqueFieldNameException,
	NotFoundError,
	NotNullConstraintViolationException,
	NullCacheAdapter,
	NullHighlighter,
	ObjectHydrator,
	OptimisticLockError,
	PlainObject,
	Platform,
	QueryHelper,
	ReadOnlyException,
	Reference,
	ReflectMetadataProvider,
	RequestContext,
	SerializationContext,
	ServerException,
	SimpleLogger,
	SmallIntType,
	StringType,
	SyntaxErrorException,
	TableExistsException,
	TableNotFoundException,
	TextType,
	TimeType,
	TinyIntType,
	TransactionContext,
	TransactionEventBroadcaster,
	Type,
	Uint8ArrayType,
	UnderscoreNamingStrategy,
	UniqueConstraintViolationException,
	UnitOfWork,
	UnknownType,
	Utils,
	UuidType,
	ValidationError,
	WrappedEntity,
	Cascade,
	ChangeSetType,
	EventType,
	FlushMode,
	GroupOperator,
	IsolationLevel,
	LoadStrategy,
	LockMode,
	NodeState,
	PopulateHint,
	QueryFlag,
	QueryOperator,
	QueryOrder,
	QueryOrderNumeric,
	// ReferenceType,
	AfterCreate,
	AfterDelete,
	AfterUpdate,
	AfterUpsert,
	BeforeCreate,
	BeforeDelete,
	BeforeUpdate,
	BeforeUpsert,
	Check,
	CreateRequestContext,
	Embeddable,
	Embedded,
	Entity,
	Enum,
	Filter,
	Formula,
	Index,
	ManyToMany,
	ManyToOne,
	OnInit,
	OnLoad,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property,
	SerializedPrimaryKey,
	// Subscriber,
	Unique,
	// UseRequestContext,
	assign,
	compareArrays,
	compareBooleans,
	compareBuffers,
	compareObjects,
	defineConfig,
	equals,
	// expr,
	parseJsonSafe,
	ref,
	rel,
	serialize,
	wrap,
	AssignOptions,
	CacheAdapter,
	ConnectionConfig,
	ConnectionOptions,
	CountOptions,
	CreateContextOptions,
	CreateOptions,
	DeleteOptions,
	DriverMethodOptions,
	DynamicPassword,
	Edge,
	EntityProperty,
	EnumOptions,
	EventArgs,
	EventSubscriber,
	FactoryOptions,
	FindOneOptions,
	FindOneOrFailOptions,
	FindOptions,
	FlatQueryOrderMap,
	FlushEventArgs,
	ForkOptions,
	FormulaOptions,
	GenerateOptions,
	GetReferenceOptions,
	Highlighter,
	IConfiguration,
	IDatabaseDriver,
	IEntityGenerator,
	IMigrationGenerator,
	IMigrator,
	ISeedManager,
	IWrappedEntity,
	IndexOptions,
	// InitOptions,
	LoadCountOptions,
	LoadReferenceOptions,
	LoadedCollection,
	LoadedReference,
	LockOptions,
	LogContext,
	Logger,
	LoggerOptions,
	ManyToManyOptions,
	ManyToOneOptions,
	MatchingOptions,
	MergeOptions,
	MigrationDiff,
	MigrationObject,
	MikroORMOptions,
	NamingStrategy,
	NativeDeleteOptions,
	NativeInsertUpdateManyOptions,
	NativeInsertUpdateOptions,
	Node,
	OneToOneOptions,
	PoolConfig,
	PrimaryKeyOptions,
	QueryResult,
	ReferenceOptions,
	// RegisterManagedOptions,
	SerializeOptions,
	SerializedPrimaryKeyOptions,
	Settings,
	SimpleColumnMeta,
	TransactionEventArgs,
	TransactionOptions,
	TransformContext,
	UniqueOptions,
	UpdateOptions,
	UpsertManyOptions,
	UpsertOptions,
	AnyEntity,
	Cast,
	CheckCallback,
	CheckOptions,
	ConnectionType,
	Constructor,
	DeepPartial,
	Dictionary,
	EmbeddableOptions,
	EmbeddedOptions,
	EntityClass,
	EntityClassGroup,
	EntityDTO,
	EntityData,
	EntityDictionary,
	EntityField,
	EntityLoaderOptions,
	EntityName,
	EntityOptions,
	EntitySchemaMetadata,
	EntitySchemaProperty,
	FilterQuery,
	GetRepository,
	IPrimaryKey,
	// IdentifiedReference,
	IsUnknown,
	Loaded,
	LoggerNamespace,
	MigrationsOptions,
	New,
	ObjectQuery,
	OneToManyOptions,
	Options,
	Populate,
	PopulateOptions,
	Primary,
	PrimaryProperty,
	PropertyOptions,
	QBFilterQuery,
	QBQueryOrderMap,
	QueryOrderKeys,
	QueryOrderKeysFlat,
	QueryOrderMap,
	Ref,
	Rel,
	RequiredEntityData,
	SeederOptions,
	Transaction,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { FlattenOptions } from 'flat';
import { ListParams } from '../types/mikroormadapter';
import { name, version, repository } from '../../package.json';
import ConnectionManager from './connectionManager';
import type { MikroORMConnection, MikroORMConnectionOptions } from './connectionManager/connection';
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
} from './connectionManager/connection';
const flatten = async (target: unknown, options: FlattenOptions | undefined) =>
	import('flat').then(async (flat) => await flat.flatten(target, options));
/* .catch((err) => {
			broker.logger.error(err);
		}) */ /**
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
 *
 * @description This class provides methods for connecting to a database using MikroORM.
 */
// eslint-disable-next-line no-shadow
export default class MikroORMDbAdapter<Entity extends AnyEntity> {
	// #region Properties, constructor, init, connect, disconnect
	// Dynamic property key
	[index: string]: any;
	/**
	 * Grants access to the connection manager instance which is used to create and manage connections.
	 * Called using this.adapter.connectionManager
	 *
	 * @static
	 * @property {ConnectionManager} connectionManager - Adapter connection manager. Use `this.adapter.connectionManager` to access.
	 *
	 * @properties
	 */
	public connectionManager: ConnectionManager | undefined;
	/**
	 * Grants access to the entity manager of the connection.
	 * Called using this.adapter.manager
	 * @static
	 * @property {EntityManager} manager - Mikro-ORM entity manager
	 *
	 * @properties
	 */
	public manager: EntityManager | undefined;
	/**
	 * Grants access to the entity repository of the connection.
	 * Called using this.adapter.repository
	 * @static
	 * @property {Repository<Entity>} repository - Mikro-ORM repository
	 *
	 * @properties
	 */
	public repository: EntityRepository<Entity> | undefined;

	public orm: MikroORMConnection | undefined;

	public entityName: string | undefined;
	public logger: moleculer.LoggerInstance | undefined;

	private _entity: EntitySchema<Entity> | EntitySchema<Entity>[] | undefined;
	/**
	 * Creates an instance of Mikro-ORM db service.
	 *
	 * @param {MikroORMConnectionOptions} opts
	 *
	 */
	public constructor(opts?: MikroORMConnectionOptions) {
		this.opts = opts;
	}

	/**
	 * Initializes the service with the provided broker and service.
	 * Sets the broker, service, and logger properties of the current object.
	 * Checks if the 'entities' option is provided in the options.
	 * If not, it throws an error indicating that the model is invalid or missing.
	 *
	 * @methods
	 * @param {ServiceBroker} broker - The broker that the service will use for logging and other broker-related operations.
	 * @param {Service} service - The service that the adapter will be initialized for.
	 *
	 * @throws {Errors.MoleculerServerError} - If the 'entities' option is not provided in the options, an error is thrown
	 * indicating that the model is invalid or missing.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public init(broker: ServiceBroker, service: Service) {
		this.broker = broker;
		this.service = service;
		this.logger = this.broker.logger;
		// const entityFromService: { entities: any; entitiesTs: any } = this.service.schema.model;
		// const entityArray: EntitySchema<Entity>[] = [];
		has(this.opts, 'entities')
			? (this._entity = [...this.opts.entities])
			: // May possibly use later if model attribute is needed
				// : isArray(entityFromService.entitiesTs)
				// ? (entityFromService.entitiesTs.forEach((entity) => {
				// 		const isValid = !!entity.constructor;
				// 		if (!isValid) {
				// 			new Errors.MoleculerServerError(
				// 				'Invalid model. It should be a mikro-orm entity',
				// 			);
				// 		}
				// 		entityArray.push(entity);
				//   }),
				//   ((this._entity = entityArray),
				//   (this.opts.entities = entityFromService.entities),
				//   (this.opts.entities = entityFromService.entitiesTs)))
				// : !isUndefined(entityFromService) && !!entityFromService.constructor
				// ? (this._entity = entityFromService.entitiesTs)
				new Errors.MoleculerServerError(
					'Invalid or missing model. It should be a mikro-orm entity, path or array of paths',
				);
	}

	/**
	 * Asynchronously connects to the database and initializes the adapter.
	 *
	 * This method does the following:
	 * - Creates a new connection manager and assigns it to the `connectionManager` property.
	 * - Creates a new ORM and entity manager using the connection manager.
	 * - Logs the name of the service and the database it has connected to.
	 * - Converts the `_entity` property to an array if it's not already an array.
	 * - Defines a function `entityMethods` that returns an array of method names of an object.
	 * - Logs the entities being added to the adapter.
	 * - Defines a function `addMethods` that adds methods from a source object to a target object.
	 * - For each entity in the `entityArray`, it does the following:
	 *   - Gets the repository for the entity.
	 *   - Gets the entity manager.
	 *   - Gets the repository entity manager.
	 *   - Gets the name of the entity.
	 *   - Gets the method names of the entity.
	 *   - Defines an object `methodsToAdd` with properties for the entity, options, ORM, manager, repository, and entity name.
	 *   - Adds the entity methods to the `methodsToAdd` object or the adapter itself if it's the first entity.
	 *   - Defines an array `entityManagerMethods` of method names to add from the entity manager.
	 *   - Adds the entity manager methods to the `methodsToAdd` object or the adapter itself if it's the first entity.
	 *   - Defines an array `repositoryMethods` of method names to add from the repository.
	 *   - Adds the repository methods to the `methodsToAdd` object or the adapter itself if it's the first entity.
	 *   - If it's not the first entity, it adds the `methodsToAdd` object to the adapter under the property with the name of the entity.
	 * - Logs that it's adding a forked entity manager to the adapter.
	 * - Assigns a forked entity manager to the `manager` and `em` properties.
	 * - Logs that it's adding a forked repository to the adapter.
	 * - Assigns a forked repository to the `repository` property.
	 * - Logs that it's adding the ORM to the adapter.
	 * - Assigns the ORM to the `orm` property.
	 * - Logs that it's adding the entity name to the adapter.
	 * - Assigns the entity name to the `entityName` property.
	 * - Logs that it's adding the `getEntityManager` method to the adapter.
	 * - Assigns the `_getEntityManager` method to the `getEntityManager` property.
	 *
	 * @methods
	 * @public
	 * @returns {Promise<void>} A promise that resolves when the connection and initialization is complete.
	 */
	public async connect(): Promise<void> {
		const logger = this.logger!;
		logger.debug('Adding logger to adapter...');
		this.connectionManager = new ConnectionManager();

		const { orm, entityManager } = await this.connectionManager.create(this.opts, logger);

		logger.info(`${this.service.name} has connected to ${orm.name} database`);

		const entityArray: { [key: string]: any } = isArray(this._entity)
			? (this._entity as unknown as EntitySchema)
			: [this._entity as unknown as EntitySchema];

		const entityMethods = (obj: { [key: string]: any } = {}) => {
			const members = Object.getOwnPropertyNames(obj);
			return members.filter((el) => typeof obj[el] === 'function');
		};

		logger.debug(`Adding entities to adapter: ${JSON.stringify(entityArray)}`);

		const addMethods = (
			methods: any[],
			source: Partial<any>,
			target: { [x: string]: any },
			prefix = '',
		) => {
			methods.forEach((ormMethod) => {
				if (source[ormMethod]) {
					target[`${prefix}${ormMethod}`] = source[ormMethod];
				}
			});
		};

		entityArray.map((entity: AnyEntity, index: number) => {
			const dbRepository = entityManager.getRepository(entity as any);
			const dbManager = entityManager;
			const repositoryEntityManager = entityManager.getRepository(entity as any).em;
			const entityName = entity.name;
			const entityMethodNames = entityMethods(entity);

			const methodsToAdd: { [key: string]: any } = {
				_entity: this._entity,
				opts: this.opts,
				orm,
				manager: dbManager,
				repository: dbRepository,
				entityName,
			};

			addMethods(entityMethodNames, entity, index === 0 ? this : methodsToAdd);

			const entityManagerMethods = [
				'addFilter',
				'begin',
				'clear',
				'clearCache',
				'commit',
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
				'getRepository',
				'getTransactionContext',
				'getUnitOfWork',
				'getValidator',
				'insert',
				'insertMany',
				'isInTransaction',
				'lock',
				'refresh',
				'repo',
				'resetTransactionContext',
				'rollback',
				'setFilterParams',
				'setFlushMode',
				'setTransactionContext',
				'transactional',
				'execute',
				'raw',
			];
			addMethods(
				entityManagerMethods,
				repositoryEntityManager,
				index === 0 ? this : methodsToAdd,
				'_',
			);

			const repositoryMethods = [
				'assign',
				'canPopulate',
				'count',
				'create',
				'find',
				'findAll',
				'findAndCount',
				'findOne',
				'findOneOrFail',
				'getEntityManager',
				'getReference',
				'map',
				'merge',
				'nativeDelete',
				'nativeInsert',
				'nativeUpdate',
				'persistLater',
				'populate',
				'removeLater',
				'upsert',
				'upsertMany',
				'createQueryBuilder',
				'getKnex',
				'qb',
				'aggregate',
				'getCollection',
			];
			addMethods(repositoryMethods, dbRepository, index === 0 ? this : methodsToAdd, '_');

			if (index !== 0) {
				this[entityName] = {
					...methodsToAdd,
					insert: this.insert,
					updateById: this.updateById,
					removeById: this.removeById,
					count: this.count,
					find: this.find,
					findOne: this.findOne,
					findById: this.findById,
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
				};
			}
		});

		logger.debug('Adding forked entity manager to adapter...');
		this.manager = orm.em.fork();
		this.em = orm.em.fork();
		logger.debug('Adding forked repository to adapter...');
		this.repository = orm.em
			.fork()
			.getRepository(isArray(this._entity) ? this._entity[0] : this._entity!);
		logger.debug('Adding orm to adapter...');
		this.orm = orm;
		logger.debug('Adding entity name to adapter...');
		this.entityName = orm.em.getRepository(
			isArray(this._entity) ? this._entity[0] : this._entity!,
		).entityName;
		logger.debug('Adding getEntityManager to adapter...');
		this.getEntityManager = this._getEntityManager;
	}

	/**
	 * Asynchronously disconnects from all the databases.
	 *
	 * This method does the following:
	 * - Iterates over all the connections in the connection manager.
	 * - For each connection, it does the following:
	 *   - Logs a message indicating that it's attempting to disconnect from the database.
	 *   - Tries to close the connection.
	 *   - If the disconnection is successful, it logs a message indicating that it has disconnected from the database.
	 *   - If the disconnection fails, it logs an error message and throws a `MoleculerServerError` with the error message,
	 *     a 500 status code, and the error details.
	 *
	 * @methods
	 * @public
	 * @returns {Promise<void>}
	 * @memberof MikroORMDbAdapter
	 */
	public async disconnect(): Promise<void> {
		await Promise.allSettled(
			this.connectionManager!.connections.map(async (connection: any) => {
				this.logger!.info(`Attempting to disconnect from database ${connection.name}...`);
				try {
					await this.connectionManager!.close(connection.name);
					this.logger!.info(`Disconnected from database ${connection.name}`);
				} catch (error) {
					const errorMessage = `Failed to disconnect from database ${error}`;
					this.logger!.error(errorMessage);
					throw new Errors.MoleculerServerError(
						errorMessage,
						500,
						'FAILED_TO_DISCONNECT_FROM_DATABASE',
						error,
					);
				}
			}),
		);
	}
	/* public async disconnect(): Promise<void> {
		await Promise.all(
			this.connectionManager!.connections.map(async (connection: any) => {
				this.logger!.info(`Attempting to disconnect from database ${connection.name}...`);
				try {
					await this.connectionManager!.close(connection.name);
					this.logger!.info(`Disconnected from database ${connection.name}`);
				} catch (error) {
					this.logger!.error(`Failed to disconnect from database ${error}`);
					throw new Errors.MoleculerServerError(
						`Failed to disconnect from database ${error}`,
						500,
						'FAILED_TO_DISCONNECT_FROM_DATABASE',
						error,
					);
				}
			}),
		);
	} */
	// #endregion Properties, constructor, init, connect, disconnect
	// #region Adapter custom methods
	// -------------------------------------------------------------------------
	// Public Methods
	// -------------------------------------------------------------------------

	/**
	 * Asynchronously creates one or more entities in the database.
	 *
	 * This method does the following:
	 * - Logs a message indicating that it's attempting to create the entity or entities.
	 * - Defines a function `handleError` that logs an error message and returns a `MoleculerServerError` with the error message,
	 *   a 500 status code, and the error details.
	 * - Defines a function `persistEntity` that attempts to persist the entity in the database and flush the changes.
	 *   If the operation fails, it calls `handleError` with the error.
	 * - Tries to do the following:
	 *   - If the `entityOrEntities` parameter is an array, it does the following:
	 *     - Calls the `_create` method for each entity in the array and waits for all the promises to resolve.
	 *     - Logs a message indicating that the entities have been created.
	 *     - Logs a message indicating that it's attempting to persist the created entities and flush the changes.
	 *     - Returns a promise that resolves when all the entities have been persisted and the changes have been flushed.
	 *   - If the `entityOrEntities` parameter is not an array, it does the following:
	 *     - Calls the `_create` method for the entity and waits for the promise to resolve.
	 *     - Logs a message indicating that it's attempting to persist the created entity and flush the changes.
	 *     - Returns a promise that resolves when the entity has been persisted and the changes have been flushed.
	 * - If any error occurs, it throws the error returned by `handleError`.
	 *
	 * @methods
	 * @param {RequiredEntityData<T> | RequiredEntityData<T>[]} entityOrEntities - The data for the entity or entities to create.
	 * @param {CreateOptions} [options] - Optional settings for the creation operation.
	 *
	 * @returns {Promise<T | T[]>} A promise that resolves with the created entity or entities.
	 *
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message,
	 * a 500 status code, and the error details.
	 * @memberof MikroORMDbAdapter
	 */
	public async create<T extends Entity>(
		entityOrEntities: RequiredEntityData<T> | RequiredEntityData<T>[],
		options?: CreateOptions,
	): Promise<T | T[]> {
		this.logger!.debug(
			`Attempting to create entit(y/ies): ${JSON.stringify(entityOrEntities)}`,
		);

		const handleError = (error: any) => {
			this.logger!.error(`Failed to create entity: ${error}`);
			return new Errors.MoleculerServerError(
				`Failed to create entity: ${JSON.stringify(entityOrEntities)}`,
				500,
				'FAILED_TO_CREATE_ENTITY',
				error,
			);
		};

		const persistEntity = async (entity: any) => {
			this.logger!.debug('Attempting to Persist created entit(y/ies): ', entity);
			try {
				await this.em.persist(entity).flush();
				return entity;
			} catch (error) {
				return handleError(error);
			}
		};

		try {
			if (isArray(entityOrEntities)) {
				const entities = await Promise.all(
					entityOrEntities.map((entity: any) => this['_create'](entity, options)),
				);
				this.logger!.debug('Entities created: ', entities);
				this.logger!.debug('Attempting to Persist created entities and flush');
				return Promise.all(entities.map(persistEntity));
			} else {
				const entity = await this['_create'](entityOrEntities, options);
				this.logger!.debug('Persiting created entity and flushing: ', entity);
				return persistEntity(entity);
			}
		} catch (error) {
			throw handleError(error);
		}
	}
	/* public async create<T extends Entity>(
		entityOrEntities: RequiredEntityData<T> | RequiredEntityData<T>[],
		options?: CreateOptions,
	): Promise<T | T[]> {
		this.logger!.debug(
			`Attempting to create entit(y/ies): ${JSON.stringify(entityOrEntities)}`,
		);
		return isArray(entityOrEntities)
			? await resolve(entityOrEntities.map((entity: any) => this['_create'](entity, options)))
					.then(async (docs: T[]) => {
						this.logger!.debug('Entities created: ', docs);
						const docsArray: T[] = [];
						this.logger!.debug('Attempting to Persist created entities and flush');
						forEach(docs, async (doc: T) => {
							this.logger!.debug('Attempting to Persist created entity: ', doc);
							try {
								await this.em.persist(doc).flush();
								// await this['manager']!.fork().persist(doc).flush();
								docsArray.push(doc);
							} catch (error) {
								this.logger!.error(`Failed to create entity: ${error}`);
								return new Errors.MoleculerServerError(
									`Failed to create entity: ${JSON.stringify(entityOrEntities)}`,
									500,
									'FAILED_TO_CREATE_ENTITY',
									error,
								);
							}
						});
						return docsArray;
					})
					.catch((err: any) => {
						this.logger!.error(`Failed to create entity: ${err}`);
						return new Errors.MoleculerServerError(
							`Failed to create entity: ${JSON.stringify(entityOrEntities)}`,
							500,
							'FAILED_TO_CREATE_ENTITY',
							err,
						);
					})
			: await resolve(this['_create'](entityOrEntities, options))
					.then(async (doc: any) => {
						this.logger!.debug('Persiting created entity and flushing: ', doc);
						await this.em.persistAndFlush(doc);
						return doc;
					})
					.catch((err: any) => {
						this.logger!.error(`Failed to create entity: ${err}`);
						return new Errors.MoleculerServerError(
							`Failed to create entity: ${JSON.stringify(entityOrEntities)}`,
							500,
							'FAILED_TO_CREATE_ENTITY',
							err,
						);
					});
	} */

	/**
	 * Asynchronously inserts one or more entities into the database.
	 *
	 * This method is a wrapper around the `create` method. It takes the same parameters and returns the same type of promise.
	 *
	 * @methods
	 * @param {RequiredEntityData<T> | RequiredEntityData<T>[]} entityOrEntities - The data for the entity or entities to insert.
	 * @param {CreateOptions} [options] - Optional settings for the insertion operation.
	 *
	 * @returns {Promise<T | T[]>} A promise that resolves with the inserted entity or entities.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async insert<T extends Entity>(
		entityOrEntities: RequiredEntityData<T> | RequiredEntityData<T>[],
		options?: CreateOptions,
	): Promise<T | T[]> {
		return await this.create(entityOrEntities, options);
	}

	/**
	 * Asynchronously updates an entity in the database by its ID.
	 *
	 * This method does the following:
	 * - Logs a message indicating that it's attempting to update the entity with the provided ID.
	 * - Transforms the ID using the `beforeQueryTransformID` method.
	 * - Tries to do the following:
	 *   - Calls the `_nativeUpdate` method with the transformed ID, the update data, and the options, and waits for the promise to resolve.
	 *   - Logs a message indicating that the entity has been updated.
	 *   - Calls the `findById` method with the original ID, and waits for the promise to resolve.
	 *   - Logs a message indicating that it's transforming the updated entity.
	 *   - Returns the updated entity transformed by the `afterRetrieveTransformID` method.
	 * - If any error occurs, it does the following:
	 *   - Logs an error message.
	 *   - Throws a `MoleculerServerError` with the error message, a 500 status code, the error code 'FAILED_TO_UPDATE_BY_ID', and the error details.
	 *
	 * @methods
	 * @param {any} id - The ID of the entity to update.
	 * @param {EntityData<T>} update - The data to update the entity with.
	 * @param {UpdateOptions<T>} [options] - Optional settings for the update operation.
	 *
	 * @returns {Promise<T>} A promise that resolves with the updated entity.
	 *
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message, a 500 status code,
	 * the error code 'FAILED_TO_UPDATE_BY_ID', and the error details.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async updateById<T extends Entity>(
		id: any,
		update: EntityData<T>,
		options?: UpdateOptions<T>,
	): Promise<T> {
		this.logger!.debug(`Updating entity by ID '${id}' with ${JSON.stringify(update)}`);
		const transformId: any = this.beforeQueryTransformID(id);

		try {
			const docs = await this['_nativeUpdate']({ [transformId]: id }, update, options);
			this.logger!.debug(`Updated entity by ID '${id}': ${docs}`);
			const updatedEntity = await this.findById(id);
			this.logger!.debug('Transforming update docs...');
			return this.afterRetrieveTransformID(updatedEntity, this.service.settings.idField) as T;
		} catch (error) {
			this.logger!.error(`Failed to updateById ${error}`);
			throw new Errors.MoleculerServerError(
				`Failed to updateById ${error}`,
				500,
				'FAILED_TO_UPDATE_BY_ID',
				error,
			);
		}
	}
	/* public async updateById<T extends Entity>(
		id: any,
		update: EntityData<T>,
		options?: UpdateOptions<T>,
	): Promise<T> {
		this.logger!.debug(`Updating entity by ID '${id}' with ${JSON.stringify(update)}`);
		const transformId: any = this.beforeQueryTransformID(id);
		const entity = await this['_nativeUpdate']({ [transformId]: id }, update, options)
			.then(async (docs: any) => {
				this.logger!.debug(`Updated entity by ID '${id}': ${docs}`);
				const updatedEntity = await this.findById(id);
				this.logger!.debug('Transforming update docs...');
				return updatedEntity;
			})
			.catch((error: any) => {
				this.logger!.error(`Failed to updateById ${error}`);
				return new Errors.MoleculerServerError(
					`Failed to updateById ${error}`,
					500,
					'FAILED_TO_UPDATE_BY_ID',
					error,
				);
			});
		return this.afterRetrieveTransformID(entity, this.service.settings.idField) as T;
	} */

	/**
	 * Asynchronously removes an entity from the database by its ID.
	 *
	 * This method does the following:
	 * - Transforms the ID using the `beforeQueryTransformID` method.
	 * - Tries to do the following:
	 *   - Calls the `_nativeDelete` method with an object that has a property with the name of the transformed ID and the value of the original ID,
	 *     and the options, and waits for the promise to resolve.
	 *   - Returns the number of entities removed.
	 * - If any error occurs, it does the following:
	 *   - Logs an error message.
	 *   - Throws a `MoleculerServerError` with the error message, a 500 status code, the error code 'FAILED_TO_REMOVE_BY_ID', and the error details.
	 *
	 * @methods
	 * @param {any} id - The ID of the entity to remove.
	 * @param {DeleteOptions<T>} [options] - Optional settings for the remove operation.
	 *
	 * @returns {Promise<number>} A promise that resolves with the number of entities removed.
	 *
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message, a 500 status code,
	 * the error code 'FAILED_TO_REMOVE_BY_ID', and the error details.
	 *
	 * @memberof MemoryDbAdapter
	 */
	public async removeById<T extends Entity>(
		id: any,
		options?: DeleteOptions<T>,
	): Promise<number> {
		const transformId: any = this.beforeQueryTransformID(id);
		try {
			return await this['_nativeDelete']({ [transformId]: id }, options);
		} catch (error: any) {
			this.logger!.error(`Failed to removeById ${error}`);
			throw new Errors.MoleculerServerError(
				`Failed to removeById ${error}`,
				500,
				'FAILED_TO_REMOVE_BY_ID',
				error,
			);
		}
	}
	/* public async removeById<T extends Entity>(
		id: any,
		options?: DeleteOptions<T>,
	): Promise<number> {
		const transformId: any = this.beforeQueryTransformID(id);
		return await this['_nativeDelete']({ [transformId]: id }, options).catch((error: any) => {
			this.logger!.error(`Failed to removeById ${error}`);
			return new Errors.MoleculerServerError(
				`Failed to removeById ${error}`,
				500,
				'FAILED_TO_REMOVE_BY_ID',
				error,
			);
		});
	} */

	/**
	 * Asynchronously removes multiple entities from the database by their IDs.
	 *
	 * This method does the following:
	 * - Tries to do the following:
	 *   - Calls the `_nativeDelete` method with the array of IDs and the options, and waits for the promise to resolve.
	 *   - Returns the number of entities removed.
	 * - If any error occurs, it does the following:
	 *   - Logs an error message.
	 *   - Throws a `MoleculerServerError` with the error message, a 500 status code, the error code 'FAILED_TO_REMOVE_MANY_BY_ID', and the error details.
	 *
	 * @methods
	 * @param {any[]} id - The IDs of the entities to remove.
	 * @param {DeleteOptions<T>} [options] - Optional settings for the remove operation.
	 *
	 * @returns {Promise<number>} A promise that resolves with the number of entities removed.
	 *
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message, a 500 status code,
	 * the error code 'FAILED_TO_REMOVE_MANY_BY_ID', and the error details.
	 *
	 * @memberof MemoryDbAdapter
	 */
	public async removeMany<T extends Entity>(
		id: any[],
		options?: DeleteOptions<T>,
	): Promise<number> {
		try {
			return await this['_nativeDelete'](id, options);
		} catch (error: any) {
			this.logger!.error(`Failed to removeMany by id: ${error}`);
			throw new Errors.MoleculerServerError(
				`Failed to removeMany by id: ${error}`,
				500,
				'FAILED_TO_REMOVE_MANY_BY_ID',
				error,
			);
		}
	}
	/* public async removeMany<T extends Entity>(
		id: any[],
		options?: DeleteOptions<T>,
	): Promise<number> {
		return await this['_nativeDelete'](id, options).catch((error: any) => {
			this.logger!.error(`Failed to removeMany by id: ${error}`);
			return new Errors.MoleculerServerError(
				`Failed to removeMany by id: ${error}`,
				500,
				'FAILED_TO_REMOVE_MANY_BY_ID',
				error,
			);
		});
	} */

	/**
	 * Asynchronously counts the number of entities in the database that match the provided filter query.
	 *
	 * This method does the following:
	 * - Tries to do the following:
	 *   - Calls the `_count` method with the filter query and the options, and waits for the promise to resolve.
	 *   - Returns the number of entities that match the filter query.
	 * - If any error occurs, it does the following:
	 *   - Logs an error message.
	 *   - Throws a `MoleculerServerError` with the error message, a 500 status code, the error code 'FAILED_TO_COUNT', and the error details.
	 *
	 * @methods
	 * @param {FilterQuery<T>} [where] - The filter query to match the entities against.
	 * @param {CountOptions<T, P>} [options] - Optional settings for the count operation.
	 *
	 * @returns {Promise<number>} A promise that resolves with the number of entities that match the filter query.
	 *
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message, a 500 status code,
	 * the error code 'FAILED_TO_COUNT', and the error details.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async count<T extends Entity, P extends string>(
		where?: FilterQuery<T>,
		options?: CountOptions<T, P>,
	): Promise<number> {
		try {
			return await this['_count'](where, options);
		} catch (error: any) {
			this.logger!.error(`Failed to count: ${error}`);
			throw new Errors.MoleculerServerError(
				`Failed to count ${error}`,
				500,
				'FAILED_TO_COUNT',
				error,
			);
		}
	}
	/* public async count<T extends Entity, P extends string>(
		where?: FilterQuery<T>,
		options?: CountOptions<T, P>,
	): Promise<number> {
		return this['_count'](where, options).catch((error: any) => {
			this.logger!.error(`Failed to count: ${error}`);
			return new Errors.MoleculerServerError(
				`Failed to count ${error}`,
				500,
				'FAILED_TO_COUNT',
				error,
			);
		});
	} */

	/**
	 * Asynchronously finds entities in the database that match the provided filter query.
	 *
	 * This method does the following:
	 * - Tries to do the following:
	 *   - Calls the `_find` method with the filter query and the options, and waits for the promise to resolve.
	 *   - Returns the entities that match the filter query.
	 * - If any error occurs, it does the following:
	 *   - Logs an error message.
	 *   - Throws a `MoleculerServerError` with the error message, a 500 status code, the error code 'FAILED_TO_FIND', and the error details.
	 *
	 * @methods
	 * @param {FilterQuery<T>} where - The filter query to match the entities against.
	 * @param {FindOptions<T, P>?} [options] - Optional settings for the find operation.
	 *
	 * @returns {Promise<Loaded<T, P> | Loaded<T, P>[]>} A promise that resolves with the entities that match the filter query.
	 *
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message,
	 * a 500 status code, the error code 'FAILED_TO_FIND', and the error details.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async find<T extends Entity, P extends string>(
		where: FilterQuery<T>,
		options?: FindOptions<T, P>,
	): Promise<Loaded<T, P> | Loaded<T, P>[]> {
		try {
			return await this['_find'](where, options);
		} catch (error: any) {
			this.logger!.error(`Failed to find: ${error}`);
			throw new Errors.MoleculerServerError(
				`Failed to find ${error}`,
				500,
				'FAILED_TO_FIND',
				error,
			);
		}
	}
	/* public async find<T extends Entity, P extends string>(
		where: FilterQuery<T>,
		options?: FindOptions<T, P>,
	): Promise<Loaded<T, P> | Loaded<T, P>[]> {
		return await this['_find'](where, options).catch((error: any) => {
			this.logger!.error(`Failed to find: ${error}`);
			return new Errors.MoleculerServerError(
				`Failed to find ${error}`,
				500,
				'FAILED_TO_FIND',
				error,
			);
		});
	} */

	/**
	 * Asynchronously finds a single entity in the database that matches the provided filter query.
	 *
	 * This method does the following:
	 * - Tries to do the following:
	 *   - Calls the `_findOne` method with the filter query and the options, and waits for the promise to resolve.
	 *   - Returns the entity that matches the filter query, or null if no entity matches the filter query.
	 * - If any error occurs, it does the following:
	 *   - Logs an error message.
	 *   - Throws a `MoleculerServerError` with the error message, a 500 status code, the error code 'FAILED_TO_FIND_ONE', and the error details.
	 *
	 * @methods
	 * @param {FilterQuery<T>} where - The filter query to match the entity against.
	 * @param {FindOneOptions<T, P>} [options] - Optional settings for the find operation.
	 *
	 * @returns {Promise<null | Loaded<T, P>>} A promise that resolves with the entity that matches the filter query,
	 * or null if no entity matches the filter query.
	 *
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message, a 500 status code,
	 * the error code 'FAILED_TO_FIND_ONE', and the error details.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async findOne<T extends Entity, P extends string>(
		where: FilterQuery<T>,
		options?: FindOneOptions<T, P>,
	): Promise<null | Loaded<T, P>> {
		try {
			return await this['_findOne'](where, options);
		} catch (error: any) {
			this.logger!.error(`Failed to findOne: ${error}`);
			throw new Errors.MoleculerServerError(
				`Failed to findOne ${error}`,
				500,
				'FAILED_TO_FIND_ONE',
				error,
			);
		}
	}
	/* public async findOne<T extends Entity, P extends string>(
		where: FilterQuery<T>,
		options?: FindOneOptions<T, P>,
	): Promise<null | Loaded<T, P>> {
		const entity = await this['_findOne'](where, options).catch((error: any) => {
			this.logger!.error(`Failed to findOne: ${error}`);
			return new Errors.MoleculerServerError(
				`Failed to findOne ${error}`,
				500,
				'FAILED_TO_FIND_ONE',
				error,
			);
		});
		return entity;
	} */

	/**
	 * Asynchronously finds an entity in the database by its ID. No find options can be provided.
	 *
	 * This method does the following:
	 * - Tries to do the following:
	 *   - Calls the `_find` method with the ID, and waits for the promise to resolve.
	 *   - Returns the first entity that matches the ID, or undefined if no entity matches the ID.
	 * - If any error occurs, it does the following:
	 *   - Logs an error message.
	 *   - Throws a `MoleculerServerError` with the error message, a 500 status code, the error code 'FAILED_TO_FIND_BY_ID', and the error details.
	 *
	 * @methods
	 * @param {string | number | string[] | number[]} id - The ID of the entity to find.
	 *
	 * @returns {Promise<T | undefined>} A promise that resolves with the entity that matches the ID, or undefined if no entity matches the ID.
	 *
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message, a 500 status code,
	 * the error code 'FAILED_TO_FIND_BY_ID', and the error details.
	 * Gets item by id(s).
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async findById<T extends Entity>(
		id: string | number | string[] | number[],
	): Promise<T | undefined> {
		try {
			const record = await this['_find'](id);
			return record[0];
		} catch (error: any) {
			this.logger!.error(`Failed to findById ${error}`);
			throw new Errors.MoleculerServerError(
				`Failed to findById ${error}`,
				500,
				'FAILED_TO_FIND_BY_ID',
				error,
			);
		}
	}
	/* public async findById<T extends Entity>(
		id: string | number | string[] | number[],
	): Promise<T | undefined> {
		const record = await this['_find'](id).catch((error: any) => {
			this.logger!.error(`Failed to findById ${error}`);
			return new Errors.MoleculerServerError(
				`Failed to findById ${error}`,
				500,
				'FAILED_TO_FIND_BY_ID',
				error,
			);
		});
		return record[0];
	} */

	/**
	 * Asynchronously retrieves population data based on the provided parameters.
	 *
	 * This method does the following:
	 * - Extracts the ID from the parameters.
	 * - Determines whether mapping should be performed based on the parameters.
	 * - Tries to do the following:
	 *   - Calls the `findById` method with the ID, and waits for the promise to resolve.
	 *   - If no document is found, throws a `MoleculerServerError`.
	 *   - If mapping should be performed, clones the document; otherwise, uses the original document.
	 *   - Transforms the document into JSON.
	 *   - If mapping should not be performed, returns the JSON.
	 *   - If mapping should be performed, creates a new object and maps the JSON to it, using the transformed ID as the key.
	 *   - Returns the mapped object.
	 * - If any error occurs, it does the following:
	 *   - Logs an error message.
	 *   - Throws the error.
	 *
	 * @methods
	 * @param {Context} ctx - The context of the request.
	 * @param {any} [params] - The parameters of the request.
	 *
	 * @returns {Promise<object | object[]>} A promise that resolves with the population data.
	 *
	 * @throws {Errors.MoleculerServerError} If no document is found, a `MoleculerServerError` is thrown with the error message,
	 * a 500 status code, and the error code 'FAILED_TO_FIND_BY_ID'.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async getPopulations(ctx: Context, params?: any): Promise<object | object[]> {
		const id = params.id;
		let origDoc: any;
		const shouldMapping = params.mapping === true;

		try {
			const doc = await this['findById'](id);
			if (!doc) {
				throw new Errors.MoleculerServerError(
					`Failed to findById ${id}`,
					500,
					'FAILED_TO_FIND_BY_ID',
				);
			}

			if (shouldMapping) {
				origDoc = Array.isArray(doc) ? doc.map((d) => cloneDeep(d)) : cloneDeep(doc);
			} else {
				origDoc = doc;
			}

			const json = await this.transformDocuments(ctx, params, doc);

			if (params.mapping !== true) {
				return json;
			}

			const res: any = {};
			if (Array.isArray(json)) {
				json.forEach((docEntity, i) => {
					const docId = this.encodeID(
						// @ts-ignore
						this.afterRetrieveTransformID(origDoc[i], this.service.settings.idField)[
							this.service.settings.idField
						],
					);
					res[docId] = docEntity;
				});
			} else if (typeof json === 'object') {
				const docId = this.encodeID(
					// @ts-ignore
					this.afterRetrieveTransformID(origDoc, this.service.settings.idField)[
						this.service.settings.idField
					],
				);
				res[docId] = json;
			}
			return res;
		} catch (error) {
			this.logger!.error(`Failed to get populations: ${error}`);
			throw error;
		}
	}
	/* public getPopulations(ctx: Context, params?: any): object | object[] {
		const id = params.id;
		let origDoc: any;
		const shouldMapping = params.mapping === true;
		return this['findById'](id)
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
	} */

	/**
	 * Asynchronously lists entities in the database based on the provided parameters.
	 *
	 * This method does the following:
	 * - Creates a copy of the parameters for counting entities.
	 * - Removes pagination parameters from the count parameters.
	 * - If no limit is provided, sets the limit based on the service settings and the page size.
	 * - Logs a debug message with the listing parameters.
	 * - Tries to do the following:
	 *   - Calls the `_findAndCount` method with the parameters, and waits for the promise to resolve.
	 *   - Transforms the found documents into JSON.
	 *   - Returns an object with the following properties:
	 *     - `rows`: The transformed documents.
	 *     - `total`: The total number of entities.
	 *     - `page`: The current page.
	 *     - `pageSize`: The page size.
	 *     - `totalPages`: The total number of pages.
	 * - If any error occurs, it does the following:
	 *   - Logs an error message.
	 *   - Throws a `MoleculerServerError` with the error message, a 500 status code, the error code 'FAILED_TO_LIST', and the error details.
	 *
	 * @methods
	 * @param {Context} ctx - The context of the request.
	 * @param {ListParams<Object>?} params - The parameters of the request.
	 *
	 * @returns {Promise<object>} A promise that resolves with an object containing the listed entities and pagination information.
	 *
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message,
	 * a 500 status code, the error code 'FAILED_TO_LIST', and the error details.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async list(ctx: Context, params: any): Promise<object> {
		const countParams = { ...params };
		// Remove pagination params
		if (countParams?.limit) {
			countParams.limit = null;
		}
		if (countParams?.offset) {
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
		try {
			const res = await this['_findAndCount']({}, params);
			const docs = await this.transformDocuments(ctx, params, res[0]);
			return {
				// Rows
				rows: docs,
				// Total rows
				total: res[1],
				// Page
				page: params.page,
				// Page size
				pageSize: params.pageSize,
				// Total pages
				totalPages: Math.floor((res[1] + params.pageSize! - 1) / params.pageSize!),
			};
		} catch (error: any) {
			this.logger!.error(`Failed to list ${error}`);
			throw new Errors.MoleculerServerError(
				`Failed to list ${error}`,
				500,
				'FAILED_TO_LIST',
				error,
			);
		}
	}
	/* public list(ctx: Context, params: any): object {
		const countParams = { ...params };
		// Remove pagination params
		if (countParams?.limit) {
			countParams.limit = null;
		}
		if (countParams?.offset) {
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
			this['_findAndCount']({}, params).catch((error: any) => {
				this.logger!.error(`Failed to list ${error}`);
				return new Errors.MoleculerServerError(
					`Failed to list ${error}`,
					500,
					'FAILED_TO_LIST',
					error,
				);
			}),
		]).then(
			async (res) =>
				await this.transformDocuments(ctx, params, res[1][0])
					.then((docs) => ({
						// Rows
						rows: docs,
						// Total rows
						total: res[1][1],
						// Page
						page: params.page,
						// Page size
						pageSize: params.pageSize,
						// Total pages
						totalPages: Math.floor(
							(res[1][1] + params.pageSize! - 1) / params.pageSize!,
						),
					}))
					.catch((error: any) => {
						this.logger!.error(`Failed to transform response: ${error}`);
						return new Errors.MoleculerServerError(
							`Failed to  transform response ${error}`,
							500,
							'FAILED_TO_TRANSFORM_RESPONSE',
							error,
						);
					}),
		);
	} */

	/**
	 * Transforms the ID field of an entity before saving it to the database.
	 *
	 * This method does the following:
	 * - Creates a deep copy of the entity.
	 * - Determines the database ID field based on the type of the database and the metadata of the entity.
	 * - If the ID field provided is not the same as the database ID field and the entity has the provided ID field, it does the following:
	 *   - Sets the value of the database ID field in the new entity to the value of the provided ID field.
	 *   - Deletes the provided ID field from the new entity.
	 * - Returns the new entity.
	 *
	 * @methods
	 * @param {any} entity - The entity to transform.
	 * @param {string} idField - The ID field to transform.
	 * @returns {Object} - Modified entity
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public beforeSaveTransformID(entity: any, idField: string): object {
		const newEntity = cloneDeep(entity);
		const dbIDField =
			this.opts.type === 'mongodb'
				? '_id'
				: find(this.manager?.getMetadata()['metadata'][this.entityName!].props, {
						primary: true,
					}).name;

		if (idField !== dbIDField && entity[idField] !== undefined) {
			newEntity[dbIDField] = newEntity[idField];
			delete newEntity[idField];
		}

		return newEntity;
	}
	/* public beforeSaveTransformID(entity: any, idField: string): object {
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
	} */

	/**
	 * Transforms the ID field of an entity after retrieving it from the database.
	 *
	 * This method does the following:
	 * - Determines the database ID field based on the type of the database and the metadata of the entity.
	 * - Creates a deep copy of the entity.
	 * - If the entity does not have the provided ID field but has the database ID field, it does the following:
	 *   - Sets the value of the provided ID field in the new entity to the value of the database ID field.
	 *   - Deletes the database ID field from the new entity.
	 * - Returns the new entity.
	 *
	 * @methods
	 * @param {any} entity - The entity to transform.
	 * @param {string} idField - The ID field to transform.
	 * @returns {object} The transformed entity.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public afterRetrieveTransformID(entity: any, idField: string): object {
		const dbIDField = find(this.manager?.getMetadata()['metadata'][this.entityName!].props, {
			primary: true,
		}).name;
		const newEntity = { ...entity };

		if (!entity.hasOwnProperty(idField) && entity.hasOwnProperty(dbIDField)) {
			newEntity[idField] = newEntity[dbIDField];
			delete newEntity[dbIDField];
		}

		return newEntity;
	}
	/* public afterRetrieveTransformID(entity: any, idField: string): object {
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
	} */

	/**
	 * Encodes the ID of an entity.
	 *
	 * This method currently returns the ID as is. It can be overridden in subclasses to provide custom ID encoding.
	 *
	 * @methods
	 * @param {any} id - The ID to encode.
	 * @returns {any} The encoded ID.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public encodeID(id: any): any {
		return id;
	}

	/**
	 * Converts a given ID to a MongoDB ObjectId.
	 *
	 * This method is used when working with MongoDB, where the IDs are usually of the ObjectId type.
	 *
	 * @methods
	 * @param {any} id - The ID to convert.
	 * @returns {ObjectId} The converted ObjectId.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public toMongoObjectId(id: any): ObjectId {
		return new ObjectId(id);
	}

	/**
	 * Converts a given MongoDB ObjectId to a string.
	 *
	 * This method is used when working with MongoDB, where the IDs are usually of the ObjectId type.
	 * It converts the ObjectId back to a string for use in the application.
	 *
	 * @methods
	 * @param {any} id - The MongoDB ObjectId to convert.
	 * @returns {string} The converted string ID.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public fromMongoObjectId(id: any): string {
		return id.toString();
	}

	/**
	 * Transforms the ID field of a query before executing it.
	 *
	 * This method does the following:
	 * - Determines the database ID field based on the type of the database and the metadata of the entity.
	 * - If the ID field provided is not the same as the database ID field, returns the database ID field; otherwise, returns the provided ID field.
	 *
	 * @methods
	 * @param {any} idField - The ID field to transform.
	 * @returns {any} The transformed ID field.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public beforeQueryTransformID(idField: any): any {
		const dbIDField =
			this.opts.type === 'mongodb'
				? '_id'
				: find(this.manager?.getMetadata()['metadata'][this.entityName!].props, {
						primary: true,
					}).name;
		return idField !== dbIDField ? dbIDField : idField;
	}
	/* public beforeQueryTransformID(idField: any): any {
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
	} */

	/**
	 * Decode ID of entity.
	 *
	 * @methods
	 * @param {any} id
	 * @returns {any}
	 * @memberof MikroORMDbAdapter
	 */
	public decodeID(id: any): any {
		return id;
	}

	/**
	 * Transforms documents after retrieving them from the database.
	 *
	 * This method does the following:
	 * - Logs a debug message.
	 * - Determines the user-defined ID field from the service settings.
	 * - Checks if the documents are an array or an object.
	 * - If the documents are an object, converts them to an array.
	 * - Tries to do the following:
	 *   - Converts the documents to JavaScript objects.
	 *   - Applies the user-defined ID field to the documents.
	 *   - Encodes the IDs of the documents.
	 *   - If the context and the populate parameter are provided, populates the documents.
	 *   - If the context and the fields parameter are provided, filters the fields of the documents.
	 *   - If the excludeFields parameter is provided, excludes the specified fields from the documents.
	 *   - Returns the transformed documents and populates the document with the relations specified in the populate service property.
	 * - If any error occurs, it does the following:
	 *   - Logs an error message.
	 *   - Throws a `MoleculerServerError` with the error message, a 500 status code, the error code 'FAILED_TO_TRANSFORM_DOCUMENTS', and the error details.
	 *
	 * @methods
	 * @param {Context} ctx - The context of the request.
	 * @param {Object} params - The parameters of the request.
	 * @param {Array|Object} docs - The documents to transform.
	 * @returns {Promise<any[] | object>} A promise that resolves with the transformed documents.
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message, a 500 status code,
	 * the error code 'FAILED_TO_TRANSFORM_DOCUMENTS', and the error details.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async transformDocuments(ctx: Context, params: any, docs: any): Promise<any[] | object> {
		this.logger!.debug('Transforming documents..');
		let isDoc = false;
		this.logger!.debug(`Setting userDefinedIDField to ${this.service.settings.idField}`);
		const userDefinedIDField = this.service.settings.idField;
		this.logger!.debug('Checking if docs is an array or an object..');
		if (!Array.isArray(docs)) {
			this.logger!.debug('Docs is not an array');
			if (typeof docs === 'object') {
				this.logger!.debug('Docs is an object, converting to array..');
				isDoc = true;
				docs = [docs];
			} else {
				this.logger!.debug('Docs is not an object, returning docs..');
				return docs;
			}
		}

		try {
			// Convert entity to JS object
			const entity = await Promise.all(
				docs.map((doc: any) => {
					this.logger!.debug('Converting entity to JS object...');
					return this.entityToObject(doc);
				}),
			);

			// Apply idField
			const entityWithID = entity.map((doc: any) => {
				this.logger!.debug('Applying idField to docs...');
				return this.afterRetrieveTransformID(doc, userDefinedIDField);
			});

			// Encode IDs
			const entityWithEncodedID = entityWithID.map((doc: { [x: string]: any }) => {
				this.logger!.debug('Encoding IDs..');
				doc[userDefinedIDField] = this.encodeID(doc[userDefinedIDField]);
				return doc;
			});

			// Populate
			this.logger!.debug(`Populating docs with ${params.populate}..`);
			const populatedEntity =
				ctx && params.populate
					? await this.populateDocs(ctx, entityWithEncodedID, params.populate)
					: entityWithEncodedID;

			// TODO onTransformHook

			// Filter fields
			this.logger!.debug('Attempting to filter fields..');
			let filteredEntity;
			if (ctx && params.fields) {
				this.logger!.debug('Fields found in params..');
				const fields =
					typeof params.fields === 'string' ? params.fields.split(/\s+/) : params.fields;
				// Authorize the requested fields
				this.logger!.debug('Authorizing fields..');
				const authFields = this.authorizeFields(fields);
				this.logger!.debug('Filtering fields and returning object..');
				filteredEntity = populatedEntity.map((item: any) =>
					this.filterFields(item, authFields),
				);
			} else {
				this.logger!.debug('No fields found in params, returning filtered object..');
				filteredEntity = populatedEntity.map((item: any) =>
					this.filterFields(item, this.service.settings.fields),
				);
			}

			// Filter excludeFields
			this.logger!.debug('Attempting to filter excludeFields..');
			const paramExcludeFields =
				typeof params.excludeFields === 'string'
					? params.excludeFields.split(/\s+/)
					: params.excludeFields;
			const askedExcludeFields = ctx && params.excludeFields ? paramExcludeFields : [];
			const excludeFields = askedExcludeFields.concat(
				this.service.settings.excludeFields || [],
			);
			let finalEntity;
			if (Array.isArray(excludeFields) && excludeFields.length > 0) {
				this.logger!.debug('ExcludeFields found in params, returning filtered object..');
				finalEntity = filteredEntity.map((doc: any) =>
					this._excludeFields(doc, excludeFields),
				);
			} else {
				this.logger!.debug('No excludeFields found in params, returning object..');
				finalEntity = filteredEntity;
			}

			// Return
			this.logger!.debug('Returning json object..');
			return isDoc ? finalEntity[0] : finalEntity;
		} catch (err) {
			/* istanbul ignore next */
			this.logger!.error('Transforming documents is failed!', err);
			throw new Errors.MoleculerServerError(
				`Failed to transform documents ${err}`,
				500,
				'FAILED_TO_TRANSFORM_DOCUMENTS',
				err,
			);
		}
	}
	// public async transformDocuments(ctx: any, params: any, docs: any): Promise<any[] | object> {
	// 	this.logger!.debug('Transforming documents..');
	// 	let isDoc = false;
	// 	this.logger!.debug(`Setting userDefinedIDField to ${this.service.settings.idField}`);
	// 	const userDefinedIDField = this.service.settings.idField;
	// 	this.logger!.debug('Checking if docs is an array or an object..');
	// 	if (!isArray(docs)) {
	// 		this.logger!.debug('Docs is not an array');
	// 		if (isObject(docs)) {
	// 			this.logger!.debug('Docs is an object, converting to array..');
	// 			isDoc = true;
	// 			docs = [docs];
	// 		} else {
	// 			this.logger!.debug('Docs is not an object, returning docs..');
	// 			return resolve(docs);
	// 		}
	// 	}

	// 	return (
	// 		resolve(docs)
	// 			// Convert entity to JS object
	// 			.then((entity) =>
	// 				all(
	// 					entity.map((doc: any) => {
	// 						this.logger!.debug('Converting entity to JS object...');
	// 						return this.entityToObject(doc);
	// 					}),
	// 				),
	// 			)

	// 			// Apply idField
	// 			.then((entity) =>
	// 				entity.map((doc: any) => {
	// 					this.logger!.debug('Applying idField to docs...');
	// 					return this.afterRetrieveTransformID(doc, userDefinedIDField);
	// 				}),
	// 			)
	// 			// Encode IDs
	// 			.then((entity) =>
	// 				entity.map((doc: { [x: string]: any }) => {
	// 					this.logger!.debug('Encoding IDs..');
	// 					doc[userDefinedIDField] = this.encodeID(doc[userDefinedIDField]);
	// 					return doc;
	// 				}),
	// 			)
	// 			// Populate
	// 			.then(async (json) => {
	// 				this.logger!.debug(`Populating docs with ${params.populate}..`);
	// 				return ctx && params.populate
	// 					? await this.populateDocs(ctx, json, params.populate)
	// 					: json;
	// 			})

	// 			// TODO onTransformHook

	// 			// Filter fields
	// 			.then((json) => {
	// 				this.logger!.debug('Attempting to filter fields..');
	// 				if (ctx && params.fields) {
	// 					this.logger!.debug('Fields found in params..');
	// 					const fields = isString(params.fields)
	// 						? // Compatibility with < 0.4
	// 							/* istanbul ignore next */
	// 							params.fields.split(/\s+/)
	// 						: params.fields;
	// 					// Authorize the requested fields
	// 					this.logger!.debug('Authorizing fields..');
	// 					const authFields = this.authorizeFields(fields);
	// 					this.logger!.debug('Filtering fields and returning object..');
	// 					return json.map((item: any) => this.filterFields(item, authFields));
	// 				} else {
	// 					this.logger!.debug(
	// 						'No fields found in params, returning filtered object..',
	// 					);
	// 					return json.map((item: any) =>
	// 						this.filterFields(item, this.service.settings.fields),
	// 					);
	// 				}
	// 			})

	// 			// Filter excludeFields
	// 			.then((json) => {
	// 				this.logger!.debug('Attempting to filter excludeFields..');
	// 				const paramExcludeFields = isString(params.excludeFields)
	// 					? params.excludeFields.split(/\s+/)
	// 					: params.excludeFields;
	// 				const askedExcludeFields =
	// 					ctx && params.excludeFields ? paramExcludeFields : [];
	// 				const excludeFields = askedExcludeFields.concat(
	// 					this.service.settings.excludeFields || [],
	// 				);
	// 				if (Array.isArray(excludeFields) && excludeFields.length > 0) {
	// 					this.logger!.debug(
	// 						'ExcludeFields found in params, returning filtered object..',
	// 					);
	// 					return json.map((doc: any) => this._excludeFields(doc, excludeFields));
	// 				} else {
	// 					this.logger!.debug('No excludeFields found in params, returning object..');
	// 					return json;
	// 				}
	// 			})

	// 			// Return
	// 			.then((json) => {
	// 				this.logger!.debug('Returning json object..');
	// 				return isDoc ? json[0] : json;
	// 			})
	// 			.catch((err) => {
	// 				/* istanbul ignore next */
	// 				this.logger!.error('Transforming documents is failed!', err);
	// 				throw new Errors.MoleculerServerError(
	// 					`Failed to transform documents ${err}`,
	// 					500,
	// 					'FAILED_TO_TRANSFORM_DOCUMENTS',
	// 					err,
	// 				);
	// 			})
	// 	);
	// }

	/**
	 * Executes a hook (before entity lifecycle event) before an entity change operation.
	 *
	 * This method does the following:
	 * - Constructs the event name based on the type of the operation.
	 * - If there is no hook for the event in the service schema, returns the entity as is.
	 * - If there is a hook for the event in the service schema, calls the hook with the entity and the context, and waits for the promise to resolve.
	 * - Returns the result of the hook, or the entity if there is no hook.
	 *
	 * @methods
	 * @param {string | undefined} type - The type of the operation. This should be 'Create', 'Update', or 'Remove'.
	 * @param {Object} entity - The entity to be changed.
	 * @param {Context} ctx - The context of the operation.
	 * @returns {Promise<any>} A promise that resolves with the result of the hook, or the entity if there is no hook.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async beforeEntityChange(
		type: string | undefined,
		entity: object,
		ctx: Context,
	): Promise<any> {
		const eventName = `beforeEntity${capitalize(type)}`;
		if (this.service.schema[eventName] == null) {
			return entity;
		}
		return await this.service.schema[eventName].call(this, entity, ctx);
	}
	/* public async beforeEntityChange(type: string | undefined, entity: any, ctx: any): Promise<any> {
		const eventName = `beforeEntity${capitalize(type)}`;
		if (this.service.schema[eventName] == null) {
			return resolve(entity);
		}
		return resolve(this.service.schema[eventName].call(this, entity, ctx));
	} */

	/**
	 * Executes a hook after an entity change operation and clears the cache.
	 *
	 * This method does the following:
	 * - Clears the cache.
	 * - Constructs the event name based on the type of the operation.
	 * - If there is no hook for the event in the service schema, returns undefined.
	 * - If there is a hook for the event in the service schema, calls the hook with the entity and the context, and waits for the promise to resolve.
	 * - Returns the result of the hook.
	 *
	 * @methods
	 * @param {string | undefined} type - The type of the operation. This should be 'Create', 'Update', or 'Remove'.
	 * @param {Object|Array<Object>|Number} json - The entity that was changed.
	 * @param {Context} ctx - The context of the operation.
	 * @returns {Promise<any>} A promise that resolves with the result of the hook, or undefined if there is no hook.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async entityChanged(
		type: string | undefined,
		json: object | object[] | number,
		ctx: any,
	): Promise<any> {
		await this.clearCache();
		const eventName = `entity${capitalize(type)}`;
		if (this.service.schema[eventName] != null) {
			return await this.service.schema[eventName].call(this, json, ctx);
		}
	}
	/* public async entityChanged(type: string | undefined, json: any, ctx: any): Promise<any> {
		return await this.clearCache().then(async () => {
			const eventName = `entity${capitalize(type)}`;
			if (this.service.schema[eventName] != null) {
				return await this.service.schema[eventName].call(this, json, ctx);
			}
		});
	} */

	/**
	 * Clears the cache for this service.
	 *
	 * This method does the following:
	 * - Emits a cache clean event for this service.
	 * - If a cacher is available, cleans the cache for this service.
	 *
	 * @methods
	 * @returns {Promise<any>} A promise that resolves when the cache is cleaned. If no cacher is available, the promise resolves immediately.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async clearCache(): Promise<any> {
		this.broker[this.service.settings.cacheCleanEventType](`cache.clean.${this.fullName}`);
		if (this.broker.cacher) {
			return this.broker.cacher.clean(`${this.fullName}.**`);
		}
	}
	/* public async clearCache(): Promise<any> {
		this.broker[this.service.settings.cacheCleanEventType](`cache.clean.${this.fullName}`);
		if (this.broker.cacher) {
			return await this.broker.cacher.clean(`${this.fullName}.**`);
		}
		return resolve();
	} */

	/**
	 * Filters the fields of a document.
	 *
	 * This method does the following:
	 * - If the fields parameter is an array, it does the following:
	 *   - Reduces the fields array to a new object that only includes the specified fields from the document.
	 *   - If a field is not found in the document, it is not included in the new object.
	 *   - Returns the new object.
	 * - If the fields parameter is not an array, it returns the document as is.
	 *
	 * @methods
	 * @param {Object} doc - The document to filter.
	 * @param {string[]} fields - The fields to include in the filtered document.
	 * @returns {object} The filtered document.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public filterFields(doc: object, fields: string[]): object {
		if (Array.isArray(fields)) {
			return fields.reduce((res, n) => {
				const v = get(doc, n);
				if (v !== undefined) {
					set(res, n, v);
				}
				return res;
			}, {});
		}
		return doc;
	}
	/* public filterFields(doc: any, fields: any[]): object {
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
	} */

	/**
	 * Excludes specified fields from a document.
	 *
	 * This method does the following:
	 * - If the fields parameter is a string, it converts it to an array.
	 * - If the fields array is not empty, it calls the `_excludeFields` method with the document and the fields array, and returns the result.
	 * - If the fields array is empty, it returns the document as is.
	 *
	 * @methods
	 * @param {any} doc - The document to exclude fields from.
	 * @param {string | string[]} fields - The fields to exclude from the document. This can be a string or an array of strings.
	 * @returns {object} The document with the specified fields excluded.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public excludeFields(doc: object, fields: string | string[]): object {
		if (typeof fields === 'string') {
			fields = [fields];
		}
		if (fields.length > 0) {
			return this._excludeFields(doc, fields);
		}
		return doc;
	}
	/* public excludeFields(doc: any, fields: string | any[]): object {
		if (Array.isArray(fields) && fields.length > 0) {
			return this._excludeFields(doc, fields);
		}

		return doc;
	} */

	/**
	 * Populates documents with additional data based on the provided fields.
	 *
	 * This method does the following:
	 * - Logs a debug message.
	 * - Checks if the service settings include populates, if the populateFields parameter is an array,
	 *   and if it is not empty. If any of these conditions are not met, it returns the documents as is.
	 * - Checks if the documents are null, not an object, or not an array. If any of these conditions are met,
	 *   it returns the documents as is.
	 * - Groups the populate fields based on the service settings.
	 * - For each populate field in the service settings, it does the following:
	 *   - Checks if the grouped populate fields include the populate field. If not, it continues to the next populate field.
	 *   - Gets the rule for the populate field from the service settings.
	 *   - If the rule is a function, it converts it to an object with a handler property.
	 *   - If the rule is a string, it converts it to an object with an action property.
	 *   - Adds the populate field to the rule object.
	 *   - Gets the IDs from the documents based on the rule field.
	 *   - If the rule includes a handler, it calls the handler with the IDs, the documents, the rule, and the context,
	 *     and adds the promise to the promises array.
	 *   - If the rule does not include a handler and the IDs array is not empty, it does the following:
	 *     - Constructs the parameters for the action call.
	 *     - Calls the action with the parameters, transforms the result, and adds the promise to the promises array.
	 * - Waits for all promises to resolve, then returns the documents.
	 * - If any error occurs, it logs an error message and throws the error.
	 *
	 * @methods
	 * @param {Context} ctx - The context of the request.
	 * @param {Array|Object} docs - The documents to populate.
	 * @param {any[]} [populateFields] - The fields to populate in the documents.
	 * @returns {Promise<any>} A promise that resolves with the populated documents.
	 * @throws {Errors.MoleculerServerError} If any error occurs, the error is thrown.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async populateDocs(
		ctx: Context,
		docs: any[] | object,
		populateFields?: any[],
	): Promise<any> {
		this.logger!.debug('Attempting to populate documents..');
		if (
			!this.service.settings.populates ||
			!Array.isArray(populateFields) ||
			populateFields.length === 0
		) {
			return docs;
		}

		if (docs == null || (!isObject(docs) && !Array.isArray(docs))) {
			return docs;
		}

		const settingPopulateFields = Object.keys(this.service.settings.populates);

		const groupedPopulateFields = populateFields.reduce((map, populateField) => {
			const settingPopulateField = settingPopulateFields.find(
				(settingPopulateFieldString) =>
					settingPopulateFieldString === populateField ||
					populateField.startsWith(settingPopulateFieldString + '.'),
			);
			if (settingPopulateField != null) {
				if (!map.has(settingPopulateField)) {
					map.set(settingPopulateField, [populateField]);
				} else {
					map.get(settingPopulateField).push(populateField);
				}
			}
			return map;
		}, new Map());

		const promises = [];
		for (const populatesField of settingPopulateFields) {
			if (!groupedPopulateFields.has(populatesField)) {
				continue;
			}

			let rule = this.service.settings.populates[populatesField];

			if (isFunction(rule)) {
				rule = {
					handler: method(rule),
				};
			}

			if (isString(rule)) {
				rule = {
					action: rule,
				};
			}

			rule = { field: populatesField, ...rule };

			const arr = Array.isArray(docs) ? docs : [docs];

			const idList = uniq(flattenDeep(compact(arr.map((doc) => get(doc, rule.field)))));

			const resultTransform = (populatedDocs: any) => {
				arr.forEach((doc) => {
					const id = get(doc, rule.field);
					if (Array.isArray(id)) {
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
				const params = {
					id: idList,
					mapping: true,
					populate: [
						...groupedPopulateFields
							.get(populatesField)
							.map((populateField: string | any[]) =>
								populateField.slice(populatesField.length + 1),
							)
							.filter((field: string) => field !== ''),
						...(rule.populate ? rule.populate : []),
					],
					...(rule.params || {}),
				};

				if (params.populate.length === 0) {
					delete params.populate;
				}

				promises.push(ctx.call(rule.action, params).then(resultTransform));
			}
		}

		return Promise.all(promises)
			.then(() => docs)
			.catch((error: any) => {
				this.logger!.error(`Failed to populate documents: ${error}`);
				throw new Errors.MoleculerServerError(
					`Failed to populate documents: ${error}`,
					500,
					'FAILED_TO_POPULATE_DOCUMENTS',
					error,
				);
			});
	}
	// public async populateDocs(ctx: any, docs: any, populateFields?: any[]): Promise<any> {
	// 	this.logger!.debug('Attempting to populate documents..');
	// 	if (
	// 		!this.service.settings.populates ||
	// 		!isArray(populateFields) ||
	// 		populateFields.length === 0
	// 	) {
	// 		return resolve(docs);
	// 	}

	// 	if (docs == null || (!isObject(docs) && !isArray(docs))) {
	// 		return resolve(docs);
	// 	}

	// 	const settingPopulateFields = Object.keys(this.service.settings.populates);

	// 	/* Group populateFields by populatesFields for deep population.
	// 		(e.g. if "post" in populates and populateFields = ["post.author", "post.reviewer", "otherField"])
	// 		then they would be grouped together: { post: ["post.author", "post.reviewer"], otherField:["otherField"]}
	// 		*/
	// 	const groupedPopulateFields = populateFields.reduce((obj, populateField) => {
	// 		const settingPopulateField = settingPopulateFields.find(
	// 			(settingPopulateFieldString) =>
	// 				settingPopulateFieldString === populateField ||
	// 				populateField.startsWith(settingPopulateFieldString + '.'),
	// 		);
	// 		if (settingPopulateField != null) {
	// 			if (obj[settingPopulateField] == null) {
	// 				obj[settingPopulateField] = [populateField];
	// 			} else {
	// 				obj[settingPopulateField].push(populateField);
	// 			}
	// 		}
	// 		return obj;
	// 	}, {});

	// 	const promises = [];
	// 	for (const populatesField of settingPopulateFields) {
	// 		let rule = this.service.settings.populates[populatesField];
	// 		if (groupedPopulateFields[populatesField] == null) {
	// 			continue;
	// 		} // skip

	// 		// if the rule is a function, save as a custom handler
	// 		if (isFunction(rule)) {
	// 			rule = {
	// 				handler: method(rule),
	// 			};
	// 		}

	// 		// If the rule is string, convert to object
	// 		if (isString(rule)) {
	// 			rule = {
	// 				action: rule,
	// 			};
	// 		}

	// 		if (rule.field === undefined) {
	// 			rule.field = populatesField;
	// 		}

	// 		const arr = isArray(docs) ? docs : [docs];

	// 		// Collect IDs from field of docs (flatten, compact & unique list)
	// 		const idList = uniq(flattenDeep(compact(arr.map((doc) => get(doc, rule.field)))));
	// 		// Replace the received models according to IDs in the original docs
	// 		const resultTransform = (populatedDocs: any) => {
	// 			arr.forEach((doc) => {
	// 				const id = get(doc, rule.field);
	// 				if (isArray(id)) {
	// 					const models = compact(id.map((docId) => populatedDocs[docId]));
	// 					set(doc, populatesField, models);
	// 				} else {
	// 					set(doc, populatesField, populatedDocs[id]);
	// 				}
	// 			});
	// 		};

	// 		if (rule.handler) {
	// 			promises.push(rule.handler.call(this, idList, arr, rule, ctx));
	// 		} else if (idList.length > 0) {
	// 			// Call the target action & collect the promises
	// 			const params = Object.assign(
	// 				{
	// 					id: idList,
	// 					mapping: true,
	// 					populate: [
	// 						// Transform "post.author" into "author" to pass to next populating service
	// 						...groupedPopulateFields[populatesField]
	// 							.map((populateField: string | any[]) =>
	// 								populateField.slice(populatesField.length + 1),
	// 							) // +1 to also remove any leading "."
	// 							.filter((field: string) => field !== ''),
	// 						...(rule.populate ? rule.populate : []),
	// 					],
	// 				},
	// 				rule.params || {},
	// 			);

	// 			if (params.populate.length === 0) {
	// 				delete params.populate;
	// 			}

	// 			promises.push(ctx.call(rule.action, params).then(resultTransform));
	// 		}
	// 	}

	// 	return all(promises).then(() => docs);
	// }

	/**
	 * Validates an entity or an array of entities.
	 * Uses the `entityValidator` setting. If no validator function is supplied, returns record.
	 *
	 * This method does the following:
	 * - Checks if the entityValidator in the service settings is a function. If not, it returns the entity as is.
	 * - If the entity is not an array, it converts it to an array.
	 * - Calls the entityValidator for each entity in the array, and waits for all promises to resolve.
	 * - Returns the entity.
	 *
	 * @methods
	 * @param {Object | Object[]} entity - The entity or an array of entities to validate.
	 * @returns {Promise<Object | Object[]>} A promise that resolves with the validated entity or array of entities.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public async validateEntity(entity: object | object[]): Promise<object | object[]> {
		if (!isFunction(this.service.settings.entityValidator)) {
			return entity;
		}

		const entities = isArray(entity) ? entity : [entity];
		await Promise.all(
			entities.map((entityToValidate) =>
				this.service.settings.entityValidator.call(this, entityToValidate),
			),
		);
		return entity;
	}
	/* public async validateEntity(entity: any): Promise<any> {
		if (!isFunction(this.service.settings.entityValidator)) {
			return resolve(entity);
		}

		const entities = isArray(entity) ? entity : [entity];
		return all(
			entities.map((entityToValidate) =>
				this.service.settings.entityValidator.call(this, entityToValidate),
			),
		).then(() => entity);
	} */

	/**
	 * Converts an entity to a JavaScript object.
	 *
	 * This method currently returns the entity as is. It can be overridden in subclasses to provide custom entity to object conversion.
	 *
	 * @methods
	 * @param {any} entity - The entity to convert.
	 * @returns {object} The converted object.
	 * @memberof MikroORMDbAdapter
	 */
	public entityToObject(entity: any): object {
		return entity;
	}

	/**
	 * Authorizes the fields based on the service settings.
	 *
	 * This method does the following:
	 * - Checks if the service settings include fields and if the fields array is not empty. If not, it returns the askedFields as is.
	 * - Checks if the askedFields parameter is an array and if it is not empty. If not, it returns the askedFields as is.
	 * - Filters the askedFields array to include only the fields that are allowed by the service settings. It does this by doing the following:
	 *   - Checks if the askedField is included in the service settings fields. If it is, it includes the askedField in the allowedFields.
	 *   - If the askedField includes a '.', it splits the askedField into parts and checks if any of the parts are included
	 *     in the service settings fields. If they are, it includes the askedField in the allowedFields.
	 *   - Checks if any of the service settings fields start with the askedField followed by a '.'.
	 *     If they do, it includes the askedField in the allowedFields.
	 * - Returns the allowedFields.
	 *
	 * @methods
	 * @param {String[]} askedFields - The fields to authorize.
	 * @returns {String[]} The authorized fields.
	 * @memberof MikroORMDbAdapter
	 */
	public authorizeFields(askedFields: string[]): string[] {
		if (this.service.settings.fields && this.service.settings.fields.length > 0) {
			if (isArray(askedFields) && askedFields.length > 0) {
				const allowedFields = askedFields.filter((askedField) => {
					if (this.service.settings.fields.includes(askedField)) {
						return true;
					}

					if (askedField.includes('.')) {
						const parts = askedField.split('.');
						while (parts.length > 1) {
							parts.pop();
							if (this.service.settings.fields.includes(parts.join('.'))) {
								return true;
							}
						}
					}

					const nestedFields = this.service.settings.fields.filter(
						(settingField: string) => settingField.startsWith(askedField + '.'),
					);
					return nestedFields.length > 0;
				});

				return allowedFields;
			}
		}

		return askedFields;
	}
	/* public authorizeFields(askedFields: any[]): any[] {
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
	} */

	/**
	 * Sanitizes and converts parameters based on their expected types.
	 *
	 * This method does the following:
	 * - Copies the parameters object.
	 * - Defines helper functions to convert parameters to numbers, arrays, and JSON objects.
	 * - Converts the 'limit', 'offset', 'page', and 'pageSize' parameters to numbers.
	 * - Converts the 'sort', 'fields', 'excludeFields', 'populate', and 'searchFields' parameters to arrays.
	 * - Converts the 'query', 'where', and 'options' parameters to JSON objects.
	 * - If the action is a list action, it does the following:
	 *   - Sets default values for the 'pageSize' and 'page' parameters.
	 *   - If the 'pageSize' parameter is greater than the maximum page size, it sets the 'pageSize' parameter to the maximum page size.
	 *   - Sets the 'limit' parameter to the 'pageSize' parameter.
	 *   - Calculates the 'offset' parameter based on the 'page' and 'pageSize' parameters.
	 * - If the 'limit' parameter is greater than the maximum limit, it sets the 'limit' parameter to the maximum limit.
	 * - Returns the sanitized parameters.
	 *
	 * @methods
	 * @param {Context} ctx - The context of the request.
	 * @param {Object} params - The parameters to sanitize.
	 * @returns {object} The sanitized parameters.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public sanitizeParams(ctx: Context, params: object): object {
		const p: { [key: string]: any } = { ...params };

		const convertToNumber = (param: string) => {
			if (typeof p[param] === 'string') {
				p[param] = Number(p[param]);
			}
		};

		const convertToArray = (param: string) => {
			if (typeof p[param] === 'string') {
				p[param] = p[param].split(/[,\s]+/);
			}
		};

		const convertToJSON = (param: string) => {
			if (typeof p[param] === 'string') {
				p[param] = JSON.parse(p[param]);
			}
		};

		['limit', 'offset', 'page', 'pageSize'].forEach(convertToNumber);
		['sort', 'fields', 'excludeFields', 'populate', 'searchFields'].forEach(convertToArray);
		['query', 'where', 'options'].forEach(convertToJSON);

		if (ctx.action?.name?.endsWith('.list')) {
			const { pageSize: defaultPageSize, maxPageSize, maxLimit } = this.service.settings;

			p.pageSize = p.pageSize || defaultPageSize;
			p.page = p.page || 1;

			if (maxPageSize > 0 && p.pageSize > maxPageSize) {
				p.pageSize = maxPageSize;
			}

			p.limit = p.pageSize;
			p.offset = (p.page - 1) * p.pageSize;
		}

		if (this.service.settings.maxLimit > 0 && p.limit > this.service.settings.maxLimit) {
			p.limit = this.service.settings.maxLimit;
		}

		return p;
	}
	/* public sanitizeParams(ctx: any, params: any) {
		const p = { ...params };

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

		if (typeof p.where === 'string') {
			p.where = JSON.parse(p.where);
		}
		if (typeof p.options === 'string') {
			p.options = JSON.parse(p.options);
		}

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
	} */

	/**
	 * Excludes specified fields from a document. Internal use only, must ensure `fields` is an Array
	 *
	 * This method does the following:
	 * - Clones the document.
	 * - For each field in the fields array, it removes the field from the cloned document.
	 * - Returns the cloned document.
	 *
	 * @methods
	 * @param {Object} doc - The document to exclude fields from.
	 * @param {String[]} fields - The fields to exclude from the document.
	 * @returns {object} The document with the specified fields excluded.
	 *
	 * @memberof MikroORMDbAdapter
	 */
	private _excludeFields(doc: object, fields: string[]) {
		return fields.reduce((res, field) => {
			unset(res, field);
			return res;
		}, cloneDeep(doc));
	}
	/* private _excludeFields(doc: any, fields: any[]) {
		const res = cloneDeep(doc);
		fields.forEach((field) => {
			unset(res, field);
		});
		return res;
	} */
	// #endregion Adapter custom methods
}

/**
 * Implementation of the MikroORMServiceSchemaMixin.
 * It defines a mixin function that can be used to create a Mikro-ORM Data Access service schema.
 * The schema includes service settings, actions for finding, counting, listing, creating, inserting, and getting entities.
 * Each action has its own parameters and handler function.
 */
export const MikroORMServiceSchemaMixin = (mixinOptions?: ServiceSettingSchema) => {
	const mixin = defaultsDeep(
		{
			// #region Service settings
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

			// db adapter (NeDB adapter is the default)
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
			// #endregion Service settings
			// #region Service Actions
			/**
			 * Actions
			 */
			actions: {
				/**
				 * The `find` method configuration.
				 *
				 * This configuration does the following:
				 * - Defines the cache keys for the `find` method.
				 * - Defines the parameters for the `find` method, including their types, whether they are optional, and their conversion rules.
				 * - Defines the handler for the `find` method, which sanitizes the parameters and calls the `_find` method.
				 *
				 * @actions
				 * @cached
				 * @property {object} cache - The cache configuration for the `find` method.
				 * @property {string[]} cache.keys - The keys to cache for the `find` method.
				 *
				 * @property {object} params - The parameters configuration for the `find` method.
				 * @property {object[]} params.populate - The configuration for the `populate` parameter.
				 * @property {object[]} params.fields - The configuration for the `fields` parameter.
				 * @property {object[]} params.excludeFields - The configuration for the `excludeFields` parameter.
				 * @property {object} params.take - The configuration for the `take` parameter.
				 * @property {object} params.skip - The configuration for the `skip` parameter.
				 * @property {object} params.limit - The configuration for the `limit` parameter.
				 * @property {object} params.offset - The configuration for the `offset` parameter.
				 * @property {object} params.sort - The configuration for the `sort` parameter.
				 * @property {object} params.search - The configuration for the `search` parameter.
				 * @property {object[]} params.searchFields - The configuration for the `searchFields` parameter.
				 * @property {object[]} params.query - The configuration for the `query` parameter.
				 *
				 * @property {Function} handler - The handler for the `find` method.
				 * @property {Context<{params: any}>} handler.ctx - The context of the request.
				 *
				 * @returns {Object | Object[]} The result of the `_find` method.
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
					): object | object[] {
						// @ts-ignore
						const params = this.adapter.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return this._find(params);
					},
				},

				/**
				 * The `count` method configuration.
				 *
				 * This configuration does the following:
				 * - Defines the cache keys for the `count` method.
				 * - Defines the parameters for the `count` method, including their types and whether they are optional.
				 * - Defines the handler for the `count` method, which sanitizes the parameters and calls the `_count` method.
				 *
				 * @actions
				 * @cached
				 * @property {object} cache - The cache configuration for the `count` method.
				 * @property {string[]} cache.keys - The keys to cache for the `count` method.
				 *
				 * @property {object?} params - The parameters configuration for the `count` method.
				 * @property {object?} params.options - The configuration for the `options` parameter.
				 * @property {object?} params.query - The configuration for the `query` parameter.
				 *
				 * @property {Function} handler - The handler for the `count` method.
				 * @property {Context<{options?: any}, {query?: any}>} handler.ctx - The context of the request.
				 *
				 * @returns {Number} The result of the `_count` method.
				 */
				count: {
					cache: {
						keys: ['search', 'searchFields', 'query'],
					},
					params: {
						options: { type: 'object', optional: true },
						query: { type: 'object', optional: true },
					},
					handler(ctx: Context<{ options?: any }, { query?: any }>): number {
						// @ts-ignore
						const params = this.adapter.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return this._count(params);
					},
				},

				/**
				 *Defines the `list` action for a service.
				 *
				 * This action does the following:
				 * - Defines cache keys for the action.
				 * - Defines the RESTful route for the action.
				 * - Defines the parameters for the action.
				 * - Defines a handler for the action that sanitizes the parameters and then calls the `_list` method of the service
				 *  with the context and sanitized parameters.
				 *
				 * @actions
				 * @cached
				 * @param {String|Array<String>} populate - Populated fields.
				 * @param {String|Array<String>} fields - Fields filter.
				 * @param {String|Array<String>} excludeFields - List of excluded fields.
				 * @param {Number?} page - Page number.
				 * @param {Number?} pageSize - Size of a page.
				 * @param {String?} sort - Sorted fields.
				 * @param {String?} search - Search text.
				 * @param {String|Array<String>} searchFields - Fields for searching.
				 * @param {Object?} query - Query object. Passes to adapter.
				 * @returns {Promise<object>} List of found entities and count with pagination info.
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
					async handler(ctx: Context<{ params: ListParams }>): Promise<object> {
						// @ts-ignore
						const sanatizedParams = this.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return await this._list(ctx, sanatizedParams);
					},
				},

				/**
				 * The `create` method configuration.
				 *
				 * This configuration does the following:
				 * - Defines the REST endpoint for the `create` method.
				 * - Defines the parameters for the `create` method, including their types and whether they are optional.
				 * - Defines the handler for the `create` method, which sanitizes the parameters and calls the `_create` method.
				 *
				 * @actions
				 * @property {string} rest - The REST endpoint for the `create` method.
				 *
				 * @property {object} params - The parameters configuration for the `create` method.
				 * @property {object | object[]} params.entityOrEntities - The configuration for the `entityOrEntities` parameter.
				 * @property {object?} params.options - The configuration for the `options` parameter.
				 *
				 * @property {Function} handler - The handler for the `create` method.
				 * @property {Context<{entityOrEntities: object | any[]}, {options?: object}>} handler.ctx - The context of the request.
				 *
				 * @returns {object | object[]} The result of the `_create` method.
				 */
				create: {
					rest: 'POST /',
					params: {
						entityOrEntities: [{ type: 'object' }, { type: 'array' }],
						options: { type: 'object', optional: true },
					},
					async handler(
						ctx: Context<{ entityOrEntities: object | object[] }, { options?: object }>,
					): Promise<object | object[]> {
						// @ts-ignore
						const params = this.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						// return this.adapter.create(ctx, entityOrEntities, options);
						return await this._create(ctx, params);
					},
				},

				/**
				 * The `insert` method configuration.
				 *
				 * This configuration does the following:
				 * - Defines the REST endpoint for the `insert` method.
				 * - Defines the parameters for the `insert` method, including their types and whether they are optional.
				 * - Defines the handler for the `insert` method, which sanitizes the parameters and calls the `_insert` method.
				 *
				 * @actions
				 * @property {string} rest - The REST endpoint for the `insert` method.
				 *
				 * @property {object} params - The parameters configuration for the `insert` method.
				 * @property {object | object[]} params.entityOrEntities - The configuration for the `entityOrEntities` parameter.
				 * @property {object?} params.options - The configuration for the `options` parameter.
				 *
				 * @property {Function} handler - The handler for the `insert` method.
				 * @property {Context<{entityOrEntities: object | any[]; options?: object}>} handler.ctx - The context of the request.
				 *
				 * @returns {object | object[]} The result of the `_insert` method.
				 */
				insert: {
					rest: 'PUT /',
					params: {
						entityOrEntities: [{ type: 'object' }, { type: 'array' }],
						options: { type: 'object', optional: true },
					},
					async handler(
						ctx: Context<{ entityOrEntities: object | object[]; options?: object }>,
					): Promise<object | object[]> {
						// @ts-ignore
						this.logger.debug('Insert action called.');
						// @ts-ignore
						const params = this.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return await this._insert(ctx, params);
					},
				},

				/**
				 * The `get` method configuration.
				 *
				 * This configuration does the following:
				 * - Defines the cache keys for the `get` method.
				 * - Defines the REST endpoint for the `get` method.
				 * - Defines the parameters for the `get` method, including their types, whether they are optional, and their items' types.
				 * - Defines the handler for the `get` method, which sanitizes the parameters and calls the `_get` method.
				 *
				 * @actions
				 * @cached
				 * @property {object} cache - The cache configuration for the `get` method.
				 * @property {string[]} cache.keys - The keys to cache for the `get` method.
				 *
				 * @property {string} rest - The REST endpoint for the `get` method.
				 *
				 * @property {object} params - The parameters configuration for the `get` method.
				 * @property {string|number|string[]|number[]>} params.id - The configuration for the `id` parameter.
				 * @property {string?|stirng[]?} params.populate - The configuration for the `populate` parameter.
				 * @property {string?|stirng[]?} params.relations - The configuration for the `relations` parameter.
				 * @property {string?|stirng[]?} params.fields - The configuration for the `fields` parameter.
				 * @property {string?|stirng[]?} params.excludeFields - The configuration for the `excludeFields` parameter.
				 * @property {boolean?} params.mapping - The configuration for the `mapping` parameter.
				 *
				 * @property {Function} handler - The handler for the `get` method.
				 * @property {Context<{
				 *   id: string | number | string[] | number[];
				 *   populate?: string | string[];
				 *   relations?: string | string[];
				 *   fields?: string | string[];
				 *   excludeFields?: string | string[];
				 *   mapping?: boolean;}>} handler.ctx - The context of the request.
				 *
				 * @returns {object | object[]} The result of the `_get` method.
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
					async handler(
						ctx: Context<{
							id: string | number | string[] | number[];
							populate?: string | string[];
							relations?: string | string[];
							fields?: string | string[];
							excludeFields?: string | string[];
							mapping?: boolean;
						}>,
					): Promise<object | object[]> {
						// @ts-ignore
						const params = this.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return await this._get(ctx, /* null, */ params);
					},
				},

				/**
				 * The `update` method configuration.
				 *
				 * This configuration does the following:
				 * - Defines the REST endpoint for the `update` method.
				 * - Defines the parameters for the `update` method, including their types and whether they are optional.
				 * - Defines the handler for the `update` method, which sanitizes the parameters and calls the `_update` method.
				 *
				 * @actions
				 * @property {string} rest - The REST endpoint for the `update` method.
				 *
				 * @property {object} params - The parameters configuration for the `update` method.
				 * @property {string|number} params.id - The configuration for the `id` parameter.
				 *
				 * @property {Function} handler - The handler for the `update` method.
				 * @property {Context<{id: any}>} handler.ctx - The context of the request.
				 *
				 * @returns {object} The result of the `_update` method.
				 * @throws {EntityNotFoundError} - 404 Entity not found
				 */
				update: {
					rest: 'PUT /:id',
					params: {
						id: { type: 'any' },
					},
					async handler(ctx: Context<{ id: string | number }>): Promise<object> {
						// @ts-ignore
						const params = this.sanitizeParams(ctx, ctx.params);
						// @ts-ignore
						return await this._update(ctx, params);
					},
				},

				/**
				 * The `remove` method configuration.
				 *
				 * This configuration does the following:
				 * - Defines the REST endpoint for the `remove` method.
				 * - Defines the parameters for the `remove` method, including their types and whether they are optional.
				 * - Defines the handler for the `remove` method, which sanitizes the parameters and calls the `_remove` method.
				 *
				 * @actions
				 * @property {string} rest - The REST endpoint for the `remove` method.
				 *
				 * @property {object} params - The parameters configuration for the `remove` method.
				 * @property {string|number} params.id - The configuration for the `id` parameter.
				 * @property {object?} params.options - The configuration for the `options` parameter.
				 *
				 * @property {Function} handler - The handler for the `remove` method.
				 * @property {Context<{id: any; options?: object}>} handler.ctx - The context of the request.
				 *
				 * @returns {object} The result of the `_remove` method.
				 * @throws {EntityNotFoundError} - 404 Entity not found
				 */
				remove: {
					rest: 'DELETE /:id',
					params: {
						id: [{ type: 'string' }, { type: 'number' }],
						options: { type: 'object', optional: true },
					},
					async handler(ctx: Context<{ id: any; options?: object }>): Promise<object> {
						// @ts-ignore
						return await this._remove(ctx, ctx.params);
					},
				},
			},
			// #endregion Service Actions
			// #region Service Methods
			/**
			 * Methods
			 */
			methods: {
				/**
				 * This method does the following:
				 * - Logs the start of the connection process.
				 * - Calls the `connect` method of the adapter.
				 * - After the connection is established, it checks if there is an `afterConnected` function in the schema.
				 * - If the `afterConnected` function exists, it logs the start of the `afterConnected` call and then calls this function.
				 * - If an error occurs during the execution of the `afterConnected` function, it logs the error and throws a `MoleculerServerError`.
				 * - If an error occurs during the connection process, it throws a `MoleculerServerError`.
				 *
				 * @returns {Promise<void>} A promise that resolves when the connection is established and the
				 * `afterConnected` function (if it exists) has been called.
				 *
				 * @throws {Errors.MoleculerServerError} If an error occurs during the execution of the `afterConnected` function,
				 * it logs the error and continues.
				 */
				async connect(): Promise<void> {
					try {
						// @ts-ignore
						this.logger.info('Connecting adapter...');
						// Connect using the adapter
						// @ts-ignore
						await this.adapter.connect();

						// Call an 'afterConnected' handler in schema
						// @ts-ignore
						if (isFunction(this.schema.afterConnected)) {
							try {
								// @ts-ignore
								this.logger.info('Calling service afterConnected method...');
								// @ts-ignore
								return this.schema.afterConnected.call(this);
							} catch (err) {
								// @ts-ignore
								this.logger.error('afterConnected error: ', err);
								throw new Errors.MoleculerServerError(
									`Failed to call afterConnected: ${err}`,
									500,
									'FAILED_TO_CALL_AFTERCONNECTED',
									err,
								);
							}
						}
					} catch (err) {
						/* istanbul ignore next */
						throw new Errors.MoleculerServerError(
							`Failed to connect adapter: ${err}`,
							500,
							'FAILED_TO_CONNECT_ADAPTER',
							err,
						);
					}
				},

				/**
				 * Disconnects the adapter if the `disconnect` method exists on the adapter.
				 *
				 * This method does the following:
				 * - Checks if the `disconnect` method exists on the adapter.
				 * - If the `disconnect` method exists, it calls this method.
				 *
				 * @returns {void} The result of the `disconnect` method on the adapter, if it exists.
				 */
				disconnect(): void {
					// @ts-ignore
					if (isFunction(this.adapter.disconnect)) {
						// @ts-ignore
						return this.adapter.disconnect();
					}
				},

				/**
				 * Sanitizes the parameters for a context.
				 *
				 * This method does the following:
				 * - Calls the `sanitizeParams` method of the adapter with the provided context and parameters.
				 *
				 * @param {Context} ctx - The context for which to sanitize the parameters.
				 * @param {object} params - The parameters to sanitize.
				 *
				 * @returns {object} The sanitized parameters.
				 */
				sanitizeParams(ctx: Context, params: object): object {
					// @ts-ignore
					return this.adapter.sanitizeParams(ctx, params);
				},

				/**
				 * Retrieves an item or items by their ID(s) from the adapter.
				 *
				 * This method does the following:
				 * - If `decoding` is true, it decodes the ID(s) using the `decodeID` method of the adapter.
				 * - Calls the `findById` method of the adapter with the ID(s).
				 *
				 * @methods
				 * @param {string | any[]} id - The ID(s) of the item(s) to retrieve.
				 * @param {boolean?} decoding - Whether to decode the ID(s) before retrieving the item(s).
				 *
				 * @returns {Promise<object | object[]>} A promise that resolves to the retrieved item(s).
				 *
				 * @throws {Error} If an error occurs during the retrieval of the item(s), it throws an error.
				 */
				async getById(id: string | any[], decoding: boolean): Promise<object | object[]> {
					// @ts-ignore
					return await this.adapter.findById(decoding ? this.adapter.decodeID(id) : id);
				},
				/* getById(
					// ctx: Context,
					// @ts-ignore
					// key: string | undefined | null = this.settings.idField,
					id: string | any[],
					decoding: boolean,
				): any {
					return resolve().then(() =>
						// @ts-ignore
						this.adapter.findById(
							// @ts-ignore
							decoding ? this.adapter.decodeID(id) : id,
						),
					);
				}, */

				/**
				 * Performs operations before an entity change.
				 *
				 * This method does the following:
				 * - Calls the `beforeEntityChange` method of the adapter with the provided type, entity, and context.
				 *
				 * @methods
				 * @param {string | undefined} type - The type of the entity change.
				 * @param {object} entity - The entity that is about to change.
				 * @param {Context} ctx - The context for the entity change.
				 *
				 * @returns {Promise<any>} The result of the `beforeEntityChange` method on the adapter.
				 */
				async beforeEntityChange(
					type: string | undefined,
					entity: object,
					ctx: Context,
				): Promise<any> {
					// @ts-ignore
					return await this.adapter.beforeEntityChange(type, entity, ctx);
				},

				/**
				 * Notifies the adapter that an entity has changed.
				 *
				 * This method does the following:
				 * - Calls the `entityChanged` method of the adapter with the provided type, entity, and context.
				 *
				 * @methods
				 * @param {string | undefined} type - The type of the entity change.
				 * @param {object | object[] | number} entity - The entity that has changed.
				 * @param {Context} ctx - The context for the entity change.
				 *
				 * @returns {Promise<any>} A promise that resolves to the result of the `entityChanged` method on the adapter.
				 */
				async entityChanged(
					type: string | undefined,
					entity: object | object[] | number,
					ctx: Context,
				): Promise<any> {
					// @ts-ignore
					return await this.adapter.entityChanged(type, entity, ctx);
				},

				/**
				 * Clears the cache for this service.
				 *
				 * This method does the following:
				 * - Emits a `cache.clean` event for this service.
				 * - If a cacher is available, it calls the `clean` method of the cacher with a pattern that matches all cache entries for this service.
				 *
				 * @methods
				 * @returns {any} The result of the `clean` method on the cacher, if a cacher is available.
				 */
				clearCache(): any {
					// @ts-ignore
					this.broker[this.settings.cacheCleanEventType](`cache.clean.${this.fullName}`);
					// @ts-ignore
					if (this.broker.cacher) {
						// @ts-ignore
						return this.broker.cacher.clean(`${this.fullName}.**`);
					}
				},
				/* clearCache(): any {
					// @ts-ignore
					this.broker[this.settings.cacheCleanEventType](`cache.clean.${this.fullName}`);
					// @ts-ignore
					if (this.broker.cacher) {
						// @ts-ignore
						return this.broker.cacher.clean(`${this.fullName}.**`);
					}
					return resolve();
				}, */

				/**
				 * Transforms documents using the adapter.
				 *
				 * This method does the following:
				 * - Calls the `transformDocuments` method of the adapter with the provided context, parameters, and documents.
				 *
				 * @methods
				 * @param {Context} ctx - The context for the transformation.
				 * @param {object} params - The parameters for the transformation.
				 * @param {object | object[]} docs - The documents to transform.
				 *
				 * @returns {Promise<any[] | object>} A promise that resolves to the transformed documents.
				 */
				async transformDocuments(
					ctx: Context,
					params: object,
					docs: object | object[],
				): Promise<any[] | object> {
					// @ts-ignore
					return await this.adapter.transformDocuments(ctx, params, docs);
				},

				/**
				 * Filters the fields of a document.
				 *
				 * This method does the following:
				 * - Calls the `filterFields` method of the adapter with the provided document and fields.
				 *
				 * @methods
				 * @param {object} doc - The document whose fields to filter.
				 * @param {string | string[]} fields - The fields to include in the filtered document.
				 *
				 * @returns {object} The filtered document.
				 */
				filterFields(doc: object, fields: string | string[]): object {
					// @ts-ignore
					return this.adapter.filterFields(doc, fields);
				},

				/**
				 * Excludes specified fields from a document.
				 *
				 * This method does the following:
				 * - Calls the `excludeFields` method of the adapter with the provided document and fields.
				 *
				 * @methods
				 * @param {object} doc - The document from which to exclude fields.
				 * @param {string | string[]} fields - The field or fields to exclude from the document.
				 *
				 * @returns {object} The document with the specified fields excluded.
				 */
				excludeFields(doc: object, fields: string | string[]): object {
					// @ts-ignore
					return this.adapter.excludeFields(doc, fields);
				},

				/**
				 * Authorizes the specified fields.
				 *
				 * This method does the following:
				 * - Calls the `authorizeFields` method of the adapter with the provided fields.
				 *
				 * @methods
				 * @param {string[]} askedFields - The fields to authorize.
				 *
				 * @returns {string[]} The authorized fields.
				 */
				authorizeFields(askedFields: string[]): string[] {
					// @ts-ignore
					return this.adapter.authorizeFields(askedFields);
				},

				/**
				 * Populates the specified fields in the documents.
				 *
				 * This method does the following:
				 * - Calls the `populateDocs` method of the adapter with the provided context, documents, and fields to populate.
				 *
				 * @methods
				 * @param {Context} ctx - The context for the population.
				 * @param {object | object[]} docs - The documents in which to populate the fields.
				 * @param {string[]} populateFields - The fields to populate in the documents.
				 *
				 * @returns {Promise<object | object[]>} A promise that resolves to the documents with the specified fields populated.
				 */
				async populateDocs(
					ctx: Context,
					docs: object | object[],
					populateFields?: string[],
				): Promise<object | object[]> {
					// @ts-ignore
					return await this.adapter.populateDocs(ctx, docs, populateFields);
				},

				/**
				 * Validates an entity or entities.
				 *
				 * This method does the following:
				 * - Calls the `validateEntity` method of the adapter with the provided entity or entities.
				 *
				 * @methods
				 * @param {object | object[]} entity - The entity or entities to validate.
				 *
				 * @returns {Promise<object | object[]>} A promise that resolves to the validated entity or entities.
				 *
				 * @throws {Error} If an error occurs during the validation of the entity or entities, it throws an error.
				 */
				async validateEntity(entity: object | object[]): Promise<object | object[]> {
					// @ts-ignore
					return await this.adapter.validateEntity(entity);
				},

				/**
				 * Encodes an ID.
				 *
				 * This method does the following:
				 * - Calls the `encodeID` method of the adapter with the provided ID.
				 *
				 * @methods
				 * @param {any} id - The ID to encode.
				 *
				 * @returns {any} The encoded ID.
				 */
				encodeID(id: any): any {
					// @ts-ignore
					return this.adapter.encodeID(id);
				},

				/**
				 * Decodes an ID.
				 *
				 * This method does the following:
				 * - Calls the `decodeID` method of the adapter with the provided ID.
				 *
				 * @methods
				 * @param {any} id - The ID to decode.
				 *
				 * @returns {any} The decoded ID.
				 */
				decodeID(id: any): any {
					// @ts-ignore
					return this.adapter.decodeID(id);
				},

				/**
				 * Finds documents based on the provided context.
				 *
				 * This method does the following:
				 * - Sanitizes the parameters from the context.
				 * - If a `where` clause is present in the parameters, it calls the `find` method of the adapter with the `where` clause and options,
				 * transforms the found documents, and handles any errors.
				 * - If an `options` clause is present in the parameters, it calls the `find` method of the adapter with the parameters and options,
				 * transforms the found documents, and handles any errors.
				 *
				 * Params should be an object with entity property or an object with `where` query.
				 * e.g. `{ id: '123456' }` or `{ where: [12345,123456]}` or
				 * {where: {"$and":[{"id":{"$in":[12345,123456]}}]}}
				 * Options property is optional.
				 *
				 * @methods
				 * @param {Context<FilterQuery<T> | { where?: FilterQuery<T>; options?: FindOptions<T, P> }>} ctx - The context for the find operation.
				 *
				 * @returns {Promise<Loaded<T, P> | Loaded<T, P>[]>} A promise that resolves to the found documents, either as a single document or an array
				 * of documents.
				 *
				 * @throws {moleculer.Errors.MoleculerServerError} If an error occurs during the find operation, it throws a MoleculerServerError
				 * with a message that includes the error, a status code of 500, and an error code of 'FAILED_TO_FIND_ONE_BY_OPTIONS'.
				 */
				async _find<T extends object, P extends string>(
					ctx: Context<
						FilterQuery<T> | { where?: FilterQuery<T>; options?: FindOptions<T, P> }
					>,
				): Promise<Loaded<T, P> | Loaded<T, P>[]> {
					// @ts-ignore
					this.logger.debug('Sanatizing paramaters...');
					const params: { [key: string]: any } = this.sanitizeParams(ctx, ctx.params);

					const wherePresent = async () =>
						// @ts-ignore
						await this.adapter
							.find(params.where, params.options)
							// return await this['_find'](where, options)
							.then(async (docs: any) => {
								// @ts-ignore
								this.logger.debug('Transforming find docs...');
								return await this.transformDocuments(ctx, params, docs);
							})
							.catch((error: any) => {
								// @ts-ignore
								this.logger!.error(`Failed to find ${error}`);
								return new moleculer.Errors.MoleculerServerError(
									`Failed to find ${error}`,
									500,
									'FAILED_TO_FIND_ONE_BY_OPTIONS',
									error,
								);
							});

					const optionPresent = async () => {
						// @ts-ignore
						this.logger.debug('Copying params object...');
						const paramObj = { ...params };
						// @ts-ignore
						this.logger.debug('Checking object for options property...');
						const options = paramObj.options ? paramObj.options : undefined;
						if (paramObj.options) {
							// @ts-ignore
							this.logger.debug('Deleting where property...');
							delete paramObj.options;
						}
						// @ts-ignore
						return await this.adapter
							.find(paramObj, options)
							// return await this['_find'](where, options)
							.then(async (docs: any) => {
								// @ts-ignore
								this.logger.debug('Transforming find docs...');
								return await this.transformDocuments(ctx, paramObj, docs);
							})
							.catch((error: any) => {
								// @ts-ignore
								this.logger.error(`Failed to find ${error}`);
								return new moleculer.Errors.MoleculerServerError(
									`Failed to find ${error}`,
									500,
									'FAILED_TO_FIND_ONE_BY_OPTIONS',
									error,
								);
							});
					};
					const response: Loaded<T, P>[] = params.where
						? await wherePresent()
						: await optionPresent();

					return response.length > 1 ? response : response[0];
				},

				/**
				 * Counts the number of documents that match the provided parameters.
				 *
				 * This method does the following:
				 * - Removes pagination parameters (`limit` and `offset`) from the provided parameters.
				 * - Calls the `count` method of the adapter with the provided parameters.
				 *
				 * @methods
				 * @param {Context} ctx - The context for the count operation.
				 * @param {Object?} params - The parameters for the count operation.
				 *
				 * @returns {number} The number of documents that match the provided parameters.
				 */
				_count(ctx: Context, params?: any): number {
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
				 * Lists documents based on the provided context and parameters.
				 *
				 * This method does the following:
				 * - Calls the `list` method of the adapter with the provided context and parameters.
				 *
				 * @methods
				 * @param {Context} ctx - The context for the list operation.
				 * @param {ListParams} params - The parameters for the list operation.
				 *
				 * @returns {Promise<object>} A promise that resolves to the list of documents.
				 */
				async _list(ctx: Context, params: ListParams): Promise<object> {
					// @ts-ignore
					return await this.adapter.list(ctx, params);
				},

				/**
				 * Creates a new entity or entities.
				 *
				 * This method does the following:
				 * - Calls the `beforeEntityChange` method with the 'create' action and the provided entity or entities.
				 * - Validates the entity or entities.
				 * - Calls the `create` method of the adapter with the entity or entities and any provided options.
				 * - Transforms the created documents.
				 * - Calls the `entityChanged` method with the 'created' action and the transformed documents.
				 *
				 * @methods
				 * @param {Context} ctx - The context for the create operation.
				 * @param {object} params - The parameters for the create operation, which include the entity or entities to create and any options.
				 *
				 * @returns {Promise<object | object[]>} A promise that resolves to the created entity or entities.
				 *
				 * @throws {moleculer.Errors.MoleculerServerError} If an error occurs during the create operation, it throws a MoleculerServerError
				 * with a message that includes the error, a status code of 500, and an error code of 'FAILED_TO_CREATE_ENTITY'.
				 */
				async _create<T extends object>(
					ctx: Context,
					params: { entityOrEntities: T | T[]; options?: CreateOptions },
				): Promise<object | object[]> {
					const { entityOrEntities, options } = params;
					try {
						let entity = await this.beforeEntityChange('create', entityOrEntities, ctx);
						// @ts-ignore
						this.logger.debug(`Validating entity(s) to create: ${entity}`);
						entity = await this.validateEntity(entity);
						// @ts-ignore
						this.logger.debug(`Attempting to create entity: ${entity}`);
						// @ts-ignore
						const doc = await this.adapter.create(entity, options);
						// @ts-ignore
						this.logger.debug('Transforming created entity...');
						const json = await this.transformDocuments(ctx, entityOrEntities, doc);
						await this.entityChanged('created', json, ctx);
						return json;
					} catch (err) {
						// @ts-ignore
						this.logger.error(`Failed to create entity: ${err}`);
						throw new Errors.MoleculerServerError(
							`Failed to create entity(s): ${JSON.stringify(entityOrEntities)}`,
							500,
							'FAILED_TO_CREATE_ENTITY',
							err,
						);
					}
				},

				/**
				 * Inserts a new entity or entities.
				 *
				 * This method does the following:
				 * - Calls the `_create` method with the provided context, entity or entities, and options.
				 *
				 * @methods
				 * @param {Context} ctx - The context for the insert operation.
				 * @param {object} params - The parameters for the insert operation, which include the entity or entities to insert and any options.
				 *
				 * @returns {Promise<object | object[]>} A promise that resolves to the inserted entity or entities.
				 *
				 * @throws {moleculer.Errors.MoleculerServerError} If an error occurs during the insert operation, it throws a MoleculerServerError
				 * with a message that includes the error, a status code of 500, and an error code of 'FAILED_TO_INSERT_ENTITY'.
				 */
				async _insert(
					ctx: Context,
					params: { entityOrEntities: object | object[]; options: object },
				): Promise<object | object[]> {
					const { entityOrEntities, options } = params;
					try {
						const records = await this._create(ctx, { entityOrEntities, options });
						return records;
					} catch (err) {
						// @ts-ignore
						this.logger.error(`Failed to insert entity: ${err}`);
						throw new Errors.MoleculerServerError(
							`Failed to insert entit(/ies): ${JSON.stringify(entityOrEntities)}`,
							500,
							'FAILED_TO_INSERT_ENTITY',
							err,
						);
					}
				},

				/**
				 * Retrieves an entity by its ID.
				 *
				 * This method does the following:
				 * - Calls the `getById` method with the provided ID(s).
				 * - If the entity is not found, it throws a MoleculerClientError.
				 * - If the `mapping` parameter is true, it clones the entity.
				 * - Calls the `transformDocuments` method with the context, parameters, and entity.
				 * - If the `mapping` parameter is not true, it returns the transformed documents.
				 * - If the `mapping` parameter is true, it encodes the ID of the original document and maps it to the transformed document in the result.
				 *
				 * @methods
				 * @param {Context} ctx - The context for the get operation.
				 * @param {object} params - The parameters for the get operation, which include the ID of the entity to get and whether
				 * to map the result.
				 *
				 * @returns {Promise<object>} A promise that resolves to the retrieved entity or entities.
				 *
				 * @throws {Errors.MoleculerClientError} If the entity is not found, it throws a MoleculerClientError with a message
				 * of 'Entity not found', a status code of 400, and the ID of the entity.
				 */
				async _get(ctx: Context, params: any): Promise<object> {
					const id = params.id;
					let origDoc: any;
					const shouldMapping = params.mapping === true;

					const entity = await this.getById(id, true);
					if (!entity) {
						throw new Errors.MoleculerClientError('Entity not found', 400, '', id);
					}

					if (shouldMapping) {
						origDoc = Array.isArray(entity)
							? entity.map((d) => cloneDeep(d))
							: cloneDeep(entity);
					} else {
						origDoc = entity;
					}

					const json = await this.transformDocuments(ctx, params, entity);

					if (params.mapping !== true) {
						return json;
					}

					const res: { [key: string]: any } = {};
					if (Array.isArray(json)) {
						json.forEach((doc, i) => {
							// @ts-ignore
							const entityId = this.adapter.encodeID(origDoc[i]);
							res[entityId] = doc;
						});
					} else if (typeof json === 'object') {
						// @ts-ignore
						const entityId = this.adapter.encodeID(origDoc);
						res[entityId] = json;
					}
					return res;
				},

				/**
				 * Updates an entity by its ID.
				 *
				 * This method does the following:
				 * - Calls the `beforeEntityChange` method with the 'update' action and the provided parameters.
				 * - Converts the fields from the parameters to a "$set" update object.
				 * - If the `useDotNotation` setting is true, it flattens the "$set" update object.
				 * - Logs the update operation.
				 * - Calls the `updateById` method of the adapter with the ID and the "$set" update object.
				 * - Transforms the updated document.
				 * - Calls the `entityChanged` method with the 'updated' action and the transformed document.
				 * - If an error occurs during the update operation, it logs the error and throws a MoleculerServerError.
				 *
				 * @methods
				 * @param {Context} ctx - The context for the update operation.
				 * @param {object} params - The parameters for the update operation, which include the ID of the entity to update and the fields to update.
				 *
				 * @returns {Promise<object>} A promise that resolves to the updated entity.
				 *
				 * @throws {Errors.MoleculerServerError} If an error occurs during the update operation, it throws a MoleculerServerError with a
				 * message that includes the error, a status code of 500, and an error code of 'FAILED_TO_UPDATE'.
				 */
				async _update(ctx: Context, params: object): Promise<object> {
					let id: any;
					try {
						const update = await this.beforeEntityChange('update', params, ctx);
						let sets: { [key: string]: any } = {};
						// Convert fields from params to "$set" update object
						for (const prop of Object.keys(update)) {
							// @ts-ignore
							if (prop === 'id' || prop === this.settings.idField) {
								id = this.decodeID(update[prop]);
							} else {
								sets[prop] = update[prop];
							}
						}
						// @ts-ignore
						if (this.settings.useDotNotation) {
							sets = flatten(sets, { safe: true });
						}
						// @ts-ignore
						this.logger.debug(
							`Updating entity by ID '${id}' with ${JSON.stringify(sets)}`,
						);
						// @ts-ignore
						const doc = await this.adapter.updateById(id, sets);
						const transformedDoc = await this.transformDocuments(ctx, params, doc);
						const json = await this.entityChanged('updated', transformedDoc, ctx);
						return json;
					} catch (error) {
						// @ts-ignore
						this.logger.error(`Failed to update: ${error}`);
						throw new Errors.MoleculerServerError(
							`Failed to update ${error}`,
							500,
							'FAILED_TO_UPDATE',
							error,
						);
					}
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
				async _remove(ctx: Context, params: any): Promise<any> {
					// @ts-ignore
					const id = this.adapter.decodeID(params.id);
					const entity = await this.getById(id, true);
					if (!entity) {
						throw new Errors.MoleculerClientError('Entity not found', 400, '', id);
					}
					await this.beforeEntityChange('remove', entity, ctx);
					// @ts-ignore
					const doc = await this.adapter.removeById(id);
					if (doc.deletedCount === 0) {
						throw new Errors.MoleculerClientError('Entity not found', 400, '', id);
					}
					const json = await this.transformDocuments(ctx, params, entity);
					await this.entityChanged('removed', json, ctx);
					return json;
				},
			},
			// #endregion Service Methods
			// #region Service Lifecycle Events
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
						const res = await check(entity);
						if (res !== true) {
							throw new Errors.ValidationError('Entity validation error!', '', res);
						}
					};
				}
			},

			/**
			 * Service started lifecycle event handler
			 */
			async started() {
				if (this.adapter) {
					while (true) {
						try {
							await this.connect();
							break;
						} catch (err) {
							this.logger.error('Connection error!', err);
							this.logger.warn('Reconnecting...');
							await new Promise((resolvePromise) => setTimeout(resolvePromise, 1000));
						}
					}
				} else {
					throw new Error('Please set the store adapter in schema!');
				}
			},

			/**
			 * Service stopped lifecycle event handler
			 */
			async stopped() {
				if (this.adapter) {
					return await this.adapter.disconnect();
				}
			},
			// #endregion Service Lifecycle Events
		},
		mixinOptions,
	);
	return mixin;
};

export {
	AbstractNamingStrategy,
	AbstractSchemaGenerator,
	ArrayCollection,
	ArrayType,
	BaseEntity,
	BigIntType,
	BlobType,
	BooleanType,
	ChangeSet,
	ChangeSetComputer,
	ChangeSetPersister,
	CheckConstraintViolationException,
	Collection,
	Configuration,
	Connection,
	ConnectionException,
	ConstraintViolationException,
	DatabaseDriver,
	DatabaseObjectExistsException,
	DatabaseObjectNotFoundException,
	DateTimeType,
	DateType,
	DeadlockException,
	DecimalType,
	DefaultLogger,
	DoubleType,
	DriverException,
	EntityAssigner,
	EntityCaseNamingStrategy,
	EntityComparator,
	EntityFactory,
	EntityHelper,
	EntityLoader,
	EntityManager,
	EntityMetadata,
	EntityRepository,
	EntitySchema,
	EntitySerializer,
	EntityTransformer,
	EntityValidator,
	EnumArrayType,
	EnumType,
	EventManager,
	ExceptionConverter,
	FileCacheAdapter,
	FloatType,
	ForeignKeyConstraintViolationException,
	Hydrator,
	IdentityMap,
	IntegerType,
	InvalidFieldNameException,
	// JavaScriptMetadataProvider,
	JsonType,
	LockWaitTimeoutException,
	MediumIntType,
	MemoryCacheAdapter,
	MetadataDiscovery,
	MetadataError,
	MetadataProvider,
	MetadataStorage,
	MikroORM,
	MongoNamingStrategy,
	NonUniqueFieldNameException,
	NotFoundError,
	NotNullConstraintViolationException,
	NullCacheAdapter,
	NullHighlighter,
	ObjectHydrator,
	OptimisticLockError,
	PlainObject,
	Platform,
	QueryHelper,
	ReadOnlyException,
	Reference,
	ReflectMetadataProvider,
	RequestContext,
	SerializationContext,
	ServerException,
	SimpleLogger,
	SmallIntType,
	StringType,
	SyntaxErrorException,
	TableExistsException,
	TableNotFoundException,
	TextType,
	TimeType,
	TinyIntType,
	TransactionContext,
	TransactionEventBroadcaster,
	Type,
	Uint8ArrayType,
	UnderscoreNamingStrategy,
	UniqueConstraintViolationException,
	UnitOfWork,
	UnknownType,
	Utils,
	UuidType,
	ValidationError,
	WrappedEntity,
	Cascade,
	ChangeSetType,
	EventType,
	FlushMode,
	GroupOperator,
	IsolationLevel,
	LoadStrategy,
	LockMode,
	NodeState,
	PopulateHint,
	QueryFlag,
	QueryOperator,
	QueryOrder,
	QueryOrderNumeric,
	// ReferenceType,
	AfterCreate,
	AfterDelete,
	AfterUpdate,
	AfterUpsert,
	BeforeCreate,
	BeforeDelete,
	BeforeUpdate,
	BeforeUpsert,
	Check,
	CreateRequestContext,
	Embeddable,
	Embedded,
	Entity,
	Enum,
	Filter,
	Formula,
	Index,
	ManyToMany,
	ManyToOne,
	OnInit,
	OnLoad,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property,
	SerializedPrimaryKey,
	// Subscriber,
	Unique,
	// UseRequestContext,
	assign,
	compareArrays,
	compareBooleans,
	compareBuffers,
	compareObjects,
	defineConfig,
	equals,
	// expr,
	parseJsonSafe,
	ref,
	rel,
	serialize,
	wrap,
	AssignOptions,
	CacheAdapter,
	ConnectionConfig,
	ConnectionOptions,
	CountOptions,
	CreateContextOptions,
	CreateOptions,
	DeleteOptions,
	DriverMethodOptions,
	DynamicPassword,
	Edge,
	EntityProperty,
	EnumOptions,
	EventArgs,
	EventSubscriber,
	FactoryOptions,
	FindOneOptions,
	FindOneOrFailOptions,
	FindOptions,
	FlatQueryOrderMap,
	FlushEventArgs,
	ForkOptions,
	FormulaOptions,
	GenerateOptions,
	GetReferenceOptions,
	Highlighter,
	IConfiguration,
	IDatabaseDriver,
	IEntityGenerator,
	IMigrationGenerator,
	IMigrator,
	ISeedManager,
	IWrappedEntity,
	IndexOptions,
	// InitOptions,
	LoadCountOptions,
	LoadReferenceOptions,
	LoadedCollection,
	LoadedReference,
	LockOptions,
	LogContext,
	Logger,
	LoggerOptions,
	ManyToManyOptions,
	ManyToOneOptions,
	MatchingOptions,
	MergeOptions,
	MigrationDiff,
	MigrationObject,
	MikroORMOptions,
	NamingStrategy,
	NativeDeleteOptions,
	NativeInsertUpdateManyOptions,
	NativeInsertUpdateOptions,
	Node,
	OneToOneOptions,
	PoolConfig,
	PrimaryKeyOptions,
	QueryResult,
	ReferenceOptions,
	// RegisterManagedOptions,
	SerializeOptions,
	SerializedPrimaryKeyOptions,
	Settings,
	SimpleColumnMeta,
	TransactionEventArgs,
	TransactionOptions,
	TransformContext,
	UniqueOptions,
	UpdateOptions,
	UpsertManyOptions,
	UpsertOptions,
	AnyEntity,
	Cast,
	CheckCallback,
	CheckOptions,
	ConnectionType,
	Constructor,
	DeepPartial,
	Dictionary,
	EmbeddableOptions,
	EmbeddedOptions,
	EntityClass,
	EntityClassGroup,
	EntityDTO,
	EntityData,
	EntityDictionary,
	EntityField,
	EntityLoaderOptions,
	EntityName,
	EntityOptions,
	EntitySchemaMetadata,
	EntitySchemaProperty,
	FilterQuery,
	GetRepository,
	IPrimaryKey,
	// IdentifiedReference,
	IsUnknown,
	Loaded,
	LoggerNamespace,
	MigrationsOptions,
	New,
	ObjectQuery,
	OneToManyOptions,
	Options,
	Populate,
	PopulateOptions,
	Primary,
	PrimaryProperty,
	PropertyOptions,
	QBFilterQuery,
	QBQueryOrderMap,
	QueryOrderKeys,
	QueryOrderKeysFlat,
	QueryOrderMap,
	Ref,
	Rel,
	RequiredEntityData,
	SeederOptions,
	Transaction,
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
