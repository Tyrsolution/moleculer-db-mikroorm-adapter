![Moleculer logo](http://moleculer.services/images/banner.png)

<!-- [![Build Status](https://travis-ci.org/tyrsolution/moleculer-db-mikroorm-adapter.svg?branch=master)](https://travis-ci.org/tyrsolution/moleculer-db-mikroorm-adapter) -->
[![Coverage Status](https://coveralls.io/repos/github/tyrsolution/moleculer-db-mikroorm-adapter/badge.svg?branch=master)](https://coveralls.io/github/tyrsolution/moleculer-db-mikroorm-adapter?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/tyrsolution/moleculer-db-mikroorm-adapter/badge.svg)](https://snyk.io/test/github/tyrsolution/moleculer-db-mikroorm-adapter)

# @tyrsolutions/moleculer-db-mikroorm-adapter [![NPM version](https://img.shields.io/npm/v/@tyrsolutions/moleculer-db-mikroorm-adapter.svg)](https://www.npmjs.com/package/@tyrsolutions/moleculer-db-mikroorm-adapter)
A Mikro-ORM adapter for moleculer


## Features

- All supported Mikro-ORM databases
- Connection Manager - manage your existing connections or create new ones to different database systems on the same service. New connections are a new instance of ```MikroORMDbAdapter``` if ```true``` is added after datasource options. If ```true``` is not specified, then the connection will be created with raw Mikro-ORM datasource and not inherit class methods, only Mikro-ORM methods will be available (about the same as using Mikro-ORM by itself).
- All entities added to MikroORMDbAdapter and model array are added to this.adapter
  - Base entity ```this.adapter```
  - any additional entity ```this.adapter.<entity name>``` when model has more than one entity. Note: additional entities added to ```model:``` are tables in the same database.
- Repository and entityManager surfaced for ```this.adapter``` and additional entities on same adapter instance  ```this.adapter.<entity name>``` if more advanced Mikro-ORM features are required
- Database connections for service start and stop when service does, so closing db connection not necessary.
- Setting ```idField``` in service schema is used to specify own preference and obfusicate the true db id field in the entire response, includng returned relations. This gets converted to the actual db field name automatically when querying the database, then converted back to idField on response. If you wish to use the actual db id field of the database, change idField to the database id field name.
- The service setting ```fields:[]``` filters the response, just like in moleculer-db, so if you do change the idField in settings, be sure to change the id field in service settings ```fields``` as well.

## Install
#### NPM
```
npm install moleculer-db @tyrsolutions/moleculer-db-mikroorm-adapter --save
```
#### Yarn
```
yarn add moleculer-db @tyrsolutions/moleculer-db-mikroorm-adapter
```

## Usage

In service schema:
```js
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
service: {
    ...
    adapter: new MikroORMDbAdapter({
        name: 'default',
        type: 'better-sqlite',
        dbName: 'temp/test.db',
        entities: [...entities],
        entitiesTs: [...entities],
        highlighter: new SqlHighlighter(), // optional highlighter
        debug: true, // logging defaults to console.log(), available logger namespaces: 'query' | 'query-params' | 'discovery' | 'info'
    }),

    model: TypeProduct || [TypeProduct, TypeProduct2], // accepts single entity or array of entities.
    ...
}
```

Create a new db connection in service (preferably in service started lifecycle handler):
```js
async started() {
    this.logger.debug('♻ User service created');
    /**
     * Creates the new connection using conneciton manager of the existing adapter in service,
     * adding true after the data source options tells connctionmanager to create a new instance
     * of MikroORMDbAdapter to the specified database. This in turn allows the new connection to have multiple entities (db tables)
     * applied that are added to the new connection. In this case below this.products would query the ProductEntity
     * table of database and this.products.<additional entity> would query that table in teh same db.
     */
    const productsConnection = await this.adapter.connectionManager?.create(
        {
            name: 'products',
            type: 'better-sqlite',
            dbName: `temp/dbname_product.db`,
            entities: [...entities],
            entitiesTs: [...entities],
            highlighter: new SqlHighlighter(), // optional highlighter
            debug: true, // logging defaults to console.log(), available logger namespaces: 'query' | 'query-params' | 'discovery' | 'info'
        },
        true,
    );
    await productsConnection.init(this.broker, this); // needed to initialize the conection with broker and service
    await productsConnection.connect(); // connects to the database
    this.products = productsConnection; // assigns new connection to service and can be called with this.products
}
```

## Test
#### NPM
```
$ npm test
```
#### Yarn
```
yarn test
```

In development with watching

```
$ npm run ci
```

# Properties

<!-- AUTO-CONTENT-START:PROPERTIES -->
## `connectionManager` 

Grants access to the connection manager instance which is used to create and manage connections.
Called using this.adapter.connectionManager

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
*No input parameters.*



## `manager` 

Grants access to the entity manager of the connection.
Called using this.adapter.manager

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
*No input parameters.*



## `repository` 

Grants access to the entity repository of the connection.
Called using this.adapter.repository

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
*No input parameters.*



<!-- AUTO-CONTENT-END:PROPERTIES -->

<!-- AUTO-CONTENT-TEMPLATE:PROPERTIES
{{#each this}}
## `{{name}}` {{#each badges}}{{this}} {{/each}}
{{#since}}
_<sup>Since: {{this}}</sup>_
{{/since}}

{{description}}

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each params}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^params}}
*No input parameters.*
{{/params}}

{{#returns}}
### Results
**Type:** {{type}}

{{description}}
{{/returns}}

{{#hasExamples}}
### Examples
{{#each examples}}
{{this}}
{{/each}}
{{/hasExamples}}

{{/each}}
-->

# Methods

<!-- AUTO-CONTENT-START:METHODS -->
## `init` 

Initialize adapter.
It will be called in `broker.start()` and is used internally.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `broker` | `ServiceBroker` | **required** | Moleculer broker instance |
| `service` | `Service` | **required** | Moleculer service instance |



## `connect` 

Connects to database.
It will be called in `broker.start()` and is used internally.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
*No input parameters.*

### Results
**Type:** `Promise`




## `disconnect` 

Disconnects all connections from database and connection manager.
It will be called in `broker.stop()` and is used internally.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
*No input parameters.*

### Results
**Type:** `Promise.<void>`




## `create` 

Create new record or records.
If record exists it is skipped, otherwise it is created.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `entityOrEntities` | `Object`, `Array.<Object>` | **required** | record(s) to create |
| `options` | `Object` | - | Optional create options |

### Results
**Type:** `Promise.<(Object|Array.<Object>)>`




## `insert` 

Create one or many new entities.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `entityOrEntities` | `Object`, `Array.<Object>` | **required** | entity or entities to create. |
| `options` | `Object` | - | Insert options. |

### Results
**Type:** `Object`, `Array.<Object>`

Saved entity(ies).


## `updateById` 

Update an entity by ID

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id` | `any` | **required** | ID of record to be updated |
| `update` | `Object` | **required** | Object with update data |
| `options` | `Object` | **required** | Object with update options |

### Results
**Type:** `Promise.<T>`

- Updated record


## `MikroORMDbAdapter#removeById` 

Remove an entity by ID

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id` | `any` | **required** |  |
| `options` | `DeleteOptions.<T>` | **required** |  |

### Results
**Type:** `Promise.<number>`




## `MikroORMDbAdapter#removeMany` 

Remove many entities by ID

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id` | `Array.<any>` | **required** |  |
| `options` | `DeleteOptions.<T>` | **required** |  |

### Results
**Type:** `Promise.<number>`




## `count` 

Count number of matching documents in the db to a query.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `where` | `Object` | **required** | query options |
| `options` | `Object` | - | count options |

### Results
**Type:** `Promise.<number>`




## `find` 

Finds all entities matching your FilterQuery and FindOptions.
Returns array of entities or single entity depending on your query.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `where` | `Object` | **required** | query options |
| `options` | `Object` | - | find options |

### Results
**Type:** `Promise.<(T|Array.<T>)>`




## `findOne` 

Finds first item by a given FilterQuery and FindOneOptions.
If entity was not found in the database - returns null.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `where` | `Object` | **required** | query options |
| `options` | `Object` | - | find options |

### Results
**Type:** `Promise.<(T|undefined)>`




## `findById` 

Gets item by id(s). No find options can be provided

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id` | `string`, `number`, `Array.<string>`, `Array.<number>` | **required** | id(s) of entity |

### Results
**Type:** `Promise.<(T|undefined)>`




## `getPopulations` 

Populates entity(ies) by id(s) of another record.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Context instance. |
| `params` | `Object` | - | Parameters. |

### Results
**Type:** `Object`, `Array.<Object>`

Found entity(ies).


## `list` 

List entities from db using filters and pagination results.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Context instance. |
| `params` | `ListParams.<Object>` | - | Optional parameters. |

### Results
**Type:** `Object`

List of found entities and count.


## `beforeSaveTransformID` 

Transforms user defined idField into expected db id field name.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `entity` | `Object` | **required** | Record to be saved |
| `idField` | `String` | **required** | user defined service idField |

### Results
**Type:** `Object`

- Modified entity


## `afterRetrieveTransformID` 

Transforms db field name into user defined idField service property

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `entity` | `Object` | **required** | = Record retrieved from db |
| `idField` | `String` | **required** | user defined service idField |

### Results
**Type:** `Object`

- Modified entity


## `encodeID` 

Encode ID of entity.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id` | `any` | **required** |  |

### Results
**Type:** `any`




## `toMongoObjectId` 

Convert id to mongodb ObjectId.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id` | `any` | **required** |  |

### Results
**Type:** `any`




## `fromMongoObjectId` 

Convert mongodb ObjectId to string.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id` | `any` | **required** |  |

### Results
**Type:** `any`




## `beforeQueryTransformID` 

Transform user defined idField service property into the expected id field of db.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `idField` | `any` | **required** | user defined service idField |

### Results
**Type:** `Object`

- Record to be saved


## `decodeID` 

Decode ID of entity.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id` | `any` | **required** |  |

### Results
**Type:** `any`




## `transformDocuments` 

Transform the fetched documents by converting id to user defind idField,
filtering the fields according to the fields service property,
and populating the document with the relations specified in the populate service property.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Context of the request |
| `params` | `Object` | **required** | Params of the request |
| `docs` | `Array`, `Object` | **required** | Records to be transformed |

### Results
**Type:** `Array`, `Object`

- Transformed records


## `beforeEntityChange` 

Call before entity lifecycle events

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `type` | `String` | **required** |  |
| `entity` | `Object` | **required** |  |
| `ctx` | `Context` | **required** |  |

### Results
**Type:** `Promise`




## `entityChanged` 

Clear the cache & call entity lifecycle events

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `type` | `String` | **required** |  |
| `json` | `Object`, `Array.<Object>`, `Number` | **required** |  |
| `ctx` | `Context` | **required** |  |

### Results
**Type:** `Promise`




## `clearCache` 

Clear cached entities

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
*No input parameters.*

### Results
**Type:** `Promise`




## `filterFields` 

Filter fields in the entity object

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `doc` | `Object` | **required** | Record to be filtered. |
| `fields` | `Array.<String>` | **required** | Filter properties of model. |

### Results
**Type:** `Object`

- Filtered record


## `excludeFields` 

Exclude fields in the entity object

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `doc` | `Object` | **required** | Record to be filtered. |
| `fields` | `Array.<String>` | **required** | Exclude properties of model. |

### Results
**Type:** `Object`

- Recored without excluded fields


## `populateDocs` 

Populate documents for relations.
Used when relations between records between different databases can't be done.
Populates the retreived record by calling service action with the `id` of the relation.
Does not update related document at this time

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Request context |
| `docs` | `Array`, `Object` | **required** | Records to be populated |
| `populateFields` | `Array` | - | Fields to be populated |

### Results
**Type:** `Promise`

- Record with populated fields of relation


## `validateEntity` 

Validate an entity by validator.
Uses the `entityValidator` setting. If no validator function is supplied, returns record.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `entity` | `Object` | **required** | Record to be validated |

### Results
**Type:** `Promise`

- Validated record or unvalitaded record if no validator function is supplied.


## `entityToObject` 

Convert DB entity to JSON object

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `entity` | `any` | **required** | Record to be converted |

### Results
**Type:** `Object`

- JSON object of record


## `authorizeFields` 

Authorize the required field list. Remove fields which does not exist in the `this.service.settings.fields`

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `askedFields` | `Array` | **required** | List of fields to be authorized |

### Results
**Type:** `Array`

- Authorized list of fields


## `sanitizeParams` 

Sanitize context parameters at `find` action.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Request context |
| `params` | `Object` | **required** | Request parameters |

### Results
**Type:** `Object`

- Sanitized parameters


## `sanitizeParams` 

Sanitize context parameters at `find` action.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Request context |
| `params` | `Object` | **required** | Request parameters |

### Results
**Type:** `Object`

- Sanitized parameters


## `getById` 

Get entity(ies) by ID(s).

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id` | `any`, `Array.<any>` | **required** | ID or IDs. |
| `decoding` | `Boolean` | - | Need to decode IDs. |

### Results
**Type:** `Object`, `Array.<Object>`

Found entity(ies).


## `beforeEntityChange` 

Call before entity lifecycle events

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `type` | `String` | **required** |  |
| `entity` | `Object` | **required** |  |
| `ctx` | `Context` | **required** |  |

### Results
**Type:** `Promise`




## `entityChanged` 

Clear the cache & call entity lifecycle events

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `type` | `String` | **required** |  |
| `json` | `Object`, `Array.<Object>`, `Number` | **required** |  |
| `ctx` | `Context` | **required** |  |

### Results
**Type:** `Promise`




## `clearCache` 

Clear cached entities

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
*No input parameters.*

### Results
**Type:** `Promise`




## `transformDocuments` 

Transform the fetched documents

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** |  |
| `params` | `Object` | **required** |  |
| `docs` | `Array`, `Object` | **required** |  |

### Results
**Type:** `Array`, `Object`




## `validateEntity` 

Validate an entity by validator.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `entity` | `Object` | **required** |  |

### Results
**Type:** `Promise`




## `encodeID` 

Encode ID of entity.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id` | `any` | **required** |  |

### Results
**Type:** `any`




## `decodeID` 

Decode ID of entity.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id` | `any` | **required** |  |

### Results
**Type:** `any`




## `_find` 

Find entities by params.
Params should be an object with entity property or an object with `where` query.
e.g. `{ id: '123456' }` or `{ where: [12345,123456]}` or
{where: {"$and":[{"id":{"$in":[12345,123456]}}]}}
Options property is optional.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Context instance. |
| `params` | `Object` | - | Parameters. |

### Results
**Type:** `Promise.<(T|Array.<T>)>`

List of found entities.


## `_count` 

Get count of entities by query.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Context instance. |
| `params` | `Object` | - | Parameters. |

### Results
**Type:** `Number`

Count of found entities.


## `_list` 

List entities by filters and pagination results.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Context instance. |
| `params` | `Object` | - | Parameters. |

### Results
**Type:** `Object`

List of found entities and count.


## `_create` 

Create a new entity.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Context instance. |
| `params` | `Object` | - | Parameters. |

### Results
**Type:** `Object`

Saved entity.


## `_insert` 

Create many new entities.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Context instance. |
| `params` | `Object` | - | Parameters. |

### Results
**Type:** `Object`, `Array.<Object>`

Saved entity(ies).


## `_get` 

Get entity by ID.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Context instance. |
| `params` | `Object` | - | Parameters. |

### Results
**Type:** `Object`, `Array.<Object>`

Found entity(ies).


## `_update` 

Update an entity by ID.
> After update, clear the cache & call lifecycle events.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Context instance. |
| `params` | `Object` | - | Parameters. |

### Results
**Type:** `Object`

Updated entity.


## `_remove` 

Remove an entity by ID.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `ctx` | `Context` | **required** | Context instance. |
| `params` | `Object` | - | Parameters. |



<!-- AUTO-CONTENT-END:METHODS -->

<!-- AUTO-CONTENT-TEMPLATE:METHODS
{{#each this}}
## `{{name}}` {{#each badges}}{{this}} {{/each}}
{{#since}}
_<sup>Since: {{this}}</sup>_
{{/since}}

{{description}}

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each params}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^params}}
*No input parameters.*
{{/params}}

{{#returns}}
### Results
**Type:** {{type}}

{{description}}
{{/returns}}

{{#hasExamples}}
### Examples
{{#each examples}}
{{this}}
{{/each}}
{{/hasExamples}}

{{/each}}
-->

***

# Connection Manager

<!-- AUTO-CONTENT-START:CONNECTIONMANAGER -->
## `connections` 

List of connections registered in this connection manager.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
*No input parameters.*

### Results
**Type:** `Array.<DataSource>`

- List of connections


## `has` 

Checks if connection with the given name exist in the manager.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `name` | `string` | **required** | Connection name |

### Results
**Type:** `boolean`

- True if connection exist, false otherwise


## `get` 

Gets registered connection with the given name.
If connection name is not given then it will get a default connection.
Throws error if connection with the given name was not found.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `name` | `string` | `"default"` | Connection name |

### Results
**Type:** `DataSource`

- Connection


## `remove` 

Removes registered connection with the given name.
If connection name is not given then it will get a default connection.
Throws error if connection with the given name was not found.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `name` | `string` | `"default"` | Connection name |



## `close` 

closes registered connection with the given name and removes it from
ConnectionManager.
If connection name is not given then it will get a default connection.
Throws error if connection with the given name was not found.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `name` | `string`, `Array.<string>` | `"default"` | Connection name |



## `create` 

Creates a new connection based on the given connection options and registers it in the manager.
Connection won't be established, you'll need to manually call connect method to establish connection.

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `options` | `Object` | **required** | Mikro-ORM data source connection options |
| `newConnection` | `boolean` | `false` | Toggle to create a new instance of MikroORMDbAdapter. |

### Results
**Type:** `Promise.<connection>`

- Connection


<!-- AUTO-CONTENT-END:CONNECTIONMANAGER -->

<!-- AUTO-CONTENT-TEMPLATE:CONNECTIONMANAGER
{{#each this}}
## `{{name}}` {{#each badges}}{{this}} {{/each}}
{{#since}}
_<sup>Since: {{this}}</sup>_
{{/since}}

{{description}}

### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
{{#each params}}
| `{{name}}` | {{type}} | {{defaultValue}} | {{description}} |
{{/each}}
{{^params}}
*No input parameters.*
{{/params}}

{{#returns}}
### Results
**Type:** {{type}}

{{description}}
{{/returns}}

{{#hasExamples}}
### Examples
{{#each examples}}
{{this}}
{{/each}}
{{/hasExamples}}

{{/each}}
-->



## Contribution
Please send pull requests improving the usage and fixing bugs, improving documentation and providing better examples, or providing some testing, because these things are important.

## License
The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact
Copyright (c) 2023 Tyr Soluitons

[![@MoleculerJS](https://img.shields.io/badge/github-moleculerjs-green.svg)](https://github.com/moleculerjs) [![@MoleculerJS](https://img.shields.io/badge/twitter-MoleculerJS-blue.svg)](https://twitter.com/MoleculerJS)
