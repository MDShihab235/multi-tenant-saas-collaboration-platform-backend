// ============================================================
//  Project Module — Routes
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Base    : /api/v1/projects
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ProjectController } from "./project.controller";
import { ProjectValidation } from "./project.validation";

const router = Router();

// 1. Create a new project inside an organization
router.post(
  "/:orgId",
  checkAuth(),
  validateRequest(ProjectValidation.createProjectSchema),
  ProjectController.createProject,
);

// 2. List all projects for an org (paginated, filterable)
router.get("/:orgId", checkAuth(), ProjectController.getOrgProjects);

// 3. All projects the current user is a member of
router.get("/my-projects", checkAuth(), ProjectController.getMyProjects);

// 4. Get project details
router.get(
  "/:orgId/:projectId",
  checkAuth(),
  ProjectController.getProjectDetails,
);

// 5. Update project name or description
router.patch(
  "/:orgId/:projectId",
  checkAuth(),
  validateRequest(ProjectValidation.updateProjectSchema),
  ProjectController.updateProject,
);

// 6. Delete project
router.delete(
  "/:orgId/:projectId",
  checkAuth(),
  ProjectController.deleteProject,
);

// 7. Project stats: tasks by status, open vs closed
router.get(
  "/:orgId/:projectId/stats",
  checkAuth(),
  ProjectController.getProjectStats,
);

export const ProjectRoutes = router;
