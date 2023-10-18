# Quick Start

## Install

The quickest way to get started with moleculer-db-mikroorm-adapter is by installing it.

#### NPM
```
npm install @tyrsolutions/moleculer-db-mikroorm-adapter --save
```
#### Yarn
```
yarn add @tyrsolutions/moleculer-db-mikroorm-adapter
```
?> Moleculer-db is optional, though it's recomended so that this module will automaticallt start and stop with services. Without it you would need to code this yourself in service lifecycle started or stopped methods.

#### NPM
```
npm install moleculer-db --save
```
#### Yarn
```
yarn add moleculer-db
```
## Create your first connection
1. Add @tyrsolutions/moleculer-db-mikroorm-adapter to your project by importing or requiring it:

   ?> The below example is using moleculer-db, moleculer-decorators-extended, TypeScript, tsconfig-paths and the adapter paramater setting

   ```js
    import { Service } from '@ourparentcenter/moleculer-decorators-extended';
    import DbService from 'moleculer-db';
    import MikroORMDbAdapter from '@tyrsolutions/moleculer-db-mikroorm-adapter';
    import { UserEntity } from '@Entities';
    @Service({
        name: 'user',
        version: 1,
        mergeActions: true,
        adapter: new MikroORMDbAdapter({
            name: 'default',
            type: 'better-sqlite',
            dbName: `temp/dbname_user.db`,
            entities: [...entities],
            entitiesTs: [...entities],
            highlighter: new SqlHighlighter(),
            debug: true,
        }),

        mixins: [DbService],
        /**
        * Settings
        */
        settings: {
            // internal id to use
            idField: '_id',
            pageSize: 10,
            // Base path
            rest: '/',
            // Available fields in the responses
            fields: [
                '_id',
                'login',
                'firstName',
                'lastName',
                'email',
                'langKey',
                'roles',
                'verificationToken',
                'active',
                'createdBy._id',
                'createdBy.login',
                'createdBy.firstName',
                'createdBy.lastName',
                'name',
                'quantity',
                'price',
                'createdDate',
                'lastModifiedBy',
                'lastModifiedDate',
            ],
            // additional fields added to responses
            populates: {
                createdBy: {
                    action: 'v1.user.id',
                    params: { fields: ['id', 'login', 'firstName', 'lastName'] },
                    // params: { fields: 'login firstName lastName' },
                },
                lastModifiedBy: {
                    action: 'v1.user.id',
                    params: { fields: ['id', 'login', 'firstName', 'lastName'] },
                },
            },
        },
    })
   ```

   !> Note the `adapter:` field is used here. The datasource provided to `MikroORMDbAdapter()` must have the `entities:` (and possibly the `entitiesTs:`) attribute. If a name is not provided in the datasource then it will be given a name of `default`. Each conneciton has a unique name and an error will be thrown if a conneciton is being created that has a name already stored in connection manager. The `idField: '_id'` has been set for internal app entity ID usage, so any results from database will be altered to the specified ID automatically. This means that the `fields:` array must be set for the specified internal ID as well in order for the ID field to show in results.

2. Create your entity
   The example below is a user entity that relates to itself for `createdBy` and `lastModifiedBy` fields. *** Example only, not full code.

   baseEntityClass.ts
   ```js
    import { ManyToOne, PrimaryKey, Property, Ref, ref } from '@mikro-orm/core';
    import { v4 } from 'uuid';
    import { ObjectId } from 'mongodb';
    import { User } from './user.entity';

    export interface IBaseEntityClass {
        id?: ObjectId | string;
        createdBy?: any;
        createdDate?: Date | null;
        lastModifiedBy?: any;
        lastModifiedDate?: Date | null;
        deletedDate?: Date | null;
    }

    export abstract class BaseEntityClass {
        @PrimaryKey()
        public id?: ObjectId | string = v4();
        @ManyToOne({
            entity: () => User,
            fieldName: 'createdBy',
            ref: true,
            // cascade: [Cascade.ALL],
            nullable: true,
            eager: true,
        })
        public createdBy?: Ref<User>;

        @Property({ columnType: 'datetime', fieldName: 'createdDate' })
        public createdDate?: Date = new Date();

        @ManyToOne({
            entity: () => User,
            fieldName: 'lastModifiedBy',
            ref: true,
            // cascade: [Cascade.ALL],
            nullable: true,
            eager: true,
        })
        public lastModifiedBy?: Ref<User>;

        @Property({ columnType: 'datetime', fieldName: 'lastModifiedDate', nullable: true })
        public lastModifiedDate?: Date = new Date();

        @Property({ fieldName: 'deletedDate', nullable: true })
        public deletedDate?: Date;

        public constructor(createdBy: User, lastModifiedBy: User) {
            this.createdBy = ref(createdBy);
            this.lastModifiedBy = ref(lastModifiedBy);
        }
    }
   ```

   profile.entity.ts
   ```js
    import { Entity, Property } from '@mikro-orm/core';
    import { ObjectId } from 'mongodb';
    import { IProfileBase } from '../types';
    import { User } from './user.entity';
    import { BaseEntityClass } from './baseEntityClass';

    export interface IProfile extends IProfileBase {
        id?: ObjectId | string;
    }

    @Entity({ tableName: 'profile' })
    export class Profile extends BaseEntityClass implements IProfile {
        @Property({ fieldName: 'profileImage' })
        public profileImage?: string;

        @Property({ columnType: 'array', fieldName: 'socialMedaiLinks' })
        public socialMedaiLinks?: string[];

        @Property({ fieldName: 'bio' })
        public bio?: string;

        @Property({ columnType: 'array', fieldName: 'interests', nullable: true })
        public interests?: string[];

        public location?: string;

        public birthDate?: Date;

        public availability? = '';

        @Property({ columnType: 'array', fieldName: 'imagery', nullable: true })
        public imagery?: string[];

        @Property({ fieldName: 'active', type: 'boolean', default: false })
        public active?: boolean;

        public constructor(createdBy: User, lastModifiedBy: User) {
            super(createdBy, lastModifiedBy);
        }
    }
   ```

   user.entity.ts
   ```js
    import {
        BeforeCreate,
        Cascade,
        Entity,
        Enum,
        Index,
        OneToOne,
        Property,
        Ref,
        ref,
    } from '@mikro-orm/core';
    import { ObjectId } from 'mongodb';
    import { IUserBase, UserLang, UserRoleDefault } from '../types';
    import { Profile } from './profile.entity';
    import { BaseEntityClass } from './baseEntityClass';

    export interface IUser extends IUserBase {
        id?: ObjectId | string;
        password?: string;
        verificationToken?: string;
    }

    @JsonObject('User')
    @Entity({ tableName: 'users' })
    @Index({
        properties: ['login', 'email', 'verificationToken'],
    })
    export class User extends BaseEntityClass implements IUser {
        @Property({ fieldName: 'login', unique: true })
        public login?: string;

        @Property({ fieldName: 'password' })
        public password?: string;

        @Property({ fieldName: 'firstName' })
        public firstName?: string;

        @Property({ fieldName: 'lastName' })
        public lastName?: string;

        @Property({ fieldName: 'fullName' })
        public fullName?: string;

        @Property({ fieldName: 'email', unique: true })
        public email?: string;

        @Enum({ fieldName: 'langKey', items: () => UserLang })
        public langKey?: UserLang = UserLang.ENUS;

        @Enum({
            fieldName: 'roles',
            type: 'ArrayType',
            items: () => UserRoleDefault,
            array: true,
            default: [UserRoleDefault.USER],
        })
        public roles?: UserRoleDefault[] = [UserRoleDefault.USER];

        @Property({ fieldName: 'verificationToken', nullable: true })
        public verificationToken?: string;

        @Property({ fieldName: 'active', type: 'boolean', default: false })
        public active?: boolean;

        @OneToOne(() => Profile, {
            fieldName: 'profile',
            ref: true,
            nullable: true,
            owner: true,
            orphanRemoval: true,
            cascade: [Cascade.ALL],
            eager: true,
        })
        public profile?: Profile;
        // public profile?: Ref<Profile>;

        public constructor(/* profile: Profile, */ createdBy: User, lastModifiedBy: User) {
            super(createdBy, lastModifiedBy);
            // this.createdBy = ref(createdBy);
            // this.lastModifiedBy = ref(lastModifiedBy);
            // this.profile = ref(profile);
        }

        @BeforeCreate()
        public async doStuffBeforeCreate() {
            if (!this.fullName) {
                this.fullName = `${this.firstName} ${this.lastName}`;
            }
        }
    }

   ```

3. Use the adapter as you would any other moleculer adapter in a service.
   
   ```js
   this.adapter.find('JohnDoe')
   ```
