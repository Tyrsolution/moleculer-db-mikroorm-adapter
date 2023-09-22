/* eslint-disable capitalized-comments */
/* eslint-disable max-len */
/*
 * moleculer-db-mikroorm-adapter
 * Copyright (c) 2023 TyrSolutions (https://github.com/Tyrsolution/moleculer-db-mikroorm-adapter)
 * MIT Licensed
 */
import {
	AnyEntity,
	AssignOptions,
	Configuration,
	Constructor,
	CountOptions,
	CreateOptions,
	DeleteOptions,
	EntityData,
	EntityDictionary,
	EntityLoaderOptions,
	EntityManager,
	EntityManagerType,
	EntityMetadata,
	EntityName,
	EntityRepository,
	FilterQuery,
	FindOneOptions,
	FindOneOrFailOptions,
	FindOptions,
	GetReferenceOptions,
	IDatabaseDriver,
	IEntityGenerator,
	IMigrator,
	ISeedManager,
	Loaded,
	MergeOptions,
	MetadataStorage,
	MikroORM,
	NativeInsertUpdateOptions,
	Options,
	Primary,
	Ref,
	RequiredEntityData,
	UpdateOptions,
} from '@mikro-orm/core';
import { AutoPath } from '@mikro-orm/core/typings';
import { Context, Service, ServiceBroker, ServiceSchema } from 'moleculer';
import { ConnectionManager } from './connectionManager';

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

export interface DbAdapter<Entity extends AnyEntity, D extends IDatabaseDriver = IDatabaseDriver> {
	// #region DbAdapter properties
	[key: string]: any;
	/**
	 * Mikro-ORM Entity Repository
	 */
	repository: EntityRepository<Entity> | undefined;
	/**
	 * Mikro-ORM Entity Manager
	 */
	manager: D[typeof EntityManagerType] & EntityManager;
	/**
	 * Mikro-ORM Adapter Connection Manager
	 */
	connectionManager: ConnectionManager | undefined;
	orm: MikroORM<D>;
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
	getMetadata(entityName: EntityName<Entity>): EntityMetadata<Entity>;
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
	_persist(entity: AnyEntity | AnyEntity[]): EntityManager;
	/**
	 * Persists your entity immediately, flushing all not yet persisted changes to the database too.
	 * Equivalent to `em.persist(e).flush()`.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	_persistAndFlush(entity: AnyEntity | AnyEntity[]): Promise<void>;
	/**
	 * Tells the EntityManager to make an instance managed and persistent.
	 * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
	 *
	 * @deprecated use `persist()`
	 */
	_persistLater(entity: AnyEntity | AnyEntity[]): void;
	/**
	 * Finds first entity matching your `where` query.
	 */
	_findOne<P extends string = never>(
		where: FilterQuery<Entity>,
		options?: FindOneOptions<Entity, P>,
	): Promise<Loaded<Entity, P> | null>;
	/**
	 * Finds first entity matching your `where` query. If nothing found, it will throw an error.
	 * You can override the factory for creating this method via `options.failHandler` locally
	 * or via `Configuration.findOneOrFailHandler` globally.
	 */
	_findOneOrFail<P extends string = never>(
		where: FilterQuery<Entity>,
		options?: FindOneOrFailOptions<Entity, P>,
	): Promise<Loaded<Entity, P>>;
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
		entityOrData?: EntityData<Entity> | Entity,
		options?: NativeInsertUpdateOptions<Entity>,
	): Promise<Entity>;
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
		entitiesOrData?: EntityData<Entity>[] | Entity[],
		options?: NativeInsertUpdateOptions<Entity>,
	): Promise<Entity[]>;
	/**
	 * Finds all entities matching your `where` query. You can pass additional options via the `options` parameter.
	 */
	_find<P extends string = never>(
		where: FilterQuery<Entity>,
		options?: FindOptions<Entity, P>,
	): Promise<Loaded<Entity, P>[]>;
	/**
	 * Calls `em.find()` and `em.count()` with the same arguments (where applicable) and returns the results as tuple
	 * where first element is the array of entities and the second is the count.
	 */
	_findAndCount<P extends string = never>(
		where: FilterQuery<Entity>,
		options?: FindOptions<Entity, P>,
	): Promise<[Loaded<Entity, P>[], number]>;
	/**
	 * Finds all entities of given type. You can pass additional options via the `options` parameter.
	 */
	_findAll<P extends string = never>(
		options?: FindOptions<Entity, P>,
	): Promise<Loaded<Entity, P>[]>;
	/**
	 * Marks entity for removal.
	 * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
	 *
	 * To remove entities by condition, use `em.nativeDelete()`.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	_remove(entity: AnyEntity): EntityManager;
	/**
	 * Removes an entity instance immediately, flushing all not yet persisted changes to the database too.
	 * Equivalent to `em.remove(e).flush()`
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	_removeAndFlush(entity: AnyEntity): Promise<void>;
	/**
	 * Marks entity for removal.
	 * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
	 *
	 * @deprecated use `remove()`
	 */
	_removeLater(entity: AnyEntity): void;
	/**
	 * Flushes all changes to objects that have been queued up to now to the database.
	 * This effectively synchronizes the in-memory state of managed objects with the database.
	 * This method is a shortcut for `em.flush()`, in other words, it will flush the whole UoW,
	 * not just entities registered via this particular repository.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	_flush(): Promise<void>;
	/**
	 * Fires native insert query. Calling this has no side effects on the context (identity map).
	 */
	_nativeInsert(
		data: Entity | EntityData<Entity>,
		options?: NativeInsertUpdateOptions<Entity>,
	): Promise<Primary<Entity>>;
	/**
	 * Fires native update query. Calling this has no side effects on the context (identity map).
	 */
	_nativeUpdate(
		where: FilterQuery<Entity>,
		data: EntityData<Entity>,
		options?: UpdateOptions<Entity>,
	): Promise<number>;
	/**
	 * Fires native delete query. Calling this has no side effects on the context (identity map).
	 */
	_nativeDelete(where: FilterQuery<Entity>, options?: DeleteOptions<Entity>): Promise<number>;
	/**
	 * Maps raw database result to an entity and merges it to this EntityManager.
	 */
	_map(
		result: EntityDictionary<Entity>,
		options?: {
			schema?: string;
		},
	): Entity;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	_getReference<PK extends keyof Entity>(
		id: Primary<Entity>,
		options: Omit<GetReferenceOptions, 'wrapped'> & {
			wrapped: true;
		},
	): Ref<Entity, PK>;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	_getReference(id: Primary<Entity> | Primary<Entity>[]): Entity;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	_getReference(
		id: Primary<Entity>,
		options: Omit<GetReferenceOptions, 'wrapped'> & {
			wrapped: false;
		},
	): Entity;
	/**
	 * Checks whether given property can be populated on the entity.
	 */
	_canPopulate(property: string): boolean;
	/**
	 * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
	 */
	_populate<P extends string = never>(
		entities: Entity | Entity[],
		populate: AutoPath<Entity, P>[] | boolean,
		options?: EntityLoaderOptions<Entity, P>,
	): Promise<Loaded<Entity, P>[]>;
	/**
	 * Creates new instance of given entity and populates it with given data.
	 * The entity constructor will be used unless you provide `{ managed: true }` in the options parameter.
	 * The constructor will be given parameters based on the defined constructor of the entity. If the constructor
	 * parameter matches a property name, its value will be extracted from `data`. If no matching property exists,
	 * the whole `data` parameter will be passed. This means we can also define `constructor(data: Partial<T>)` and
	 * `em.create()` will pass the data into it (unless we have a property named `data` too).
	 */
	_create<P = never>(data: RequiredEntityData<Entity>, options?: CreateOptions): Entity;
	/**
	 * Shortcut for `wrap(entity).assign(data, { em })`
	 */
	_assign(entity: Entity, data: EntityData<Entity>, options?: AssignOptions): Entity;
	/**
	 * Merges given entity to this EntityManager so it becomes managed. You can force refreshing of existing entities
	 * via second parameter. By default it will return already loaded entities without modifying them.
	 */
	_merge(data: Entity | EntityData<Entity>, options?: MergeOptions): Entity;
	/**
	 * Returns total number of entities matching your `where` query.
	 */
	_count<P extends string = never>(
		where?: FilterQuery<Entity>,
		options?: CountOptions<Entity, P>,
	): Promise<number>;
	/**
	 * @deprecated this method will be removed in v6, use the public `getEntityManager()` method instead
	 */
	get em(): EntityManager;
	/**
	 * Returns the underlying EntityManager instance
	 */
	getEntityManager(): EntityManager;
	/**
	 * Returns the underlying EntityManager instance
	 */
	_getEntityManager(): EntityManager;
	_validateRepositoryType(entities: Entity[] | Entity, method: string): void;
	// #endregion MikroORM entityrepostory methods
	// #region Moleculer-db methods
}

export default class MikroORMDbAdapter<
	Entity extends AnyEntity,
	D extends IDatabaseDriver = IDatabaseDriver,
> implements DbAdapter<Entity>
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
	 * @property {Repository<Entity>} repository
	 *
	 * @properties
	 */
	public repository: EntityRepository<Entity> | undefined;
	public orm: MikroORM<D>;
	private _entity;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	private MikroORM;
	/**
	 * Creates an instance of Mikro-ORM db service.
	 *
	 * @param {MikroORMOptions} opts
	 *
	 */
	public constructor(options: Options<D> | Configuration<D>);
	// #region Micro-ORM orm methods
	/**
	 * @deprecated this method will be removed in v6, use the public `getEntityManager()` method instead
	 */
	public get em(): EntityManager;
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
	 * Connects to database.
	 * It will be called in `broker.start()` and is used internally.
	 *
	 * @methods
	 * @public
	 *
	 * @returns {Promise}
	 *
	 */
	public connect(): Promise<any>;
	/**
	 * Disconnects all connections from database and connection manager.
	 * It will be called in `broker.stop()` and is used internally.
	 *
	 * @methods
	 * @public
	 *
	 * @returns {Promise}
	 */
	public disconnect(): Promise<any>;
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
	public getMetadata(entityName: EntityName<Entity>): EntityMetadata<Entity>;
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
	public _persist(entity: AnyEntity | AnyEntity[]): EntityManager;
	/**
	 * Persists your entity immediately, flushing all not yet persisted changes to the database too.
	 * Equivalent to `em.persist(e).flush()`.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	public _persistAndFlush(entity: AnyEntity | AnyEntity[]): Promise<void>;
	/**
	 * Tells the EntityManager to make an instance managed and persistent.
	 * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
	 *
	 * @deprecated use `persist()`
	 */
	public _persistLater(entity: AnyEntity | AnyEntity[]): void;
	/**
	 * Finds first entity matching your `where` query.
	 */
	public _findOne<P extends string = never>(
		where: FilterQuery<Entity>,
		options?: FindOneOptions<Entity, P>,
	): Promise<Loaded<Entity, P> | null>;
	/**
	 * Finds first entity matching your `where` query. If nothing found, it will throw an error.
	 * You can override the factory for creating this method via `options.failHandler` locally
	 * or via `Configuration.findOneOrFailHandler` globally.
	 */
	public _findOneOrFail<P extends string = never>(
		where: FilterQuery<Entity>,
		options?: FindOneOrFailOptions<Entity, P>,
	): Promise<Loaded<Entity, P>>;
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
		entityOrData?: EntityData<Entity> | Entity,
		options?: NativeInsertUpdateOptions<Entity>,
	): Promise<Entity>;
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
		entitiesOrData?: EntityData<Entity>[] | Entity[],
		options?: NativeInsertUpdateOptions<Entity>,
	): Promise<Entity[]>;
	/**
	 * Finds all entities matching your `where` query. You can pass additional options via the `options` parameter.
	 */
	public _find<P extends string = never>(
		where: FilterQuery<Entity>,
		options?: FindOptions<Entity, P>,
	): Promise<Loaded<Entity, P>[]>;
	/**
	 * Calls `em.find()` and `em.count()` with the same arguments (where applicable) and returns the results as tuple
	 * where first element is the array of entities and the second is the count.
	 */
	public _findAndCount<P extends string = never>(
		where: FilterQuery<Entity>,
		options?: FindOptions<Entity, P>,
	): Promise<[Loaded<Entity, P>[], number]>;
	/**
	 * Finds all entities of given type. You can pass additional options via the `options` parameter.
	 */
	public _findAll<P extends string = never>(
		options?: FindOptions<Entity, P>,
	): Promise<Loaded<Entity, P>[]>;
	/**
	 * Marks entity for removal.
	 * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
	 *
	 * To remove entities by condition, use `em.nativeDelete()`.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	public _remove(entity: AnyEntity): EntityManager;
	/**
	 * Removes an entity instance immediately, flushing all not yet persisted changes to the database too.
	 * Equivalent to `em.remove(e).flush()`
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	public _removeAndFlush(entity: AnyEntity): Promise<void>;
	/**
	 * Marks entity for removal.
	 * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
	 *
	 * @deprecated use `remove()`
	 */
	public _removeLater(entity: AnyEntity): void;
	/**
	 * Flushes all changes to objects that have been queued up to now to the database.
	 * This effectively synchronizes the in-memory state of managed objects with the database.
	 * This method is a shortcut for `em.flush()`, in other words, it will flush the whole UoW,
	 * not just entities registered via this particular repository.
	 *
	 * @deprecated this method will be removed in v6, you should work with the EntityManager instead
	 */
	public _flush(): Promise<void>;
	/**
	 * Fires native insert query. Calling this has no side effects on the context (identity map).
	 */
	public _nativeInsert(
		data: Entity | EntityData<Entity>,
		options?: NativeInsertUpdateOptions<Entity>,
	): Promise<Primary<Entity>>;
	/**
	 * Fires native update query. Calling this has no side effects on the context (identity map).
	 */
	public _nativeUpdate(
		where: FilterQuery<Entity>,
		data: EntityData<Entity>,
		options?: UpdateOptions<Entity>,
	): Promise<number>;
	/**
	 * Fires native delete query. Calling this has no side effects on the context (identity map).
	 */
	public _nativeDelete(
		where: FilterQuery<Entity>,
		options?: DeleteOptions<Entity>,
	): Promise<number>;
	/**
	 * Maps raw database result to an entity and merges it to this EntityManager.
	 */
	public _map(
		result: EntityDictionary<Entity>,
		options?: {
			schema?: string;
		},
	): Entity;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	public _getReference<PK extends keyof Entity>(
		id: Primary<Entity>,
		options: Omit<GetReferenceOptions, 'wrapped'> & {
			wrapped: true;
		},
	): Ref<Entity, PK>;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	public _getReference(id: Primary<Entity> | Primary<Entity>[]): Entity;
	/**
	 * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
	 */
	public _getReference(
		id: Primary<Entity>,
		options: Omit<GetReferenceOptions, 'wrapped'> & {
			wrapped: false;
		},
	): Entity;
	/**
	 * Checks whether given property can be populated on the entity.
	 */
	public _canPopulate(property: string): boolean;
	/**
	 * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
	 */
	public _populate<P extends string = never>(
		entities: Entity | Entity[],
		populate: AutoPath<Entity, P>[] | boolean,
		options?: EntityLoaderOptions<Entity, P>,
	): Promise<Loaded<Entity, P>[]>;
	/**
	 * Creates new instance of given entity and populates it with given data.
	 * The entity constructor will be used unless you provide `{ managed: true }` in the options parameter.
	 * The constructor will be given parameters based on the defined constructor of the entity. If the constructor
	 * parameter matches a property name, its value will be extracted from `data`. If no matching property exists,
	 * the whole `data` parameter will be passed. This means we can also define `constructor(data: Partial<T>)` and
	 * `em.create()` will pass the data into it (unless we have a property named `data` too).
	 */
	public _create<P = never>(data: RequiredEntityData<Entity>, options?: CreateOptions): Entity;
	/**
	 * Shortcut for `wrap(entity).assign(data, { em })`
	 */
	public _assign(entity: Entity, data: EntityData<Entity>, options?: AssignOptions): Entity;
	/**
	 * Merges given entity to this EntityManager so it becomes managed. You can force refreshing of existing entities
	 * via second parameter. By default it will return already loaded entities without modifying them.
	 */
	public _merge(data: Entity | EntityData<Entity>, options?: MergeOptions): Entity;
	/**
	 * Returns total number of entities matching your `where` query.
	 */
	public _count<P extends string = never>(
		where?: FilterQuery<Entity>,
		options?: CountOptions<Entity, P>,
	): Promise<number>;
	/**
	 * Returns the underlying EntityManager instance
	 */
	public getEntityManager(): EntityManager;
	/**
	 * Returns the underlying EntityManager instance
	 */
	public _getEntityManager(): EntityManager;
	public _validateRepositoryType(entities: Entity[] | Entity, method: string): void;
	// #endregion MikroORM entityrepostory methods
	// #region Moleculer-db methods
	/** Moleculer-db methods */
	/**
	 * Convert DB entity to JSON object
	 *
	 * @methods
	 * @public
	 * @param {any} entity
	 * @returns {Object}
	 *
	 */
	public entityToObject(entity: any): object;
	/**
	 * Convert DB entity to JSON object
	 *
	 * @param {any} entity
	 * @returns {Object}
	 * @memberof MemoryDbAdapter
	 */
	public entityToObject(entity: any): any;
	/**
	 * Transforms user defined idField into expected db id field.
	 *
	 * @methods
	 * @public
	 * @param {Object} entity
	 * @param {String} idField
	 *
	 * @returns {Object} Modified entity
	 *
	 */
	public beforeSaveTransformID(entity: Record<string, any>, idField: string): object;
	/**
	 * Transforms 'idField' into NeDB's '_id'
	 * @param {Object} entity
	 * @param {String} idField
	 * @memberof MemoryDbAdapter
	 * @returns {Object} Modified entity
	 */
	public beforeSaveTransformID(entity: any, idField: string): any;
	/**
	 * Transforms db field into user defined idField service property
	 *
	 * @methods
	 * @public
	 * @param {Object} entity
	 * @param {String} idField
	 * @returns {Object} Modified entity
	 *
	 */
	// AfterRetrieveTransformID(entity: Record<string, any>, idField: string): object;
	/** Additional custom methods */
	/**
	 * Transform user defined idField service property into the expected id field of db.
	 * @methods
	 * @param {any} idField
	 * @returns {any}
	 * @memberof MikroORMDbAdapter
	 */
	public beforeQueryTransformID(idField: any): any;
	/**
	 * Count number of matching documents in the db to a query.
	 *
	 * @methods
	 * @param {Object} options - count options
	 * @param {Object?} query - query options
	 * @returns {Promise<number>}
	 * @memberof MikroORMDbAdapter
	 */
	// public count(options?: any, query?: any): Promise<number>;
	/**
	 * Finds entities that match given find options.
	 *
	 * @methods
	 * @param {Context} ctx - request context
	 * @param {Object} findManyOptions - find many options
	 * @returns {Promise<[T | number]>}
	 * @memberof MikroORMDbAdapter
	 */
	// public find<T extends Entity>(ctx: Context, findManyOptions?: any): Promise<[T[], number]>;
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
	// public findOne<T extends Entity>(ctx: Context, findOptions?: any): Promise<T | undefined>;
	/**
	 * Gets item by id. Can use find options
	 *
	 * @methods
	 * @param {Context} ctx - Request context
	 * @param {Partial<T>} key - primary db id column name
	 * @param {string | number | string[] | number[]} id - id(d) of entity
	 * @param {Object} findOptions - find options, like relations, order, etc. No where clause
	 * @returns {Promise<T | undefined>}
	 *
	 */
	public findByIdWO<T extends Entity>(
		ctx: Context,
		key: string | undefined | null,
		id: string | number | string[] | number[],
		findOptions?: any | any,
	): Promise<T | undefined>;

	/**
	 * Gets item by id. No find options
	 *
	 * @methods
	 * @param {Context} ctx - Request context
	 * @param {Partial<T>} key - primary db id column name
	 * @param {string | number | string[] | number[]} id - id(s) of entity
	 * @returns {Promise<T | undefined>}
	 *
	 */
	public findById<T extends Entity>(
		ctx: Context,
		key: string | undefined | null,
		id: string | number | string[] | number[],
	): Promise<T | undefined>;
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
	public getPopulations(ctx: Context, params?: any): object | object[];
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
	public findByIds<T extends Entity>(
		ctx: Context,
		key: string | undefined | null,
		ids: any[],
	): Promise<T | undefined>;

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
	public list(ctx: any, params: ListParams): Promise<any>;

	/**
	 * Transforms NeDB's '_id' into user defined 'idField'
	 * @param {Object} entity
	 * @param {String} idField
	 * @memberof MemoryDbAdapter
	 * @returns {Object} Modified entity
	 */
	// AfterRetrieveTransformID(entity: any, idField: string): any;

	/**
	 * Encode ID of entity.
	 *
	 * @methods
	 * @param {any} id
	 * @returns {any}
	 */
	public encodeID(id: any): any;

	/**
	 * Decode ID of entity.
	 *
	 * @methods
	 * @param {any} id
	 * @returns {any}
	 */
	public decodeID(id: any): any;

	/**
	 * Convert id to mongodb ObjectId.
	 * @methods
	 * @param {any} id
	 * @returns {any}
	 * @memberof MikroORMDbAdapter
	 */
	// ToMongoObjectId(id: any): ObjectId;

	/**
	 * Convert mongodb ObjectId to string.
	 * @methods
	 * @param {any} id
	 * @returns {any}
	 * @memberof MikroORMDbAdapter
	 */
	public fromMongoObjectId(id: any): string;

	/**
	 * Transform the fetched documents
	 * @methods
	 * @param {Context} ctx
	 * @param {Object} 	params
	 * @param {Array|Object} docs
	 * @returns {Array|Object}
	 */
	public transformDocuments(ctx: any, params: any, docs: any): any;

	/**
	 * Call before entity lifecycle events
	 *
	 * @methods
	 * @param {String} type
	 * @param {Object} entity
	 * @param {Context} ctx
	 * @returns {Promise}
	 */
	public beforeEntityChange(type: string | undefined, entity: any, ctx: any): Promise<any>;

	/**
	 * Clear the cache & call entity lifecycle events
	 *
	 * @methods
	 * @param {String} type
	 * @param {Object|Array<Object>|Number} json
	 * @param {Context} ctx
	 * @returns {Promise}
	 */
	public entityChanged(type: string | undefined, json: any, ctx: any): Promise<any>;
	/**
	 * Clear cached entities
	 *
	 * @methods
	 * @returns {Promise}
	 */
	public clearCache(): Promise<any>;
	/**
	 * Filter fields in the entity object
	 *
	 * @param {Object} 	doc
	 * @param {Array<String>} 	fields	Filter properties of model.
	 * @returns	{Object}
	 */
	public filterFields(doc: any, fields: any[]): any;
	/**
	 * Exclude fields in the entity object
	 *
	 * @param {Object} 	doc
	 * @param {Array<String>} 	fields	Exclude properties of model.
	 * @returns	{Object}
	 */
	public excludeFields(doc: any, fields: string | any[]): any;

	/**
	 * Exclude fields in the entity object. Internal use only, must ensure `fields` is an Array
	 */
	public _excludeFields(doc: any, fields: any[]): any;

	/**
	 * Populate documents.
	 *
	 * @param {Context} 		ctx
	 * @param {Array|Object} 	docs
	 * @param {Array?}			populateFields
	 * @returns	{Promise}
	 */
	public populateDocs(ctx: any, docs: any, populateFields?: any[]): Promise<any>;
	/**
	 * Validate an entity by validator.
	 * @methods
	 * @param {Object} entity
	 * @returns {Promise}
	 */
	public validateEntity(entity: any): Promise<any>;
	/**
	 * Authorize the required field list. Remove fields which is not exist in the `this.settings.fields`
	 *
	 * @param {Array} askedFields
	 * @returns {Array}
	 */
	public authorizeFields(askedFields: any[]): any[];
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
	public sanitizeParams(ctx: any, params: any): any;
	/**
	 * Update an entity by ID
	 * @param {Context} ctx - Request context
	 * @param {any} id
	 * @param {Object} update
	 * @returns {Promise}
	 * @memberof MemoryDbAdapter
	 */
	public updateById(ctx: Context, id: any, update: any): Promise<any>;
	// #endregion Moleculer-db methods
}

export function MikroORMServiceSchemaMixin(mixinOptions?: any): ServiceSchema;
