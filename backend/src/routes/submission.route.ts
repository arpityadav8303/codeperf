import { Router } from "express";
import submissionController from "../controllers/Submission.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

// Create a new submission
router.get("/get-all-Submissions", authenticate, (req,res)=> submissionController.getAllSubmissionsOfUser(req,res))
router.post("/create-submission",  authenticate,  rateLimiter.limit({ limit: 5, windowSeconds: 60 }), (req, res) => submissionController.createSubmission(req, res));
router.get("/get-submission-review/:id",  authenticate,(req,res,next)=>submissionController.getSubmissionReview(req,res,next));
// Get basic submission details
router.get("/get-submission-by-id/:id", authenticate, rateLimiter.limit({ limit: 10, windowSeconds: 60 }), (req, res) => submissionController.getSubmission(req, res));
// Get submission WITH benchmark data (Specific Path)
router.get("/get-Submission-With-Benchmark/:id", authenticate, rateLimiter.limit({ limit: 100, windowSeconds: 60 }), (req, res) => submissionController.getSubmissionWithBenchmark(req, res));


export default router;