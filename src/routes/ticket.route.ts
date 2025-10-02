import { Router } from "express";
import TicketController from "../controller/ticket.controller.js";
import { verifyJwt } from "../middleware/auth.jwt.js";
const router = Router();

const ticketController = new TicketController()


router.post("/bookTicket",verifyJwt, ticketController.bookTicket.bind(ticketController));
router.get("/getMyTicket/:userId", verifyJwt, ticketController.getMyTickets.bind(ticketController));
router.delete("/cancelTicket/:ticketId", verifyJwt, ticketController.cancelTicket.bind(ticketController));



export const ticketRoutes = router;



