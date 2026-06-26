import { Router } from "express";

import { requireAuth } from "../auth/auth.middleware.js";

import {
  createPrepWorkspaceSchema,
  updatePrepWorkspaceStatusSchema,
  updatePrepWorkspaceProgressSchema,
} from "./prepWorkspace.schemas.js";

import { prepWorkspaceService } from "./prepWorkspace.service.js";

const router = Router();

router.post(
  "/workspaces",
  requireAuth,
  async (req, res, next) => {
    try {
      const body =
        createPrepWorkspaceSchema.parse(
          req.body
        );

      const workspace =
        await prepWorkspaceService.createWorkspace(
          req.user!.id,
          body.atsAnalysisId
        );

      res.status(201).json({
        success: true,
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/workspaces",
  requireAuth,
  async (req, res, next) => {
    try {
      const workspaces =
        await prepWorkspaceService.listWorkspaces(
          req.user!.id
        );

      res.json({
        success: true,
        data: workspaces,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/workspaces/:workspaceId",
  requireAuth,
  async (req, res, next) => {
    try {
      const workspace =
        await prepWorkspaceService.getWorkspace(
          req.user!.id,
          req.params.workspaceId!
        );

      res.json({
        success: true,
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/workspaces/:workspaceId/status",
  requireAuth,
  async (req, res, next) => {
    try {
      const body =
        updatePrepWorkspaceStatusSchema.parse(
          req.body
        );

      const workspace =
        await prepWorkspaceService.updateStatus(
          req.user!.id,
          req.params.workspaceId!,
          body.status
        );

      res.json({
        success: true,
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/workspaces/:workspaceId/progress",
  requireAuth,
  async (req, res, next) => {
    try {
      const body =
        updatePrepWorkspaceProgressSchema.parse(
          req.body
        );

      const workspace =
        await prepWorkspaceService.updateProgress(
          req.user!.id,
          req.params.workspaceId!,
          body
        );

      res.json({
        success: true,
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/workspaces/:workspaceId",
  requireAuth,
  async (req, res, next) => {
    try {
      const workspace =
        await prepWorkspaceService.deleteWorkspace(
          req.user!.id,
          req.params.workspaceId!
        );

      res.json({
        success: true,
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const prepWorkspaceRoutes = router;