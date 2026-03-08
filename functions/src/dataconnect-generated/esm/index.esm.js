import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'gamerlinks',
  location: 'us-east4'
};

export const createNewUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewUser', inputVars);
}
createNewUserRef.operationName = 'CreateNewUser';

export function createNewUser(dcOrVars, vars) {
  return executeMutation(createNewUserRef(dcOrVars, vars));
}

export const getUserLinksRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserLinks', inputVars);
}
getUserLinksRef.operationName = 'GetUserLinks';

export function getUserLinks(dcOrVars, vars) {
  return executeQuery(getUserLinksRef(dcOrVars, vars));
}

export const createNewLinkRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewLink', inputVars);
}
createNewLinkRef.operationName = 'CreateNewLink';

export function createNewLink(dcOrVars, vars) {
  return executeMutation(createNewLinkRef(dcOrVars, vars));
}

export const updateLinkOrderIndexRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLinkOrderIndex', inputVars);
}
updateLinkOrderIndexRef.operationName = 'UpdateLinkOrderIndex';

export function updateLinkOrderIndex(dcOrVars, vars) {
  return executeMutation(updateLinkOrderIndexRef(dcOrVars, vars));
}

