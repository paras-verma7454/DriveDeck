import { Router } from "express";
import { addCar, getVendorCars, updateCar, deleteCar } from "../controllers/car.js";

const vendorRouter = Router();



vendorRouter.post("/add-car", addCar);
vendorRouter.get("/cars/:vendorId", getVendorCars);
vendorRouter.put("/car/:id", updateCar);
vendorRouter.delete("/car/:id", deleteCar);
// vendorRouter.get("/cars", getAllCars);


export default vendorRouter;
