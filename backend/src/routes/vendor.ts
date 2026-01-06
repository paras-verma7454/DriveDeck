import { Router } from "express";
import { addCar, getVendorCars, updateCar, deleteCar } from "../controllers/car.js";
import { authMiddleware, hasPermission } from "../Middleware.js"; // New import

const vendorRouter = Router();

vendorRouter.post("/add-car", authMiddleware, hasPermission(["cars.create"]), addCar);
vendorRouter.get("/cars/:vendorId", authMiddleware, hasPermission(["cars.view"]), getVendorCars); // Assuming 'cars.view' for viewing own cars
vendorRouter.put("/car/:id", authMiddleware, hasPermission(["cars.edit"]), updateCar);
vendorRouter.delete("/car/:id", authMiddleware, hasPermission(["cars.delete"]), deleteCar);
// vendorRouter.get("/cars", getAllCars);


export default vendorRouter;
