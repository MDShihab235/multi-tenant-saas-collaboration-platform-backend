// ============================================================
//  ApiKey Module — Routes
//  Base    : /api/v1/api-keys
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ApiKeyController } from "./apiKey.controller";
import { ApiKeyValidation } from "./apiKey.validation";

const router = Router();

// 1. Generate a new API key — returns full key once only
router.post(
  "/:orgId",
  checkAuth(),
  validateRequest(ApiKeyValidation.createApiKeySchema),
  ApiKeyController.createApiKey,
);

// 2. List all keys for an org — prefix only, never full hash
router.get("/:orgId", checkAuth(), ApiKeyController.getOrgApiKeys);

// 3. Get API key metadata (name, prefix, expiry, lastUsedAt)
router.get("/:orgId/:keyId", checkAuth(), ApiKeyController.getApiKeyDetails);

// 4. Update API key name or expiry date
router.patch(
  "/:orgId/:keyId",
  checkAuth(),
  validateRequest(ApiKeyValidation.updateApiKeySchema),
  ApiKeyController.updateApiKey,
);

// 5. Rotate key: invalidate old, issue new — returns new key
router.patch(
  "/:orgId/:keyId/rotate",
  checkAuth(),
  ApiKeyController.rotateApiKey,
);

// 6. Revoke and permanently delete an API key
router.delete("/:orgId/:keyId", checkAuth(), ApiKeyController.deleteApiKey);

export const ApiKeyRoutes = router;
