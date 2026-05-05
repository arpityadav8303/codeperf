import { Router } from "express";
import submissionController from "../controllers/submission.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

// Create a new submission
router.get("/allSubmissions", authenticate, (req,res)=> submissionController.getAllSubmissionsOfUser(req,res))
router.post("/", 
    authenticate, 
    rateLimiter.limit({ limit: 5, windowSeconds: 60 }), 
    (req, res) => submissionController.createSubmission(req, res)
);

router.get("/:id/review",  authenticate,(req,res,next)=>submissionController.getSubmissionReview(req,res,next));

// Get basic submission details
router.get("/:id", 
    authenticate, 
    rateLimiter.limit({ limit: 10, windowSeconds: 60 }), 
    (req, res) => submissionController.getSubmission(req, res)
);

// Get submission WITH benchmark data (Specific Path)
router.get("/:id/benchmark", 
    authenticate, 
    rateLimiter.limit({ limit: 10, windowSeconds: 60 }), 
    (req, res) => submissionController.getSubmissionWithBenchmark(req, res)
);


export default router;