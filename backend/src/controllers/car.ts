import type { Request, Response } from "express";
import { prisma } from "../client.js";
import { configDotenv } from "dotenv";
import jwt  from "jsonwebtoken";

configDotenv()
// const JWT_SECRET = process.env.JWT_SECRET as string;



export const addCar = async (req: Request, res: Response) => {
  try {
    const {
      title, brand, model, variant, year, registrationYear, vehicleType,
      price, discountPrice, isNegotiable, originalPrice,
      ownerNumber, registrationNumber, rcAvailable, insuranceType, insuranceValidity, pucValidTill, serviceHistoryAvailable,
      kmDriven, fuelType, transmission, engineCapacity, mileage, color, seatingCapacity, doors, topSpeed, accidental, floodDamage,
      features,
      sellerAddress,
      mainImage, images, videoUrl,
      status, featured, viewsCount,
      description
    } = req.body;
    let vendorId: string;
    try {
      const token = req.headers.authorization?.split(" ")[1] as string;
      // console.log(token);
      const vendor = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      // console.log(vendor);
      vendorId = vendor.userId;
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
    
    const car = await prisma.car.create({
      data: {
        title, brand, model, variant,
        year: Number(year),
        registrationYear: registrationYear ? Number(registrationYear) : null,
        vehicleType,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        isNegotiable: Boolean(isNegotiable),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        // ownerNumber: ownerNumber ? Number(ownerNumber) : null,
        // registrationNumber,
        rcAvailable: Boolean(rcAvailable),
        // insuranceType,
        insuranceValidity: insuranceValidity ? new Date(insuranceValidity) : null,
        pucValidTill: pucValidTill ? new Date(pucValidTill) : null,
        serviceHistoryAvailable: Boolean(serviceHistoryAvailable),
        kmDriven: kmDriven ? Number(kmDriven) : null,
        // fuelType,
        // transmission,
        // engineCapacity,
        // mileage: Number(mileage),
        // color,
        seatingCapacity: seatingCapacity ? Number(seatingCapacity) : null,
        doors: doors ? Number(doors) : null,
        topSpeed: topSpeed ? Number(topSpeed) : null,
        accidental: Boolean(accidental),
        floodDamage: Boolean(floodDamage),
        // features, // Assuming JSON is passed correctly
        // sellerAddress,
        // mainImage, images, videoUrl,
        // status,
        featured: Boolean(featured),
        viewsCount: viewsCount ? Number(viewsCount) : 0,
        // description,
        vendorId,
      },
    });

    res.status(201).json({ success: true, car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add car" });
  }
};

export const getVendorCars = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;

    const cars = await prisma.car.findMany({
      where: {
        vendorId: vendorId as string,
      },
    });
    // console.log("cars", cars);

    res.status(200).json({ success: true, cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch cars" });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Ensure numeric fields are converted
    if (data.year) data.year = Number(data.year);
    if (data.registrationYear) data.registrationYear = Number(data.registrationYear);
    if (data.price) data.price = Number(data.price);
    if (data.discountPrice) data.discountPrice = Number(data.discountPrice);
    if (data.originalPrice) data.originalPrice = Number(data.originalPrice);
    if (data.ownerNumber) data.ownerNumber = Number(data.ownerNumber);
    if (data.kmDriven) data.kmDriven = Number(data.kmDriven);
    if (data.mileage) data.mileage = Number(data.mileage);
    if (data.seatingCapacity) data.seatingCapacity = Number(data.seatingCapacity);
    if (data.doors) data.doors = Number(data.doors);
    if (data.topSpeed) data.topSpeed = Number(data.topSpeed);
    if (data.viewsCount) data.viewsCount = Number(data.viewsCount);
    if (data.engineCapacity) data.engineCapacity = data.engineCapacity.toString();

    // Ensure boolean fields are converted
    if (data.isNegotiable !== undefined) data.isNegotiable = Boolean(data.isNegotiable);
    if (data.rcAvailable !== undefined) data.rcAvailable = Boolean(data.rcAvailable);
    if (data.serviceHistoryAvailable !== undefined) data.serviceHistoryAvailable = Boolean(data.serviceHistoryAvailable);
    if (data.accidental !== undefined) data.accidental = Boolean(data.accidental);
    if (data.floodDamage !== undefined) data.floodDamage = Boolean(data.floodDamage);
    if (data.featured !== undefined) data.featured = Boolean(data.featured);

    // Ensure date fields are converted
    if (data.insuranceValidity) data.insuranceValidity = new Date(data.insuranceValidity);
    if (data.pucValidTill) data.pucValidTill = new Date(data.pucValidTill);

    const car = await prisma.car.update({
      where: { id: id as string },
      data,
    });

    res.status(200).json({ success: true, car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update car" });
  }
};

export const getAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await prisma.car.findMany();
    res.status(200).json({ success: true, cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch cars" });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.car.delete({
      where: { id: id as string },
    });

    res.status(200).json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete car" });
  }
};
