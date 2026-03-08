/**
 * Firebase Cloud Functions
 */

import { setGlobalOptions } from "firebase-functions";
setGlobalOptions({ maxInstances: 10 });

// Export Genkit functions
export * from "./genkit-sample";

// Export Lemon Squeezy webhook handler (file missing)
// export { lemonsqueezyWebhook } from "./lemonsqueezyWebhook";
