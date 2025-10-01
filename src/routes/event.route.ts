import { Router } from "express";
import EventController from "../controller/event.controller.js";
import { verifyJwt } from "../middleware/auth.jwt.js";
const router = Router();

const eventController = new EventController()


router.post("/createEvent",verifyJwt, eventController.createEvent.bind(eventController));
router.get("/getAllEvents",verifyJwt, eventController.getAllEvents.bind(eventController));
router.get("/getMyEvents",verifyJwt, eventController.getMyEvents.bind(eventController));
router.get("/getEventById/:eventId",verifyJwt, eventController.getEventById.bind(eventController));
router.put("/updateEvent/:eventId",verifyJwt, eventController.updateEvent.bind(eventController));
router.delete("/deleteEvent/:eventId",verifyJwt, eventController.deleteEvent.bind(eventController));

export const eventRoutes = router;