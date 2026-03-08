const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'gamerlinks',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createNewUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewUser', inputVars);
}
createNewUserRef.operationName = 'CreateNewUser';
exports.createNewUserRef = createNewUserRef;

exports.createNewUser = function createNewUser(dcOrVars, vars) {
  return executeMutation(createNewUserRef(dcOrVars, vars));
};

const getUserLinksRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserLinks', inputVars);
}
getUserLinksRef.operationName = 'GetUserLinks';
exports.getUserLinksRef = getUserLinksRef;

exports.getUserLinks = function getUserLinks(dcOrVars, vars) {
  return executeQuery(getUserLinksRef(dcOrVars, vars));
};

const createNewLinkRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewLink', inputVars);
}
createNewLinkRef.operationName = 'CreateNewLink';
exports.createNewLinkRef = createNewLinkRef;

exports.createNewLink = function createNewLink(dcOrVars, vars) {
  return executeMutation(createNewLinkRef(dcOrVars, vars));
};

const updateLinkOrderIndexRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateLinkOrderIndex', inputVars);
}
updateLinkOrderIndexRef.operationName = 'UpdateLinkOrderIndex';
exports.updateLinkOrderIndexRef = updateLinkOrderIndexRef;

exports.updateLinkOrderIndex = function updateLinkOrderIndex(dcOrVars, vars) {
  return executeMutation(updateLinkOrderIndexRef(dcOrVars, vars));
};
