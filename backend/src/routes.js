const express = require("express");
const multer = require("multer");
const uploadConfig = require("./config/upload");

const SessionController = require("./controllers/SessionController");
const SpotController = require("./controllers/SpotController");
const DashboardController = require("./controllers/DashboardController");
const BookingController = require("./controllers/BookingController");
const ApprovalController = require("./controllers/ApprovalController");
const RejectionController = require("./controllers/RejectionController");

const routes = express.Router();
const upload = multer(uploadConfig);

routes.post("/sessions", SessionController.store);

routes.get("/spots", SpotController.index); // Vai buscar a tecnologia passada por parametro da url. http://localhost:3333/spots?tech=ReactJS
routes.post("/spots", upload.single("thumbnail"), SpotController.store); // Um unico arquivo, e thumbnail eh o campo que recebe a imagem.

routes.get("/dashboard", DashboardController.show);

routes.post("/spots/:spot_id/bookings", BookingController.store);

routes.post("/bookings/:booking_id/approvals", ApprovalController.store); // Vai na pagina de bookings, pegar o id da reserva e vai aprovar
routes.post("/bookings/:booking_id/rejections", RejectionController.store); // Vai na pagina de bookings, pegar o id da reserva e vai rejeitar

module.exports = routes;
