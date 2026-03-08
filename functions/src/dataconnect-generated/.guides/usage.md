# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createNewUser, getUserLinks, createNewLink, updateLinkOrderIndex } from '@dataconnect/generated';


// Operation CreateNewUser:  For variables, look at type CreateNewUserVars in ../index.d.ts
const { data } = await CreateNewUser(dataConnect, createNewUserVars);

// Operation GetUserLinks:  For variables, look at type GetUserLinksVars in ../index.d.ts
const { data } = await GetUserLinks(dataConnect, getUserLinksVars);

// Operation CreateNewLink:  For variables, look at type CreateNewLinkVars in ../index.d.ts
const { data } = await CreateNewLink(dataConnect, createNewLinkVars);

// Operation UpdateLinkOrderIndex:  For variables, look at type UpdateLinkOrderIndexVars in ../index.d.ts
const { data } = await UpdateLinkOrderIndex(dataConnect, updateLinkOrderIndexVars);


```