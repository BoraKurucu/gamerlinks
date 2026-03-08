import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateNewLinkData {
  link_insert: Link_Key;
}

export interface CreateNewLinkVariables {
  title: string;
  url: string;
  userId: UUIDString;
  categoryId?: UUIDString | null;
}

export interface CreateNewUserData {
  user_insert: User_Key;
}

export interface CreateNewUserVariables {
  email: string;
  username: string;
}

export interface FeaturedGame_Key {
  userId: UUIDString;
  gameId: UUIDString;
  __typename?: 'FeaturedGame_Key';
}

export interface Game_Key {
  id: UUIDString;
  __typename?: 'Game_Key';
}

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

export interface GetUserLinksVariables {
  userId: UUIDString;
}

export interface Link_Key {
  id: UUIDString;
  __typename?: 'Link_Key';
}

export interface UpdateLinkOrderIndexData {
  link_update?: Link_Key | null;
}

export interface UpdateLinkOrderIndexVariables {
  id: UUIDString;
  orderIndex: number;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  operationName: string;
}
export const createNewUserRef: CreateNewUserRef;

export function createNewUser(vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;
export function createNewUser(dc: DataConnect, vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface GetUserLinksRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserLinksVariables): QueryRef<GetUserLinksData, GetUserLinksVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserLinksVariables): QueryRef<GetUserLinksData, GetUserLinksVariables>;
  operationName: string;
}
export const getUserLinksRef: GetUserLinksRef;

export function getUserLinks(vars: GetUserLinksVariables): QueryPromise<GetUserLinksData, GetUserLinksVariables>;
export function getUserLinks(dc: DataConnect, vars: GetUserLinksVariables): QueryPromise<GetUserLinksData, GetUserLinksVariables>;

interface CreateNewLinkRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewLinkVariables): MutationRef<CreateNewLinkData, CreateNewLinkVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewLinkVariables): MutationRef<CreateNewLinkData, CreateNewLinkVariables>;
  operationName: string;
}
export const createNewLinkRef: CreateNewLinkRef;

export function createNewLink(vars: CreateNewLinkVariables): MutationPromise<CreateNewLinkData, CreateNewLinkVariables>;
export function createNewLink(dc: DataConnect, vars: CreateNewLinkVariables): MutationPromise<CreateNewLinkData, CreateNewLinkVariables>;

interface UpdateLinkOrderIndexRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateLinkOrderIndexVariables): MutationRef<UpdateLinkOrderIndexData, UpdateLinkOrderIndexVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateLinkOrderIndexVariables): MutationRef<UpdateLinkOrderIndexData, UpdateLinkOrderIndexVariables>;
  operationName: string;
}
export const updateLinkOrderIndexRef: UpdateLinkOrderIndexRef;

export function updateLinkOrderIndex(vars: UpdateLinkOrderIndexVariables): MutationPromise<UpdateLinkOrderIndexData, UpdateLinkOrderIndexVariables>;
export function updateLinkOrderIndex(dc: DataConnect, vars: UpdateLinkOrderIndexVariables): MutationPromise<UpdateLinkOrderIndexData, UpdateLinkOrderIndexVariables>;

