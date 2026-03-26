import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ActivityLogController } from "./activityLog.controller";
import { ActivityLogValidation } from "./activityLog.validation";
// import { ProjectMemberRole } from "../../../generated/prisma";

const router = Router();

// 1. List activity logs (paginated)
router.get("/:orgId", checkAuth(), ActivityLogController.getOrgLogs);

// 2. Filter logs by actor, action, or date
router.get(
  "/:orgId/filter",
  checkAuth(),
  validateRequest(ActivityLogValidation.filterLogsSchema),
  ActivityLogController.filterLogs,
);

// 3. Get specific log detail
router.get("/:orgId/:logId", checkAuth(), ActivityLogController.getLogById);

// 4. Purge logs (Owner only)
router.delete(
  "/:orgId/purge",
  checkAuth(), // Further role check handled in service/controller
  validateRequest(ActivityLogValidation.purgeLogsSchema),
  ActivityLogController.purgeLogs,
);

export const ActivityLogRoutes = router;
