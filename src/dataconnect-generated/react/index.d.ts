import { CreateNewUserData, CreateNewUserVariables, GetUserLinksData, GetUserLinksVariables, CreateNewLinkData, CreateNewLinkVariables, UpdateLinkOrderIndexData, UpdateLinkOrderIndexVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewUser(options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;
export function useCreateNewUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;

export function useGetUserLinks(vars: GetUserLinksVariables, options?: useDataConnectQueryOptions<GetUserLinksData>): UseDataConnectQueryResult<GetUserLinksData, GetUserLinksVariables>;
export function useGetUserLinks(dc: DataConnect, vars: GetUserLinksVariables, options?: useDataConnectQueryOptions<GetUserLinksData>): UseDataConnectQueryResult<GetUserLinksData, GetUserLinksVariables>;

export function useCreateNewLink(options?: useDataConnectMutationOptions<CreateNewLinkData, FirebaseError, CreateNewLinkVariables>): UseDataConnectMutationResult<CreateNewLinkData, CreateNewLinkVariables>;
export function useCreateNewLink(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewLinkData, FirebaseError, CreateNewLinkVariables>): UseDataConnectMutationResult<CreateNewLinkData, CreateNewLinkVariables>;

export function useUpdateLinkOrderIndex(options?: useDataConnectMutationOptions<UpdateLinkOrderIndexData, FirebaseError, UpdateLinkOrderIndexVariables>): UseDataConnectMutationResult<UpdateLinkOrderIndexData, UpdateLinkOrderIndexVariables>;
export function useUpdateLinkOrderIndex(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateLinkOrderIndexData, FirebaseError, UpdateLinkOrderIndexVariables>): UseDataConnectMutationResult<UpdateLinkOrderIndexData, UpdateLinkOrderIndexVariables>;
