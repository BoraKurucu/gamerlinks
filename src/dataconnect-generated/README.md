# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUserLinks*](#getuserlinks)
- [**Mutations**](#mutations)
  - [*CreateNewUser*](#createnewuser)
  - [*CreateNewLink*](#createnewlink)
  - [*UpdateLinkOrderIndex*](#updatelinkorderindex)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUserLinks
You can execute the `GetUserLinks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserLinks(vars: GetUserLinksVariables): QueryPromise<GetUserLinksData, GetUserLinksVariables>;

interface GetUserLinksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserLinksVariables): QueryRef<GetUserLinksData, GetUserLinksVariables>;
}
export const getUserLinksRef: GetUserLinksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserLinks(dc: DataConnect, vars: GetUserLinksVariables): QueryPromise<GetUserLinksData, GetUserLinksVariables>;

interface GetUserLinksRef {
  ...
  (dc: DataConnect, vars: GetUserLinksVariables): QueryRef<GetUserLinksData, GetUserLinksVariables>;
}
export const getUserLinksRef: GetUserLinksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserLinksRef:
```typescript
const name = getUserLinksRef.operationName;
console.log(name);
```

### Variables
The `GetUserLinks` query requires an argument of type `GetUserLinksVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserLinksVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserLinks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserLinksData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserLinksData {
  links: ({
    id: UUIDString;
    title: string;
    url: string;
    description?: string | null;
    iconUrl?: string | null;
    orderIndex?: number | null;
    category?: {
      id: UUIDString;
      name: string;
    } & Category_Key;
  } & Link_Key)[];
}
```
### Using `GetUserLinks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserLinks, GetUserLinksVariables } from '@dataconnect/generated';

// The `GetUserLinks` query requires an argument of type `GetUserLinksVariables`:
const getUserLinksVars: GetUserLinksVariables = {
  userId: ..., 
};

// Call the `getUserLinks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserLinks(getUserLinksVars);
// Variables can be defined inline as well.
const { data } = await getUserLinks({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserLinks(dataConnect, getUserLinksVars);

console.log(data.links);

// Or, you can use the `Promise` API.
getUserLinks(getUserLinksVars).then((response) => {
  const data = response.data;
  console.log(data.links);
});
```

### Using `GetUserLinks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserLinksRef, GetUserLinksVariables } from '@dataconnect/generated';

// The `GetUserLinks` query requires an argument of type `GetUserLinksVariables`:
const getUserLinksVars: GetUserLinksVariables = {
  userId: ..., 
};

// Call the `getUserLinksRef()` function to get a reference to the query.
const ref = getUserLinksRef(getUserLinksVars);
// Variables can be defined inline as well.
const ref = getUserLinksRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserLinksRef(dataConnect, getUserLinksVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.links);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.links);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewUser
You can execute the `CreateNewUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewUser(vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface CreateNewUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
}
export const createNewUserRef: CreateNewUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewUser(dc: DataConnect, vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface CreateNewUserRef {
  ...
  (dc: DataConnect, vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
}
export const createNewUserRef: CreateNewUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewUserRef:
```typescript
const name = createNewUserRef.operationName;
console.log(name);
```

### Variables
The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewUserVariables {
  email: string;
  username: string;
}
```
### Return Type
Recall that executing the `CreateNewUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewUserData {
  user_insert: User_Key;
}
```
### Using `CreateNewUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewUser, CreateNewUserVariables } from '@dataconnect/generated';

// The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`:
const createNewUserVars: CreateNewUserVariables = {
  email: ..., 
  username: ..., 
};

// Call the `createNewUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewUser(createNewUserVars);
// Variables can be defined inline as well.
const { data } = await createNewUser({ email: ..., username: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewUser(dataConnect, createNewUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createNewUser(createNewUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateNewUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewUserRef, CreateNewUserVariables } from '@dataconnect/generated';

// The `CreateNewUser` mutation requires an argument of type `CreateNewUserVariables`:
const createNewUserVars: CreateNewUserVariables = {
  email: ..., 
  username: ..., 
};

// Call the `createNewUserRef()` function to get a reference to the mutation.
const ref = createNewUserRef(createNewUserVars);
// Variables can be defined inline as well.
const ref = createNewUserRef({ email: ..., username: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewUserRef(dataConnect, createNewUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateNewLink
You can execute the `CreateNewLink` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewLink(vars: CreateNewLinkVariables): MutationPromise<CreateNewLinkData, CreateNewLinkVariables>;

interface CreateNewLinkRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewLinkVariables): MutationRef<CreateNewLinkData, CreateNewLinkVariables>;
}
export const createNewLinkRef: CreateNewLinkRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewLink(dc: DataConnect, vars: CreateNewLinkVariables): MutationPromise<CreateNewLinkData, CreateNewLinkVariables>;

interface CreateNewLinkRef {
  ...
  (dc: DataConnect, vars: CreateNewLinkVariables): MutationRef<CreateNewLinkData, CreateNewLinkVariables>;
}
export const createNewLinkRef: CreateNewLinkRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewLinkRef:
```typescript
const name = createNewLinkRef.operationName;
console.log(name);
```

### Variables
The `CreateNewLink` mutation requires an argument of type `CreateNewLinkVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewLinkVariables {
  title: string;
  url: string;
  userId: UUIDString;
  categoryId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `CreateNewLink` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewLinkData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewLinkData {
  link_insert: Link_Key;
}
```
### Using `CreateNewLink`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewLink, CreateNewLinkVariables } from '@dataconnect/generated';

// The `CreateNewLink` mutation requires an argument of type `CreateNewLinkVariables`:
const createNewLinkVars: CreateNewLinkVariables = {
  title: ..., 
  url: ..., 
  userId: ..., 
  categoryId: ..., // optional
};

// Call the `createNewLink()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewLink(createNewLinkVars);
// Variables can be defined inline as well.
const { data } = await createNewLink({ title: ..., url: ..., userId: ..., categoryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewLink(dataConnect, createNewLinkVars);

console.log(data.link_insert);

// Or, you can use the `Promise` API.
createNewLink(createNewLinkVars).then((response) => {
  const data = response.data;
  console.log(data.link_insert);
});
```

### Using `CreateNewLink`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewLinkRef, CreateNewLinkVariables } from '@dataconnect/generated';

// The `CreateNewLink` mutation requires an argument of type `CreateNewLinkVariables`:
const createNewLinkVars: CreateNewLinkVariables = {
  title: ..., 
  url: ..., 
  userId: ..., 
  categoryId: ..., // optional
};

// Call the `createNewLinkRef()` function to get a reference to the mutation.
const ref = createNewLinkRef(createNewLinkVars);
// Variables can be defined inline as well.
const ref = createNewLinkRef({ title: ..., url: ..., userId: ..., categoryId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewLinkRef(dataConnect, createNewLinkVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.link_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.link_insert);
});
```

## UpdateLinkOrderIndex
You can execute the `UpdateLinkOrderIndex` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateLinkOrderIndex(vars: UpdateLinkOrderIndexVariables): MutationPromise<UpdateLinkOrderIndexData, UpdateLinkOrderIndexVariables>;

interface UpdateLinkOrderIndexRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLinkOrderIndexVariables): MutationRef<UpdateLinkOrderIndexData, UpdateLinkOrderIndexVariables>;
}
export const updateLinkOrderIndexRef: UpdateLinkOrderIndexRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateLinkOrderIndex(dc: DataConnect, vars: UpdateLinkOrderIndexVariables): MutationPromise<UpdateLinkOrderIndexData, UpdateLinkOrderIndexVariables>;

interface UpdateLinkOrderIndexRef {
  ...
  (dc: DataConnect, vars: UpdateLinkOrderIndexVariables): MutationRef<UpdateLinkOrderIndexData, UpdateLinkOrderIndexVariables>;
}
export const updateLinkOrderIndexRef: UpdateLinkOrderIndexRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateLinkOrderIndexRef:
```typescript
const name = updateLinkOrderIndexRef.operationName;
console.log(name);
```

### Variables
The `UpdateLinkOrderIndex` mutation requires an argument of type `UpdateLinkOrderIndexVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateLinkOrderIndexVariables {
  id: UUIDString;
  orderIndex: number;
}
```
### Return Type
Recall that executing the `UpdateLinkOrderIndex` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateLinkOrderIndexData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateLinkOrderIndexData {
  link_update?: Link_Key | null;
}
```
### Using `UpdateLinkOrderIndex`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateLinkOrderIndex, UpdateLinkOrderIndexVariables } from '@dataconnect/generated';

// The `UpdateLinkOrderIndex` mutation requires an argument of type `UpdateLinkOrderIndexVariables`:
const updateLinkOrderIndexVars: UpdateLinkOrderIndexVariables = {
  id: ..., 
  orderIndex: ..., 
};

// Call the `updateLinkOrderIndex()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateLinkOrderIndex(updateLinkOrderIndexVars);
// Variables can be defined inline as well.
const { data } = await updateLinkOrderIndex({ id: ..., orderIndex: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateLinkOrderIndex(dataConnect, updateLinkOrderIndexVars);

console.log(data.link_update);

// Or, you can use the `Promise` API.
updateLinkOrderIndex(updateLinkOrderIndexVars).then((response) => {
  const data = response.data;
  console.log(data.link_update);
});
```

### Using `UpdateLinkOrderIndex`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateLinkOrderIndexRef, UpdateLinkOrderIndexVariables } from '@dataconnect/generated';

// The `UpdateLinkOrderIndex` mutation requires an argument of type `UpdateLinkOrderIndexVariables`:
const updateLinkOrderIndexVars: UpdateLinkOrderIndexVariables = {
  id: ..., 
  orderIndex: ..., 
};

// Call the `updateLinkOrderIndexRef()` function to get a reference to the mutation.
const ref = updateLinkOrderIndexRef(updateLinkOrderIndexVars);
// Variables can be defined inline as well.
const ref = updateLinkOrderIndexRef({ id: ..., orderIndex: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateLinkOrderIndexRef(dataConnect, updateLinkOrderIndexVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.link_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.link_update);
});
```

