/* eslint-disable capitalized-comments */
/* eslint-disable max-len */
/*
 * moleculer-db-mikroorm-adapter
 * Copyright (c) 2023 TyrSolutions (https://github.com/Tyrsolution/moleculer-db-mikroorm-adapter)
 * MIT Licensed
 */
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
	// EntityManager,
	EntityMetadata,
	// EntityRepository,
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
	EntityManagerType,
} from '@mikro-orm/core';
import { AutoPath } from '@mikro-orm/core/typings';
import moleculer, { Context, Service, ServiceBroker, ServiceSchema } from 'moleculer';
import { ObjectId } from '@mikro-orm/mongodb';
import {
	MikroORM as BSMikroORM,
	Options as BSOptions,
	EntityManager as BSEntityManager,
	EntityRepository as BSEntityRepository,
	// defineConfig as defineBSConfig,
} from '@mikro-orm/better-sqlite';
import {
	MikroORM as MongoMikroORM,
	Options as MongoOptions,
	EntityManager as MongoEntityManager,
	EntityRepository as MongoEntityRepository,
	// defineConfig as defineMongoConfig,
} from '@mikro-orm/mongodb';
import {
	MikroORM as MYSQLMikroORM,
	Options as MYSQLOptions,
	EntityManager as MYSQLEntityManager,
	EntityRepository as MYSQLEntityRepository,
	// defineConfig as defineMYSQLConfig,
} from '@mikro-orm/mysql';
import {
	MikroORM as MariaMicroORM,
	Options as MariaOptions,
	EntityManager as MariaEntityManager,
	EntityRepository as MariaEntityRepository,
	// defineConfig as defineMariaConfig,
} from '@mikro-orm/mariadb';
import {
	MikroORM as PostMikroORM,
	Options as PostOptions,
	EntityManager as PostEntityManager,
	EntityRepository as PostEntityRepository,
	// defineConfig as definePostConfig,
} from '@mikro-orm/postgresql';
import {
	MikroORM as SqliteMiroOrm,
	Options as SqliteOptions,
	EntityManager as SqliteEntityManager,
	EntityRepository as SqliteEntityRepository,
	// defineConfig as defineSqliteConfig,
} from '@mikro-orm/sqlite';
import { ConnectionManager } from './connectionManager';
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
export interface Services<
	T extends MikroORMConnection,
	U extends EntityManager,
	V extends EntityRepository<any>,
> {
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
export function defineBSConfig(options: OptionsBS): OptionsBS;
export function defineMongoConfig(options: OptionsMongo): OptionsMongo;
export function defineMYSQLConfig(options: OptionsMYSQL): OptionsMYSQL;
export function defineMariaConfig(options: OptionsMaria): OptionsMaria;
export function definePostConfig(options: OptionsPost): OptionsPost;
export function defineSqliteConfig(options: OptionsSqlite): OptionsSqlite;
export function initORM(
	config: MikroORMConnectionOptions,
	ormMapObject?: object,
	// options?: MikroORMConnectionOptions,
): Promise<Services<MikroORMConnection, EntityManager, EntityRepository<any>> | undefined>;
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
	// EntityManager,
	EntityMetadata,
	// EntityRepository,
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
};
export function MikroORMServiceSchemaMixin(mixinOptions?: any): ServiceSchema;

export interface ListParams {
	/**
	 * Moleculer-db paramaters
	 */
	populate?: string | string[];
	fields?: string | string[];
	excludeFields?: string | string[];
	page?: number;
	pageSize?: number;
	sort?: string;
	search?: string;
	searchFields?: string | string[];
	query?: object | string;
	limit?: string | number | null;
	offset?: string | number | null;
	/**
	 * Mikro-ORM paramaters
	 * If paramaters are missing it's because they are deprecated so we don't need them
	 * or there have been additoins to the typeorm library that are not yet implemented.
	 */
	/**
	 * Offset (paginated) where from entities should be taken.
	 */
	skip?: number;
	/**
	 * Limit (paginated) - max number of entities should be taken.
	 */
	take?: number;
	/**
	 * Adds a comment with the supplied string in the generated query.  This is
	 * helpful for debugging purposes, such as finding a specific query in the
	 * database server's logs, or for categorization using an APM product.
	 */
	comment?: string;
	/**
	 * Specifies what columns should be retrieved.
	 */
	select?: any;

	/**
	 * Simple condition that should be applied to match entities.
	 */
	where?: any[] | any;

	/**
	 * Indicates what relations of entity should be loaded (simplified left join form).
	 */
	relations?: any;
	/**
	 * Specifies how relations must be loaded - using "joins" or separate queries.
	 * If you are loading too much data with nested joins it's better to load relations
	 * using separate queries.
	 *
	 * Default strategy is "join", but default can be customized in connection options.
	 */
	relationLoadStrategy?: 'join' | 'query';
	/**
	 * Order, in which entities should be ordered.
	 */
	order?: any;
	/**
	 * Enables or disables query result caching.
	 */
	cache?: boolean | number | { id: any; milliseconds: number };
	/**
	 * Indicates what locking mode should be used.
	 *
	 * Note: For lock tables, you must specify the table names and not the relation names
	 */
	lock?:
		| { mode: 'optimistic'; version: number | Date }
		| {
				mode:
					| 'pessimistic_read'
					| 'pessimistic_write'
					| 'dirty_read'
					/**
					 * "pessimistic_partial_write" and "pessimistic_write_or_fail" are deprecated and
					 * will be removed in a future version. Use onLocked instead.
					 */
					| 'pessimistic_partial_write'
					| 'pessimistic_write_or_fail'
					| 'for_no_key_update'
					| 'for_key_share';
				tables?: string[];
				onLocked?: 'nowait' | 'skip_locked';
		  };

	/**
	 * Indicates if soft-deleted rows should be included in entity result.
	 */
	withDeleted?: boolean;
	/**
	 * If sets to true then loads all relation ids of the entity and maps them into relation values (not relation objects).
	 * If array of strings is given then loads only relation ids of the given properties.
	 */
	loadRelationIds?: boolean | { relations?: string[]; disableMixedMap?: boolean };
	/**
	 * Indicates if eager relations should be loaded or not.
	 * By default, they are loaded when find methods are used.
	 */
	loadEagerRelations?: boolean;
	/**
	 * If this is set to true, SELECT query in a `find` method will be executed in a transaction.
	 */
	transaction?: boolean;
}
export interface DbAdapter<
	MKRMEntity extends AnyEntity,
	D extends IDatabaseDriver = IDatabaseDriver,
> {
	// #region DbAdapter properties
	[key: string]: any;
	/**
	 * Grants access to the entity repository of the connection.
	 * Called using this.adapter.repository
	 * @static
	 * @property {Repository<Entity>} repository - Mikro-ORM repository
	 *
	 * @properties
	 */
	repository: EntityRepository<MKRMEntity> | undefined;
	/**
	 * MGrants access to the entity manager of the connection.
	 * Called using this.adapter.manager
	 * @static
	 * @property {EntityManager} manager - Mikro-ORM entity manager
	 *
	 * @properties
	 */
	manager: D[typeof EntityManagerType] & EntityManager;
	/**
	 * Grants access to the connection manager instance which is used to create and manage connections.
	 * Called using this.adapter.connectionManager
	 *
	 * @static
	 * @property {ConnectionManager} connectionManager - Adapter connection manager. Use `this.adapter.connectionManager` to access.
	 *
	 * @properties
	 */
	connectionManager: ConnectionManager | undefined;
	/**
	 * Represents the MikroORM connection.
	 *
	 * The MikroORM connection is used to interact with the database. It can be undefined if the MikroORM adapter is not connected to a database.
	 *
	 * @type {MikroORMConnection | undefined}
	 */
	orm: MikroORM<D>;
	/**
	 * Represents the logger instance used by the service.
	 *
	 * The logger instance is used to log information, warnings, errors, etc. during the execution of the service. It can be undefined if the
	 * service does not have a logger instance.
	 *
	 * @type {moleculer.LoggerInstance | undefined}
	 */
	logger: moleculer.LoggerInstance | undefined;
	// #endregion DbAdapter properties
	// #region MicroORM orm methods
	/**
	 * MicroORM orm methods
	 */
	/**
	 * Reconnects, possibly to a different database.
	 */
	reconnect(options?: Options): Promise<void>;
	/**
	 * Checks whether the database connection is active.
	 */
	isConnected(): Promise<boolean>;
	/**
	 * Closes the database connection.
	 */
	close(force?: boolean): Promise<void>;
	/**
	 * Gets the `MetadataStorage`.
	 */
	getMetadata(): MetadataStorage;
	/**
	 * Gets the `EntityMetadata` instance when provided with the `entityName` parameter.
	 */
	getMetadata(entityName: EntityName<MKRMEntity>): EntityMetadata<MKRMEntity>;
	discoverEntities(): Promise<void>;
	/**
	 * Allows dynamically discovering new entity by reference, handy for testing schema diffing.
	 */
	discoverEntity(entities: Constructor | Constructor[]): Promise<void>;
	/**
	 * Gets the SchemaGenerator.
	 */
	getSchemaGenerator(): ReturnType<ReturnType<D['getPlatform']>['getSchemaGenerator']>;
	/**
	 * Gets the EntityGenerator.
	 */
	getEntityGenerator<T extends IEntityGenerator = IEntityGenerator>(): T;
	/**
	 * Gets the Migrator.
	 */
	getMigrator<T extends IMigrator = IMigrator>(): T;
	/**
	 * Gets the SeedManager
	 */
	getSeeder<T extends ISeedManager = ISeedManager>(): T;
	/**
	 * Shortcut for `orm.getSchemaGenerator()`
	 */
	get schema(): ReturnType<ReturnType<D['getPlatform']>['getSchemaGenerator']>;
	/**
	 * Shortcut for `orm.getSeeder()`
	 */
	get seeder(): ISeedManager;
	/**
	 * Shortcut for `orm.getMigrator()`
	 */
	get migrator(): IMigrator;
	/**
	 * Shortcut for `orm.getEntityGenerator()`
	 */
	get entityGenerator(): IEntityGenerator;
	// #endregion MicroORM orm methods
	// #region MikroORM entityrepostory methods
	/**
	 * MikroORM entityrepostory methods
	 */
	/**
	 * Tells the EntityManager to make an instance managed and persistent.
	 * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	// _persist(entity: AnyEntity | AnyEntity[]): EntityManager;
	/**
	 * Persists your entity immediately, flushing all not yet persisted changes to the database too.
	 * Equivalent to `em.persist(e).flush()`.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	// _persistAndFlush(entity: AnyEntity | AnyEntity[]): Promise<void>;
	/**
	 * Tells the EntityManager to make an instance managed and persistent.
	 * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
	 *
	 * @deprecated use `persist()`
	 */
	// _persistLater(entity: AnyEntity | AnyEntity[]): void;
	/**
	 * Finds first entity matching your `where` query.
	 */
	_findOne<P extends string = never>(
		where: FilterQuery<MKRMEntity>,
		options?: FindOneOptions<MKRMEntity, P>,
	): Promise<Loaded<MKRMEntity, P> | null>;
	/**
	 * Finds first entity matching your `where` query. If nothing found, it will throw an error.
	 * You can override the factory for creating this method via `options.failHandler` locally
	 * or via `Configuration.findOneOrFailHandler` globally.
	 */
	_findOneOrFail<P extends string = never>(
		where: FilterQuery<MKRMEntity>,
		options?: FindOneOrFailOptions<MKRMEntity, P>,
	): Promise<Loaded<MKRMEntity, P>>;
	/**
	 * Creates or updates the entity, based on whether it is already present in the database.
	 * This method performs an `insert on conflict merge` query ensuring the database is in sync, returning a managed
	 * entity instance. The method accepts either `entityName` together with the entity `data`, or just entity instance.
	 *
	 * ```ts
	 * // insert into "author" ("age", "email") values (33, 'foo@bar.com') on conflict ("email") do update set "age" = 41
	 * const author = await em.getRepository(Author).upsert({ email: 'foo@bar.com', age: 33 });
	 * ```
	 *
	 * The entity data needs to contain either the primary key, or any other unique property. Let's consider the following example, where `Author.email` is a unique property:
	 *
	 * ```ts
	 * // insert into "author" ("age", "email") values (33, 'foo@bar.com') on conflict ("email") do update set "age" = 41
	 * // select "id" from "author" where "email" = 'foo@bar.com'
	 * const author = await em.getRepository(Author).upsert({ email: 'foo@bar.com', age: 33 });
	 * ```
	 *
	 * Depending on the driver support, this will either use a returning query, or a separate select query, to fetch the primary key if it's missing from the `data`.
	 *
	 * If the entity is already present in current context, there won't be any queries - instead, the entity data will be assigned and an explicit `flush` will be required for those changes to be persisted.
	 */
	_upsert(
		entityOrData?: EntityData<MKRMEntity> | MKRMEntity,
		options?: NativeInsertUpdateOptions<MKRMEntity>,
	): Promise<MKRMEntity>;
	/**
	 * Creates or updates the entity, based on whether it is already present in the database.
	 * This method performs an `insert on conflict merge` query ensuring the database is in sync, returning a managed
	 * entity instance.
	 *
	 * ```ts
	 * // insert into "author" ("age", "email") values (33, 'foo@bar.com') on conflict ("email") do update set "age" = 41
	 * const authors = await em.getRepository(Author).upsertMany([{ email: 'foo@bar.com', age: 33 }, ...]);
	 * ```
	 *
	 * The entity data needs to contain either the primary key, or any other unique property. Let's consider the following example, where `Author.email` is a unique property:
	 *
	 * ```ts
	 * // insert into "author" ("age", "email") values (33, 'foo@bar.com'), (666, 'lol@lol.lol') on conflict ("email") do update set "age" = excluded."age"
	 * // select "id" from "author" where "email" = 'foo@bar.com'
	 * const author = await em.getRepository(Author).upsertMany([
	 *   { email: 'foo@bar.com', age: 33 },
	 *   { email: 'lol@lol.lol', age: 666 },
	 * ]);
	 * ```
	 *
	 * Depending on the driver support, this will either use a returning query, or a separate select query, to fetch the primary key if it's missing from the `data`.
	 *
	 * If the entity is already present in current context, there won't be any queries - instead, the entity data will be assigned and an explicit `flush` will be required for those changes to be persisted.
	 */
	_upsertMany(
		entitiesOrData?: EntityData<MKRMEntity>[] | MKRMEntity[],
		options?: NativeInsertUpdateOptions<MKRMEntity>,
	): Promise<MKRMEntity[]>;
	/**
	 * Finds all entities matching your `where` query. You can pass additional options via the `options` parameter.
	 */
	_find<P extends string = never>(
		where: FilterQuery<MKRMEntity>,
		options?: FindOptions<MKRMEntity, P>,
	): Promise<Loaded<MKRMEntity, P>[]>;
	/**
	 * Calls `em.find()` and `em.count()` with the same arguments (where applicable) and returns the results as tuple
	 * where first element is the array of entities and the second is the count.
	 */
	_findAndCount<P extends string = never>(
		where: FilterQuery<MKRMEntity>,
		options?: FindOptions<MKRMEntity, P>,
	): Promise<[Loaded<MKRMEntity, P>[], number]>;
	/**
	 * Finds all entities of given type. You can pass additional options via the `options` parameter.
	 */
	_findAll<P extends string = never>(
		options?: FindOptions<MKRMEntity, P>,
	): Promise<Loaded<MKRMEntity, P>[]>;
	/**
	 * Marks entity for removal.
	 * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
	 *
	 * To remove entities by condition, use `em.nativeDelete()`.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	// _remove(entity: AnyEntity): EntityManager;
	/**
	 * Removes an entity instance immediately, flushing all not yet persisted changes to the database too.
	 * Equivalent to `em.remove(e).flush()`
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	// _removeAndFlush(entity: AnyEntity): Promise<void>;
	/**
	 * Marks entity for removal.
	 * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
	 *
	 * @deprecated use `remove()`
	 */
	// _removeLater(entity: AnyEntity): void;
	/**
	 * Flushes all changes to objects that have been queued up to now to the database.
	 * This effectively synchronizes the in-memory state of managed objects with the database.
	 * This method is a shortcut for `em.flush()`, in other words, it will flush the whole UoW,
	 * not just entities registered via this particular repository.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	// _flush(): Promise<void>;
	/**
	 * Fires native insert query. Calling this has no side effects on the context (identity map).
	 */
	_nativeInsert(
		data: MKRMEntity | EntityData<MKRMEntity>,
		options?: NativeInsertUpdateOptions<MKRMEntity>,
	): Promise<Primary<MKRMEntity>>;
	/**
	 * Fires native update query. Calling this has no side effects on the context (identity map).
	 */
	_nativeUpdate(
		where: FilterQuery<MKRMEntity>,
		data: EntityData<MKRMEntity>,
		options?: UpdateOptions<MKRMEntity>,
	): Promise<number>;
	/**
	 * Fires native delete query. Calling this has no side effects on the context (identity map).
	 */
	_nativeDelete(
		where: FilterQuery<MKRMEntity>,
		options?: DeleteOptions<MKRMEntity>,
	): Promise<number>;
	/**
	 * Maps raw database result to an entity and merges it to this EntityManager.
	 */
	_map(
		result: EntityDictionary<MKRMEntity>,
		options?: {
			schema?: string;
		},
	): MKRMEntity;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	_getReference<PK extends keyof MKRMEntity>(
		id: Primary<MKRMEntity>,
		options: Omit<GetReferenceOptions, 'wrapped'> & {
			wrapped: true;
		},
	): Ref<PK>;
	// ): Ref<MKRMEntity, PK>;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	_getReference(id: Primary<MKRMEntity> | Primary<MKRMEntity>[]): MKRMEntity;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	_getReference(
		id: Primary<MKRMEntity>,
		options: Omit<GetReferenceOptions, 'wrapped'> & {
			wrapped: false;
		},
	): MKRMEntity;
	/**
	 * Checks whether given property can be populated on the entity.
	 */
	_canPopulate(property: string): boolean;
	/**
	 * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
	 */
	_populate<P extends string = never>(
		entities: MKRMEntity | MKRMEntity[],
		populate: AutoPath<MKRMEntity, P>[] | boolean,
		options?: EntityLoaderOptions<MKRMEntity, P>,
	): Promise<Loaded<MKRMEntity, P>[]>;
	/**
	 * Creates new instance of given entity and populates it with given data.
	 * The entity constructor will be used unless you provide `{ managed: true }` in the options parameter.
	 * The constructor will be given parameters based on the defined constructor of the entity. If the constructor
	 * parameter matches a property name, its value will be extracted from `data`. If no matching property exists,
	 * the whole `data` parameter will be passed. This means we can also define `constructor(data: Partial<T>)` and
	 * `em.create()` will pass the data into it (unless we have a property named `data` too).
	 */
	_create<P extends MKRMEntity>(data: RequiredEntityData<P>, options?: CreateOptions): Promise<P>;
	/**
	 * Shortcut for `wrap(entity).assign(data, { em })`
	 */
	_assign(entity: MKRMEntity, data: EntityData<MKRMEntity>, options?: AssignOptions): MKRMEntity;
	/**
	 * Merges given entity to this EntityManager so it becomes managed. You can force refreshing of existing entities
	 * via second parameter. By default it will return already loaded entities without modifying them.
	 */
	_merge(data: MKRMEntity | EntityData<MKRMEntity>, options?: MergeOptions): MKRMEntity;
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
	_count<P extends string = never>(
		where?: FilterQuery<MKRMEntity>,
		options?: CountOptions<MKRMEntity, P>,
	): Promise<number>;
	/**
	 * @deprecated this method will be removed in v6, use the public `getEntityManager()` method instead
	 */
	// get em(): EntityManager;
	/**
	 * Returns the underlying EntityManager instance
	 */
	getEntityManager(): EntityManager;
	/**
	 * Returns the underlying EntityManager instance
	 */
	_getEntityManager(): EntityManager;
	_validateRepositoryType(entities: MKRMEntity[] | MKRMEntity, method: string): void;
	// #endregion MikroORM entityrepostory methods
	// #region Moleculer-db methods
	/** Moleculer-db methods */
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
	entityToObject(entity: any): object;
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
	beforeSaveTransformID(entity: Record<string, any>, idField: string): object;
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
	beforeSaveTransformID(entity: any, idField: string): any;
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
	afterRetrieveTransformID(entity: Record<string, any>, idField: string): object;
	/**
	 * ransforms the ID field of an entity after retrieving it from the database.
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
	afterRetrieveTransformID(entity: any, idField: string): any;
	/** Additional custom methods */
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
	beforeQueryTransformID(idField: any): any;
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
	count<T extends MKRMEntity, P extends string>(
		where?: FilterQuery<T>,
		options?: CountOptions<T, P>,
	): Promise<number>;
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
	create<T extends MKRMEntity>(
		entityOrEntities: RequiredEntityData<T> | RequiredEntityData<T>[],
		options?: CreateOptions,
	): Promise<T | T[]>;
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
	insert<T extends MKRMEntity>(
		entityOrEntities: RequiredEntityData<T> | RequiredEntityData<T>[],
		options?: CreateOptions,
	): Promise<T | T[]>;
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
	updateById<T extends MKRMEntity>(
		id: any,
		update: EntityData<T>,
		options?: UpdateOptions<T>,
	): Promise<any>;
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
	removeById<T extends MKRMEntity>(id: any, options?: DeleteOptions<T>): Promise<number>;
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
	removeMany<T extends MKRMEntity>(id: any[], options?: DeleteOptions<T>): Promise<number>;
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
	find<T extends MKRMEntity, P extends string>(
		where: FilterQuery<T>,
		options?: FindOptions<T, P>,
	): Promise<Loaded<T, P> | Loaded<T, P>[]>;
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
	 * @param {FilterQuery<T>} where - The filter query to match the entity against.
	 * @param {FindOneOptions<T, P>} [options] - Optional settings for the find operation.
	 *
	 * @returns {Promise<null | Loaded<T, P>>} A promise that resolves with the entity that matches the filter query,
	 * or null if no entity matches the filter query.
	 *
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message, a 500 status code,
	 * the error code 'FAILED_TO_FIND_ONE', and the error details.
	 */
	findOne<T extends MKRMEntity, P extends string>(
		where: FilterQuery<T>,
		options?: FindOneOptions<T, P>,
	): Promise<null | Loaded<T, P>>;

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
	 *
	 */
	findById<T extends MKRMEntity>(
		id: string | number | string[] | number[],
	): Promise<T | undefined>;
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
	getPopulations(ctx: Context, params?: any): Promise<object | object[]>;

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
	list(ctx: any, params: ListParams): Promise<object>;

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
	encodeID(id: any): any;

	/**
	 * Decodes the provided ID.
	 *
	 * This method currently returns the provided ID as it is. It can be overridden in subclasses to provide custom decoding logic.
	 *
	 * @methods
	 * @param {any} id - The ID to decode.
	 *
	 * @returns {any} The decoded ID.
	 */
	decodeID(id: any): any;

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
	toMongoObjectId(id: any): ObjectId;

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
	fromMongoObjectId(id: any): string;

	/**
	 * ransforms documents after retrieving them from the database.
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
	transformDocuments(ctx: Context, params: any, docs: any): Promise<any[] | object>;

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
	beforeEntityChange(type: string | undefined, entity: object, ctx: Context): Promise<any>;

	/**
	 * CExecutes a hook after an entity change operation and clears the cache.
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
	entityChanged(
		type: string | undefined,
		json: object | object[] | number,
		ctx: Context,
	): Promise<any>;
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
	clearCache(): Promise<any>;
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
	filterFields(doc: object, fields: any[]): object;
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
	excludeFields(doc: object, fields: string | string[]): object;

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
	_excludeFields(doc: object, fields: any[]): object;

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
	populateDocs(ctx: Context, docs: any[] | object, populateFields?: string[]): Promise<any>;
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
	validateEntity(entity: object | object[]): Promise<object | object[]>;
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
	authorizeFields(askedFields: string[]): string[];
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
	sanitizeParams(ctx: Context, params: object): object;
	// #endregion Moleculer-db methods
}

export default class MikroORMDbAdapter<
	MKRMEntity extends AnyEntity,
	D extends IDatabaseDriver = IDatabaseDriver,
> implements DbAdapter<MKRMEntity>
{
	// #region MikroORMDbAdapter properties
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
	public manager: D[typeof EntityManagerType] & EntityManager;
	/**
	 * Grants access to the entity repository of the connection.
	 * Called using this.adapter.repository
	 * @static
	 * @property {Repository<MKRMEntity>} repository
	 *
	 * @properties
	 */
	public repository: EntityRepository<MKRMEntity> | undefined;
	/**
	 * Represents the MikroORM connection.
	 *
	 * The MikroORM connection is used to interact with the database. It can be undefined if the MikroORM adapter is not connected to a database.
	 *
	 * @type {MikroORMConnection | undefined}
	 */
	public orm: MikroORM<D>;
	/**
	 * Represents the logger instance used by the service.
	 *
	 * The logger instance is used to log information, warnings, errors, etc. during the execution of the service. It can be undefined if the
	 * service does not have a logger instance.
	 *
	 * @type {moleculer.LoggerInstance | undefined}
	 */
	public logger: moleculer.LoggerInstance | undefined;
	private _entity;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	private MikroORM;
	/**
	 * Creates an instance of Mikro-ORM db service.
	 *
	 * @param {MikroORMOptions} opts
	 *
	 */
	public constructor(options: any);
	// #region Micro-ORM orm methods
	/**
	 * @deprecated this method will be removed in v6, use the public `getEntityManager()` method instead
	 */
	// public get em(): EntityManager;
	/**
	 * Shortcut for `orm.getSchemaGenerator()`
	 */
	public get schema(): ReturnType<ReturnType<D['getPlatform']>['getSchemaGenerator']>;
	/**
	 * Shortcut for `orm.getSeeder()`
	 */
	public get seeder(): ISeedManager;
	/**
	 * Shortcut for `orm.getMigrator()`
	 */
	public get migrator(): IMigrator;
	/**
	 * Shortcut for `orm.getEntityGenerator()`
	 */
	public get entityGenerator(): IEntityGenerator;
	// #endregion Micro-ORM orm methods
	/**
	 * Initialize adapter
	 * It will be called in `broker.start()` and is used internally
	 *
	 * @methods
	 * @param {ServiceBroker} broker
	 * @param {Service} service
	 *
	 * @memberof MikroORMDbAdapter
	 */
	public init(broker: ServiceBroker, service: Service): void;
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
	 *
	 */
	public connect(): Promise<void>;
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
	public disconnect(): Promise<void>;
	// #endregion MikroORMDbAdapter properties
	// #region MicroORM orm methods
	/**
	 * MicroORM orm methods
	 */
	/**
	 * Reconnects, possibly to a different database.
	 */
	public reconnect(options?: Options): Promise<void>;
	/**
	 * Checks whether the database connection is active.
	 */
	public isConnected(): Promise<boolean>;
	/**
	 * Closes the database connection.
	 */
	public close(force?: boolean): Promise<void>;
	/**
	 * Gets the `MetadataStorage`.
	 */
	public getMetadata(): MetadataStorage;
	/**
	 * Gets the `EntityMetadata` instance when provided with the `entityName` parameter.
	 */
	public getMetadata(entityName: EntityName<MKRMEntity>): EntityMetadata<MKRMEntity>;
	public discoverEntities(): Promise<void>;
	/**
	 * Allows dynamically discovering new entity by reference, handy for testing schema diffing.
	 */
	public discoverEntity(entities: Constructor | Constructor[]): Promise<void>;
	/**
	 * Gets the SchemaGenerator.
	 */
	public getSchemaGenerator(): ReturnType<ReturnType<D['getPlatform']>['getSchemaGenerator']>;
	/**
	 * Gets the EntityGenerator.
	 */
	public getEntityGenerator<T extends IEntityGenerator = IEntityGenerator>(): T;
	/**
	 * Gets the Migrator.
	 */
	public getMigrator<T extends IMigrator = IMigrator>(): T;
	/**
	 * Gets the SeedManager
	 */
	public getSeeder<T extends ISeedManager = ISeedManager>(): T;
	// #endregion MicroORM orm methods
	// #region MikroORM entityrepostory methods
	/**
	 * MikroORM entityrepostory methods
	 */
	/**
	 * Tells the EntityManager to make an instance managed and persistent.
	 * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	// public _persist(entity: AnyEntity | AnyEntity[]): EntityManager;
	/**
	 * Persists your entity immediately, flushing all not yet persisted changes to the database too.
	 * Equivalent to `em.persist(e).flush()`.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	// public _persistAndFlush(entity: AnyEntity | AnyEntity[]): Promise<void>;
	/**
	 * Tells the EntityManager to make an instance managed and persistent.
	 * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
	 *
	 * @deprecated use `persist()`
	 */
	// public _persistLater(entity: AnyEntity | AnyEntity[]): void;
	/**
	 * Finds first entity matching your `where` query.
	 */
	public _findOne<P extends string = never>(
		where: FilterQuery<MKRMEntity>,
		options?: FindOneOptions<MKRMEntity, P>,
	): Promise<Loaded<MKRMEntity, P> | null>;
	/**
	 * Finds first entity matching your `where` query. If nothing found, it will throw an error.
	 * You can override the factory for creating this method via `options.failHandler` locally
	 * or via `Configuration.findOneOrFailHandler` globally.
	 */
	public _findOneOrFail<P extends string = never>(
		where: FilterQuery<MKRMEntity>,
		options?: FindOneOrFailOptions<MKRMEntity, P>,
	): Promise<Loaded<MKRMEntity, P>>;
	/**
	 * Creates or updates the entity, based on whether it is already present in the database.
	 * This method performs an `insert on conflict merge` query ensuring the database is in sync, returning a managed
	 * entity instance. The method accepts either `entityName` together with the entity `data`, or just entity instance.
	 *
	 * ```ts
	 * // insert into "author" ("age", "email") values (33, 'foo@bar.com') on conflict ("email") do update set "age" = 41
	 * const author = await em.getRepository(Author).upsert({ email: 'foo@bar.com', age: 33 });
	 * ```
	 *
	 * The entity data needs to contain either the primary key, or any other unique property. Let's consider the following example, where `Author.email` is a unique property:
	 *
	 * ```ts
	 * // insert into "author" ("age", "email") values (33, 'foo@bar.com') on conflict ("email") do update set "age" = 41
	 * // select "id" from "author" where "email" = 'foo@bar.com'
	 * const author = await em.getRepository(Author).upsert({ email: 'foo@bar.com', age: 33 });
	 * ```
	 *
	 * Depending on the driver support, this will either use a returning query, or a separate select query, to fetch the primary key if it's missing from the `data`.
	 *
	 * If the entity is already present in current context, there won't be any queries - instead, the entity data will be assigned and an explicit `flush` will be required for those changes to be persisted.
	 */
	public _upsert(
		entityOrData?: EntityData<MKRMEntity> | MKRMEntity,
		options?: NativeInsertUpdateOptions<MKRMEntity>,
	): Promise<MKRMEntity>;
	/**
	 * Creates or updates the entity, based on whether it is already present in the database.
	 * This method performs an `insert on conflict merge` query ensuring the database is in sync, returning a managed
	 * entity instance.
	 *
	 * ```ts
	 * // insert into "author" ("age", "email") values (33, 'foo@bar.com') on conflict ("email") do update set "age" = 41
	 * const authors = await em.getRepository(Author).upsertMany([{ email: 'foo@bar.com', age: 33 }, ...]);
	 * ```
	 *
	 * The entity data needs to contain either the primary key, or any other unique property. Let's consider the following example, where `Author.email` is a unique property:
	 *
	 * ```ts
	 * // insert into "author" ("age", "email") values (33, 'foo@bar.com'), (666, 'lol@lol.lol') on conflict ("email") do update set "age" = excluded."age"
	 * // select "id" from "author" where "email" = 'foo@bar.com'
	 * const author = await em.getRepository(Author).upsertMany([
	 *   { email: 'foo@bar.com', age: 33 },
	 *   { email: 'lol@lol.lol', age: 666 },
	 * ]);
	 * ```
	 *
	 * Depending on the driver support, this will either use a returning query, or a separate select query, to fetch the primary key if it's missing from the `data`.
	 *
	 * If the entity is already present in current context, there won't be any queries - instead, the entity data will be assigned and an explicit `flush` will be required for those changes to be persisted.
	 */
	public _upsertMany(
		entitiesOrData?: EntityData<MKRMEntity>[] | MKRMEntity[],
		options?: NativeInsertUpdateOptions<MKRMEntity>,
	): Promise<MKRMEntity[]>;
	/**
	 * Finds all entities matching your `where` query. You can pass additional options via the `options` parameter.
	 */
	public _find<P extends string = never>(
		where: FilterQuery<MKRMEntity>,
		options?: FindOptions<MKRMEntity, P>,
	): Promise<Loaded<MKRMEntity, P>[]>;
	/**
	 * Calls `em.find()` and `em.count()` with the same arguments (where applicable) and returns the results as tuple
	 * where first element is the array of entities and the second is the count.
	 */
	public _findAndCount<P extends string = never>(
		where: FilterQuery<MKRMEntity>,
		options?: FindOptions<MKRMEntity, P>,
	): Promise<[Loaded<MKRMEntity, P>[], number]>;
	/**
	 * Finds all entities of given type. You can pass additional options via the `options` parameter.
	 */
	public _findAll<P extends string = never>(
		options?: FindOptions<MKRMEntity, P>,
	): Promise<Loaded<MKRMEntity, P>[]>;
	/**
	 * Marks entity for removal.
	 * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
	 *
	 * To remove entities by condition, use `em.nativeDelete()`.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	// public _remove(entity: AnyEntity): EntityManager;
	/**
	 * Removes an entity instance immediately, flushing all not yet persisted changes to the database too.
	 * Equivalent to `em.remove(e).flush()`
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	// public _removeAndFlush(entity: AnyEntity): Promise<void>;
	/**
	 * Marks entity for removal.
	 * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
	 *
	 * @deprecated use `remove()`
	 */
	// public _removeLater(entity: AnyEntity): void;
	/**
	 * Flushes all changes to objects that have been queued up to now to the database.
	 * This effectively synchronizes the in-memory state of managed objects with the database.
	 * This method is a shortcut for `em.flush()`, in other words, it will flush the whole UoW,
	 * not just entities registered via this particular repository.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	// public _flush(): Promise<void>;
	/**
	 * Fires native insert query. Calling this has no side effects on the context (identity map).
	 */
	public _nativeInsert(
		data: MKRMEntity | EntityData<MKRMEntity>,
		options?: NativeInsertUpdateOptions<MKRMEntity>,
	): Promise<Primary<MKRMEntity>>;
	/**
	 * Fires native update query. Calling this has no side effects on the context (identity map).
	 */
	public _nativeUpdate(
		where: FilterQuery<MKRMEntity>,
		data: EntityData<MKRMEntity>,
		options?: UpdateOptions<MKRMEntity>,
	): Promise<number>;
	/**
	 * Fires native delete query. Calling this has no side effects on the context (identity map).
	 */
	public _nativeDelete(
		where: FilterQuery<MKRMEntity>,
		options?: DeleteOptions<MKRMEntity>,
	): Promise<number>;
	/**
	 * Maps raw database result to an entity and merges it to this EntityManager.
	 */
	public _map(
		result: EntityDictionary<MKRMEntity>,
		options?: {
			schema?: string;
		},
	): MKRMEntity;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	public _getReference<PK extends keyof MKRMEntity>(
		id: Primary<MKRMEntity>,
		options: Omit<GetReferenceOptions, 'wrapped'> & {
			wrapped: true;
		},
	): Ref<PK>;
	// ): Ref<MKRMEntity, PK>;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	public _getReference(id: Primary<MKRMEntity> | Primary<MKRMEntity>[]): MKRMEntity;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	public _getReference(
		id: Primary<MKRMEntity>,
		options: Omit<GetReferenceOptions, 'wrapped'> & {
			wrapped: false;
		},
	): MKRMEntity;
	/**
	 * Checks whether given property can be populated on the entity.
	 */
	public _canPopulate(property: string): boolean;
	/**
	 * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
	 */
	public _populate<P extends string = never>(
		entities: MKRMEntity | MKRMEntity[],
		populate: AutoPath<MKRMEntity, P>[] | boolean,
		options?: EntityLoaderOptions<MKRMEntity, P>,
	): Promise<Loaded<MKRMEntity, P>[]>;
	/**
	 * Creates new instance of given entity and populates it with given data.
	 * The entity constructor will be used unless you provide `{ managed: true }` in the options parameter.
	 * The constructor will be given parameters based on the defined constructor of the entity. If the constructor
	 * parameter matches a property name, its value will be extracted from `data`. If no matching property exists,
	 * the whole `data` parameter will be passed. This means we can also define `constructor(data: Partial<T>)` and
	 * `em.create()` will pass the data into it (unless we have a property named `data` too).
	 */
	public _create<P extends MKRMEntity>(
		data: RequiredEntityData<P>,
		options?: CreateOptions,
	): Promise<P>;
	/**
	 * Shortcut for `wrap(entity).assign(data, { em })`
	 */
	public _assign(
		entity: MKRMEntity,
		data: EntityData<MKRMEntity>,
		options?: AssignOptions,
	): MKRMEntity;
	/**
	 * Merges given entity to this EntityManager so it becomes managed. You can force refreshing of existing entities
	 * via second parameter. By default it will return already loaded entities without modifying them.
	 */
	public _merge(data: MKRMEntity | EntityData<MKRMEntity>, options?: MergeOptions): MKRMEntity;
	/**
	 * Returns total number of entities matching your `where` query.
	 */
	public _count<P extends string = never>(
		where?: FilterQuery<MKRMEntity>,
		options?: CountOptions<MKRMEntity, P>,
	): Promise<number>;
	/**
	 * Returns the underlying EntityManager instance
	 */
	public getEntityManager(): EntityManager;
	/**
	 * Returns the underlying EntityManager instance
	 */
	public _getEntityManager(): EntityManager;
	public _validateRepositoryType(entities: MKRMEntity[] | MKRMEntity, method: string): void;
	// #endregion MikroORM entityrepostory methods
	// #region Moleculer-db methods
	/** Moleculer-db methods */
	/**
	 * Converts an entity to a JavaScript object.
	 *
	 * This method currently returns the entity as is. It can be overridden in subclasses to provide custom entity to object conversion.
	 *
	 * @methods
	 * @param {any} entity - The entity to convert.
	 * @returns {object} The converted object.
	 * @memberof MikroORMDbAdapter
	 *
	 */
	public entityToObject(entity: any): object;
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
	 *
	 */
	public beforeSaveTransformID(entity: Record<string, any>, idField: string): object;
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
	public beforeSaveTransformID(entity: any, idField: string): any;
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
	 *
	 */
	public afterRetrieveTransformID(entity: Record<string, any>, idField: string): object;
	/**
	 * ransforms the ID field of an entity after retrieving it from the database.
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
	public afterRetrieveTransformID(entity: any, idField: string): any;
	/** Additional custom methods */
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
	public beforeQueryTransformID(idField: any): any;
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
	public count<T extends MKRMEntity, P extends string>(
		where?: FilterQuery<T>,
		options?: CountOptions<T, P>,
	): Promise<number>;
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
	public create<T extends MKRMEntity>(
		entityOrEntities: RequiredEntityData<T> | RequiredEntityData<T>[],
		options?: CreateOptions,
	): Promise<T | T[]>;
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
	public insert<T extends MKRMEntity>(
		entityOrEntities: RequiredEntityData<T> | RequiredEntityData<T>[],
		options?: CreateOptions,
	): Promise<T | T[]>;
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
	public updateById<T extends MKRMEntity>(
		id: any,
		update: EntityData<T>,
		options?: UpdateOptions<T>,
	): Promise<any>;
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
	public removeById<T extends MKRMEntity>(id: any, options?: DeleteOptions<T>): Promise<number>;
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
	public removeMany<T extends MKRMEntity>(id: any[], options?: DeleteOptions<T>): Promise<number>;
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
	public find<T extends MKRMEntity, P extends string>(
		where: FilterQuery<T>,
		options?: FindOptions<T, P>,
	): Promise<Loaded<T, P> | Loaded<T, P>[]>;
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
	 * @param {FilterQuery<T>} where - The filter query to match the entity against.
	 * @param {FindOneOptions<T, P>} [options] - Optional settings for the find operation.
	 *
	 * @returns {Promise<null | Loaded<T, P>>} A promise that resolves with the entity that matches the filter query,
	 * or null if no entity matches the filter query.
	 *
	 * @throws {Errors.MoleculerServerError} If any error occurs, a `MoleculerServerError` is thrown with the error message, a 500 status code,
	 * the error code 'FAILED_TO_FIND_ONE', and the error details.
	 */
	public findOne<T extends MKRMEntity, P extends string>(
		where: FilterQuery<T>,
		options?: FindOneOptions<T, P>,
	): Promise<null | Loaded<T, P>>;

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
	public findById<T extends MKRMEntity>(
		id: string | number | string[] | number[],
	): Promise<T | undefined>;
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
	public getPopulations(ctx: Context, params?: any): Promise<object | object[]>;
	/**
	 * Gets items by id.
	 *
	 * @methods
	 * @param {Context} ctx - Request context
	 * @param {Partial<T>} key - primary db id column name
	 * @param {Array<string> | Array<number>} ids - ids of entity
	 * @returns {Promise<T | undefined>}
	 * @deprecated - use findById instead. It now supports multiple ids
	 *
	 */
	// public findByIds<T extends MKRMEntity>(
	// 	ctx: Context,
	// 	key: string | undefined | null,
	// 	ids: any[],
	// ): Promise<T | undefined>;

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
	public list(ctx: any, params: ListParams): Promise<object>;

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
	public encodeID(id: any): any;

	/**
	 * Decodes the provided ID.
	 *
	 * This method currently returns the provided ID as it is. It can be overridden in subclasses to provide custom decoding logic.
	 *
	 * @methods
	 * @param {any} id - The ID to decode.
	 *
	 * @returns {any} The decoded ID.
	 */
	public decodeID(id: any): any;

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
	public toMongoObjectId(id: any): ObjectId;

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
	public fromMongoObjectId(id: any): string;

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
	public transformDocuments(ctx: Context, params: any, docs: any): Promise<any[] | object>;

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
	public beforeEntityChange(type: string | undefined, entity: object, ctx: Context): Promise<any>;

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
	public entityChanged(
		type: string | undefined,
		json: object | object[] | number,
		ctx: Context,
	): Promise<any>;
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
	public clearCache(): Promise<any>;
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
	public filterFields(doc: object, fields: any[]): any;
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
	public excludeFields(doc: object, fields: string | string[]): object;

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
	public _excludeFields(doc: object, fields: string[]): object;

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
	public populateDocs(
		ctx: Context,
		docs: any[] | object,
		populateFields?: string[],
	): Promise<any>;
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
	public validateEntity(entity: object | object[]): Promise<object | object[]>;
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
	public authorizeFields(askedFields: string[]): string[];
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
	public sanitizeParams(ctx: Context, params: object): object;
	// #endregion Moleculer-db methods
}
