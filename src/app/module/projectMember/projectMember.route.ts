import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ProjectMemberController } from "./projectMember.controller";
import { ProjectMemberValidation } from "./projectMember.validation";

const router = Router();

// 1. List all members in a project
router.get(
  "/:projectId",
  checkAuth(),
  ProjectMemberController.getProjectMembers,
);

// 2. Add an org member to the project
router.post(
  "/:projectId",
  checkAuth(),
  validateRequest(ProjectMemberValidation.addMemberSchema),
  ProjectMemberController.addMemberToProject,
);

// 3. Change a member's role
router.patch(
  "/:projectId/:userId",
  checkAuth(),
  validateRequest(ProjectMemberValidation.updateRoleSchema),
  ProjectMemberController.updateMemberRole,
);

// 4. Remove a member from the project
router.delete(
  "/:projectId/:userId",
  checkAuth(),
  ProjectMemberController.removeMember,
);

// 5. Current user leaves the project
router.delete(
  "/:projectId/leave",
  checkAuth(),
  ProjectMemberController.leaveProject,
);

export const ProjectMemberRoutes = router;
