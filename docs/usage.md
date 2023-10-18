# Usage

## Adapter

Usage for the adapter is fairly straight forward. After importing it into your service, use the class `MikroORMDbAdapter` to pass a data source object to connect to a database

```js
...
name: 'user',
adapter: new MikroORMDbAdapter({
    name: 'default',
    type: 'better-sqlite',
    dbName: `temp/dbname_user.db`,
    entities: [UserEntity],
    entitiesTs: [UserEntity],
    highlighter: new SqlHighlighter(),
    debug: true,
}), 
model: UserEntity,
...
```
The `model:` property is only needed if the `entities:` property array is not specified in the data source. The `model:` property accepts a non-array value or an array value. When dealing with entities on the adapter connection the thing to remember is that multiple entities on the data source are considered tables within that particular database. If you are wanting to connect to a different database, then use the conenction manager to create a new connection to that database instead of adding it to the data source of the current connetion.

To use the adapter in service, simply use `this.adapter` for the example above. If additional entities (tables) are included in the connection, each entity can be used by adding teh suffix of the entity name to the adapter `this.adapter.<entity>`. Mikro-ORM methods for Active Record (Mikro-ORM [BaseEntity](https://github.com/typeorm/typeorm/blob/d4607a86723eef07e62e6d7321a07f3ae5ed1f90/src/repository/BaseEntity.ts) methods) are mapped to the adapter for each entity and adhear to that entity context. Methods added to entities are also mapped to that entity context so methods for entity A will not be accessable on entity B. Entity methods can be called as `this.adapter.<entity>.<entity method>`. The adapter also maps `Repository`, `Entity Manager` and `connectionManager` to the entities. These are called in a similar way `this.adapter.<repository|manager|connectionManager>`. Configured connections start and stop with the service as long as `moleculer-db` mixin is used. If `moleculer-db` isn't used in the project, the connection will need to be manually initialized, connected, and closed.

```js
const productsConnection = await this.adapter.connectionManager?.create(
    {
        name: 'products',
        type: 'better-sqlite',
        dbName: `temp/dbname_product.db`,
        synchronize: true,
        entities: [ProductEntity],
        entitiesTs: [ProductEntity],
        highlighter: new SqlHighlighter(),
        debug: true,
    },
    true,
)!;
await productsConnection.init(this.broker, this);
await productsConnection.connect();
this.products = productsConnection;
```
!> Note that when manually using the adapter `broker` and `service` need to be passed to the init method `init(this.broker, this)` for the adapter to function correctly. Be sure to use `.close()` to close teh connection. If there are multiple entities configured in the datasource, pass the name or array of names to `.close()` and the connections will be closed.

## Connection Manager
The connection manager creates, gets, removes, lists, and closes connections. The connection store is service specific and static, so each service has and manages its own connections.

### List connections
To list alll connections on the current service use `this.adapter.connectionManager.get()`. This will produce an array of current connections on teh service both active and inactive.

### Get Connection
To get a connection on the current service use `this.adapter.connectionManager.get(<name of connection as string>)`. The connection returned will be the full connection that will need to be initialized and then connected if it is not alerady active.
```js
const usersConnection = this.adapter.connectionManager.get('UsersConnection');
usersConnection.findById('id', '5ec51b3d5b96f9b098655bda');
```

### Close connection
To close a connection, pass the connection name or an array of names to the `.close()` method.
```js
this.adapter.connectionManager.close('UsersConnection');
or
this.adapter.connectionManager.close(['UsersConnection', 'ProductsConenction']); 
```

### Has connection
You can check for a connection in the connection store by using the `.has()` method passing a connection name.
```js
this.adapter.connectionManager.has('UsersConnection');
```

### Remove connection
To remove a conneciton from the connectino store use `.remove()` method passing a conneciton name.
```js
this.adapter.connectionManager.remove('UsersConnection');
```

### Create connection
Create a new connection by using the `.create()` method that recieve 2 paramaters; data source object and boolean value;
```js
const productsConnection = await this.adapter.connectionManager?.create(
    {
        name: 'UsersConnection',
        type: 'better-sqlite',
        dbName: `temp/dbname_users.db`,
        entities: [UserEntity],
        entitiesTs: [UserEntity],
        highlighter: new SqlHighlighter(),
        debug: true,
    },
    true,
)!;
await productsConnection.init(this.broker, this);
await productsConnection.connect();
this.products = productsConnection;
```
The boolean value is used to tell the adapter that this is a new connection to a different database and whether or not to create a new instance of this adapter. The default value is `false` when the boolean value is not present and will create a connection that one would expect from using vanilla Mikro-ORM without this adapter and all that it provides.

Adding `true` will create a new instance of this adapter with moleculer configuration and adapter class methods included.

?> When `true` is absent the adapter will still map additional entities to the connection to be used with `connction.<entity name>`, however connection manager is not present on the conneciton. The created connection is initialized for you, though closing the connection will require Mikro-ORMs connection `.close()` method.
