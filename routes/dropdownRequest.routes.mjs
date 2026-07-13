import { Router } from "express";

import authMiddleware
from "../middlewares/middlewares.auth.mjs";

import {

createDropdownRequest,

getMyDropdownRequests,

getPendingDropdownRequests,

approveDropdownRequest,

rejectDropdownRequest,

}
from "../controllers/dropdownRequest.controller.mjs";

const router=Router();


router.post(
    "/",
    createDropdownRequest
);

router.get(
    "/my",
    getMyDropdownRequests
);

router.get(
    "/pending",
    getPendingDropdownRequests
);

router.put(
    "/:id/approve",
    approveDropdownRequest
);

router.put(
    "/:id/reject",
    rejectDropdownRequest
);

export default router;