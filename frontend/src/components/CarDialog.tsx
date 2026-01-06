import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { ENDPOINT_URL } from "@/hooks/user";
import type { Car } from "./car-columns";
import { Textarea } from "./ui/textarea";
import { Upload2 } from "./example-uploader";
import { X, CalendarIcon, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

interface CarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCarSaved: () => void;
  carToEdit?: Car | null;
}

// Reduced steps
const steps = [
  { id: 1, name: "Basic & Pricing" },
  { id: 2, name: "Ownership & Specs" },
  { id: 3, name: "Features & Seller" },
  { id: 4, name: "Media & Admin" },
];

export function CarDialog({
  open,
  onOpenChange,
  onCarSaved,
  carToEdit,
}: CarDialogProps) {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [createdCarId, setCreatedCarId] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const futureYearsOffset = 30; // e.g., allow up to 30 years in the future
  const maxYear = currentYear + futureYearsOffset;
  // //console.log("maxYear", maxYear);
  const minYear = 1990;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) =>
    (maxYear - i).toString()
  );

  // Initial State
  const initialFormData = {
    // Basic
    title: "",
    brand: "",
    model: "",
    variant: "",
    year: "",
    registrationYear: "",
    vehicleType: "",
    color: "",

    // Pricing
    price: "",
    discountPrice: "",
    isNegotiable: false,
    originalPrice: "",

    // Ownership
    ownerNumber: "",
    registrationNumber: "",
    rcAvailable: false,
    insuranceType: "",
    insuranceValidity: "",
    pucValidTill: "",
    serviceHistoryAvailable: false,

    // Specs
    kmDriven: "",
    fuelType: "",
    transmission: "",
    engineCapacity: "",
    mileage: "",
    seatingCapacity: "",
    doors: "",
    topSpeed: "",
    accidental: false,
    floodDamage: false,

    // Features (JSON)
    features: {
      // Exterior
      alloyWheels: false,
      sunroof: false,
      fogLights: false,
      rearWiper: false,
      // Interior
      touchscreenDisplay: false,
      leatherSeats: false,
      ac: false,
      rearAcVents: false,
      // Safety
      abs: false,
      airbags: false,
      reverseCamera: false,
      parkingSensors: false,
      tractionControl: false,
    } as Record<string, boolean>,

    // Seller
    sellerAddress: "",

    // Media
    mainImage: "",
    images: [] as string[],
    videoUrl: "",

    // Admin
    status: "active",
    featured: false,
    viewsCount: "0",
    description: "",
    vendorId: user?.id,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [initialEditData, setInitialEditData] = useState<
    typeof initialFormData | null
  >(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${ENDPOINT_URL}/v1/car/brands`);
        if (response.data.success) {
          setBrands(response.data.cars);
        }
      } catch (error) {
        console.error("Failed to fetch brands", error);
        toast.error("Failed to load car brands");
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchModels = async () => {
      if (!formData.brand) {
        setModels([]);
        return;
      }
      try {
        const response = await axios.get(
          `${ENDPOINT_URL}/v1/car/models/${formData.brand}`,
          { signal: controller.signal }
        );
        if (response.data.success) {
          setModels(response.data.models);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Failed to fetch models", error);
        toast.error("Failed to load car models");
      }
    };
    fetchModels();
    return () => controller.abort();
  }, [formData.brand]);

  useEffect(() => {
    if (carToEdit) {
      let parsedFeatures = initialFormData.features;
      if (carToEdit.features && typeof carToEdit.features === "object") {
        parsedFeatures = {
          ...initialFormData.features,
          ...carToEdit.features,
        };
      }

      const carData = {
        ...initialFormData,
        ...carToEdit,
        year: carToEdit.year.toString(),
        registrationYear: carToEdit.registrationYear?.toString() ?? "",
        price: carToEdit.price.toString(),
        discountPrice: carToEdit.discountPrice?.toString() ?? "",
        originalPrice: carToEdit.originalPrice?.toString() ?? "",
        ownerNumber: carToEdit.ownerNumber?.toString() ?? "",
        kmDriven: carToEdit.kmDriven?.toString() ?? "",
        mileage: carToEdit.mileage?.toString(),
        seatingCapacity: carToEdit.seatingCapacity?.toString() ?? "",
        doors: carToEdit.doors?.toString() ?? "",
        topSpeed: carToEdit.topSpeed?.toString() ?? "",
        viewsCount: carToEdit.viewsCount.toString(),
        images: Array.isArray(carToEdit.images)
          ? carToEdit.images
          : carToEdit.images
          ? [carToEdit.images]
          : [],
        features: parsedFeatures,
        insuranceValidity: carToEdit.insuranceValidity
          ? new Date(carToEdit.insuranceValidity).toISOString().split("T")[0]
          : "",
        pucValidTill: carToEdit.pucValidTill
          ? new Date(carToEdit.pucValidTill).toISOString().split("T")[0]
          : "",
      };
      setFormData(carData);
      setInitialEditData(carData);
    } else {
      setFormData(initialFormData);
      setInitialEditData(null);
    }
  }, [carToEdit, open]);

  useEffect(() => {
    if (user?.id && !formData.vendorId) {
      setFormData((prev) => ({ ...prev, vendorId: user.id }));
    }
  }, [user?.id, formData.vendorId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const updates: any = { [name]: value };
      if (name === "brand") {
        updates.model = "";
      }
      return { ...prev, ...updates };
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFeatureChange = (featureKey: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: checked,
      },
    }));
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i !== imageToRemove),
    }));
  };

  // --- validation helpers ---
  const validateStep = (step: number) => {
    const errors: string[] = [];

    if (step === 1) {
      // Basic Details
      if (!formData.title?.trim()) errors.push("Title is required");
      if (!formData.brand) errors.push("Brand is required");
      if (!formData.model) errors.push("Model is required");
      if (!formData.variant?.trim()) errors.push("Variant is required");
      if (!formData.year) errors.push("Manufacture Year is required");
      if (!formData.registrationYear)
        errors.push("Registration Year is required");
      if (!formData.color?.trim()) errors.push("Color is required");
      if (!formData.vehicleType) errors.push("Vehicle Type is required");

      // Pricing
      const price = Number(formData.price);
      const originalPrice = Number(formData.originalPrice);
      const discountPrice = formData.discountPrice
        ? Number(formData.discountPrice)
        : null;

      if (!formData.price || price <= 0)
        errors.push("Price must be greater than 0");
      if (!formData.originalPrice || originalPrice <= 0)
        errors.push("Original Price must be greater than 0");
      if (discountPrice !== null && discountPrice >= price)
        errors.push("Discount Price must be less than Price");

      // Year validation
      const currentYear = new Date().getFullYear();
      const year = Number(formData.year);
      const regYear = Number(formData.registrationYear);

      if (year < 1990 || year > currentYear)
        errors.push(`Manufacture Year must be between 1990 and ${currentYear}`);
      if (regYear < year)
        errors.push("Registration Year cannot be before Manufacture Year");
      if (regYear > currentYear)
        errors.push(`Registration Year cannot be after ${currentYear}`);
    }

    if (step === 2) {
      // Ownership & Documents
      if (!formData.ownerNumber) errors.push("Owner Number is required");
      if (!formData.registrationNumber?.trim())
        errors.push("Registration Number is required");
      if (!formData.insuranceType) errors.push("Insurance Type is required");
      if (!formData.insuranceValidity)
        errors.push("Insurance Validity is required");
      if (!formData.pucValidTill) errors.push("PUC Valid Till is required");

      // Date validation
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (formData.insuranceValidity) {
        const insDate = new Date(formData.insuranceValidity);
        if (insDate < today)
          errors.push("Insurance Validity cannot be in the past");
      }
      if (formData.pucValidTill) {
        const pucDate = new Date(formData.pucValidTill);
        if (pucDate < today)
          errors.push("PUC Valid Till cannot be in the past");
      }

      // Specs
      const mileage = Number(formData.mileage);
      const engineCapacity = Number(formData.engineCapacity);
      const kmDriven = Number(formData.kmDriven);
      const seatingCapacity = Number(formData.seatingCapacity);
      const doors = Number(formData.doors);
      const topSpeed = Number(formData.topSpeed);

      if (!formData.mileage || mileage <= 0)
        errors.push("Mileage must be greater than 0");
      if (!formData.fuelType) errors.push("Fuel Type is required");
      if (!formData.transmission) errors.push("Transmission is required");
      if (!formData.engineCapacity || engineCapacity <= 0)
        errors.push("Engine Capacity must be greater than 0");
      if (formData.kmDriven === "" || kmDriven < 0)
        errors.push("KM Driven must be 0 or greater");
      if (!formData.seatingCapacity || seatingCapacity <= 0)
        errors.push("Seating Capacity must be greater than 0");
      if (!formData.doors || doors <= 0)
        errors.push("Number of Doors must be greater than 0");
      if (!formData.topSpeed || topSpeed <= 0)
        errors.push("Top Speed must be greater than 0");
    }

    if (step === 3) {
      if (!formData.sellerAddress?.trim())
        errors.push("Seller Address is required");
      else if (formData.sellerAddress.trim().length < 10)
        errors.push("Seller Address must be at least 10 characters");
    }

    if (step === 4) {
      if (!formData.description?.trim()) errors.push("Description is required");
      else if (formData.description.trim().length < 20)
        errors.push("Description must be at least 20 characters");
    }

    if (errors.length > 0) {
      // Show first 3 errors to avoid overwhelming the user
      const errorMessage = errors.slice(0, 3).join("\n");
      const remaining = errors.length - 3;
      toast.error(
        errorMessage + (remaining > 0 ? `\n...and ${remaining} more` : ""),
        { duration: 5000 }
      );
      return false;
    }
    return true;
  };

  const preparePayload = (data: typeof formData) => {
    return {
      ...data,
      year: Number(data.year),
      registrationYear: data.registrationYear
        ? Number(data.registrationYear)
        : null,
      price: Number(data.price),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
      originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
      ownerNumber: data.ownerNumber ? Number(data.ownerNumber) : null,
      kmDriven: data.kmDriven ? Number(data.kmDriven) : null,
      mileage: data.mileage ? Number(data.mileage) : null,
      engineCapacity: data.engineCapacity ? Number(data.engineCapacity) : null,
      seatingCapacity: data.seatingCapacity
        ? Number(data.seatingCapacity)
        : null,
      doors: data.doors ? Number(data.doors) : null,
      topSpeed: data.topSpeed ? Number(data.topSpeed) : null,
      viewsCount: Number(data.viewsCount),
      insuranceValidity: data.insuranceValidity || null,
      pucValidTill: data.pucValidTill || null,
      vendorId: data.vendorId || user?.id,
      images: Array.isArray(data.images) ? data.images : [],
    };
  };

  const validateAllSteps = () => {
    for (let step = 1; step <= steps.length; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (loading) return;
    if (!validateStep(currentStep)) return;

    const isDirty =
      carToEdit && initialEditData
        ? JSON.stringify(formData) !== JSON.stringify(initialEditData)
        : false;

    if (carToEdit && !isDirty) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      return;
    }

    setLoading(true);
    try {
      const payload = preparePayload(formData);

      if (currentStep === 1 && !carToEdit && !createdCarId) {
        const res = await axios.post(
          `${ENDPOINT_URL}/v1/vendor/add-car`,
          payload,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        );
        setCreatedCarId(res.data.car.id);
      } else if (currentStep < 4 && (carToEdit || createdCarId)) {
        await axios.put(
          `${ENDPOINT_URL}/v1/vendor/car/${createdCarId || carToEdit?.id}`,
          payload,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        );
      }
      if (carToEdit) {
        setInitialEditData(formData);
      }
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } catch (error) {
      console.error(error);
      toast.error("Failed to save progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // //console.log("createdCarId:", createdCarId);
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllSteps()) return;

    if (carToEdit && initialEditData) {
      const isDirty =
        JSON.stringify(formData) !== JSON.stringify(initialEditData);
      if (!isDirty) {
        toast.info("No changes to save.");
        onOpenChange(false);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = preparePayload(formData);

      if (carToEdit) {
        await axios.put(
          `${ENDPOINT_URL}/v1/vendor/car/${carToEdit.id}`,
          payload,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        );
        toast.success("Car updated successfully");
      } else {
        // Use the createdCarId if it exists (from multi-step), otherwise create new
        if (createdCarId) {
          await axios.put(
            `${ENDPOINT_URL}/v1/vendor/car/${createdCarId}`,
            payload,
            {
              headers: {
                Authorization: localStorage.getItem("Authorization"),
              },
            }
          );
        } else {
          await axios.post(`${ENDPOINT_URL}/v1/vendor/add-car`, payload, {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          });
        }
        toast.success("Car added successfully");
      }

      onCarSaved();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(carToEdit ? "Failed to update car" : "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setCurrentStep(1);
          setFormData(initialFormData);
          setCreatedCarId(null);
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-accent custom-scrollbar">
        <DialogHeader>
          <DialogTitle>{carToEdit ? "Edit Car" : "Add New Car"}</DialogTitle>
          <DialogDescription>
            {carToEdit
              ? "Update the details of the car."
              : "Enter the details of the new car to add to your inventory."}
          </DialogDescription>
        </DialogHeader>

        {/* Steps (label on top, number below, centered) */}
        <div className="mb-8 -mx-4 px-4 pb-4 border-b">
          <div className="flex justify-between gap-4">
            {steps.map((step, index) => {
              const active = currentStep === step.id;
              const completed = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className="relative flex-1 flex flex-col items-center text-center"
                >
                  {/* connector to next step */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-11 left-32 -right-15 h-[2px]",
                        completed ? "bg-green-500" : "bg-gray-600/60"
                      )}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      currentStep >= step.id && setCurrentStep(step.id)
                    }
                    className="flex flex-col items-center gap-2"
                  >
                    {/* label */}
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-medium",
                        active
                          ? "text-blue-500"
                          : completed
                          ? "text-green-500"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.name}
                    </span>

                    {/* circle */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-300",
                        completed
                          ? "bg-green-500 text-white"
                          : active
                          ? "bg-blue-600 text-white ring-4 ring-blue-200"
                          : "bg-gray-200 text-gray-500"
                      )}
                    >
                      {completed ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Basic + Pricing */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Maruti Swift 2019 VXI"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vehicleType">Vehicle Type *</Label>
                    <Select
                      name="vehicleType"
                      value={formData.vehicleType}
                      required
                      onValueChange={(v) =>
                        handleSelectChange("vehicleType", v)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="MUV">MUV</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Select
                      name="brand"
                      value={formData.brand}
                      required
                      onValueChange={(v) => handleSelectChange("brand", v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="model">Model *</Label>
                    <Select
                      name="model"
                      value={formData.model}
                      onValueChange={(v) => handleSelectChange("model", v)}
                      required
                      disabled={!formData.brand}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="variant">Variant *</Label>
                    <Input
                      id="variant"
                      name="variant"
                      value={formData.variant}
                      onChange={handleChange}
                      placeholder="e.g. ZXI"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Manufacture Year *</Label>
                    <Select
                      name="year"
                      value={formData.year}
                      onValueChange={(v) => handleSelectChange("year", v)}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="registrationYear">Registration Year</Label>
                    <Select
                      name="registrationYear"
                      value={formData.registrationYear}
                      onValueChange={(v) =>
                        handleSelectChange("registrationYear", v)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="color">Color *</Label>
                    <Input
                      id="color"
                      name="color"
                      type="text"
                      pattern="[A-Za-z\s]+"
                      value={formData.color}
                      onChange={handleChange}
                      required
                      title="Please enter a valid color name (letters only)"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discountPrice">Discount Price</Label>
                    <Input
                      id="discountPrice"
                      name="discountPrice"
                      type="number"
                      min="0"
                      value={formData.discountPrice}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="originalPrice">Original Price *</Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      min="0"
                      value={formData.originalPrice}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="isNegotiable"
                      checked={formData.isNegotiable}
                      onCheckedChange={(c) =>
                        handleSwitchChange("isNegotiable", c as boolean)
                      }
                    />
                    <Label htmlFor="isNegotiable">Negotiable</Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Ownership + Specs */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ownership & Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ownerNumber">Owner Number</Label>
                    <Select
                      name="ownerNumber"
                      value={formData.ownerNumber}
                      onValueChange={(v) =>
                        handleSelectChange("ownerNumber", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Owner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Owner</SelectItem>
                        <SelectItem value="2">2nd Owner</SelectItem>
                        <SelectItem value="3">3rd Owner</SelectItem>
                        <SelectItem value="4">4th+ Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="registrationNumber">
                      Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="insuranceType">Insurance Type</Label>
                    <Select
                      name="insuranceType"
                      value={formData.insuranceType}
                      onValueChange={(v) =>
                        handleSelectChange("insuranceType", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Insurance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Comprehensive">
                          Comprehensive
                        </SelectItem>
                        <SelectItem value="Zero Dep">Zero Dep</SelectItem>
                        <SelectItem value="Third Party">Third Party</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="insuranceValidity">
                      Insurance Validity
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.insuranceValidity &&
                              "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.insuranceValidity ? (
                            format(new Date(formData.insuranceValidity), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            formData.insuranceValidity
                              ? new Date(formData.insuranceValidity)
                              : undefined
                          }
                          onSelect={(date) =>
                            setFormData((prev) => ({
                              ...prev,
                              insuranceValidity: date
                                ? format(date, "yyyy-MM-dd")
                                : "",
                            }))
                          }
                          captionLayout="dropdown"
                          startMonth={new Date(1900, 0)}
                          endMonth={new Date(new Date().getFullYear() + 10, 11)}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pucValidTill">PUC Valid Till</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.pucValidTill && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.pucValidTill ? (
                            format(new Date(formData.pucValidTill), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            formData.pucValidTill
                              ? new Date(formData.pucValidTill)
                              : undefined
                          }
                          onSelect={(date) =>
                            setFormData((prev) => ({
                              ...prev,
                              pucValidTill: date
                                ? format(date, "yyyy-MM-dd")
                                : "",
                            }))
                          }
                          captionLayout="dropdown"
                          startMonth={new Date(1900, 0)}
                          endMonth={new Date(new Date().getFullYear() + 10, 11)}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="rcAvailable"
                      checked={formData.rcAvailable}
                      onCheckedChange={(c) =>
                        handleSwitchChange("rcAvailable", c as boolean)
                      }
                    />
                    <Label htmlFor="rcAvailable">RC Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="serviceHistoryAvailable"
                      checked={formData.serviceHistoryAvailable}
                      onCheckedChange={(c) =>
                        handleSwitchChange(
                          "serviceHistoryAvailable",
                          c as boolean
                        )
                      }
                    />
                    <Label htmlFor="serviceHistoryAvailable">
                      Service History Available
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Specs & Condition</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="kmDriven">KM Driven</Label>
                    <Input
                      id="kmDriven"
                      name="kmDriven"
                      type="number"
                      min="0"
                      value={formData.kmDriven}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                      name="fuelType"
                      value={formData.fuelType}
                      onValueChange={(v) => handleSelectChange("fuelType", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Fuel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="CNG">CNG</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      name="transmission"
                      value={formData.transmission}
                      onValueChange={(v) =>
                        handleSelectChange("transmission", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="IMT">IMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="engineCapacity">Engine Capacity</Label>
                    <Input
                      id="engineCapacity"
                      name="engineCapacity"
                      type="number"
                      min="0"
                      value={formData.engineCapacity}
                      onChange={handleChange}
                      placeholder="e.g. 1197"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mileage">Mileage (kmpl) *</Label>
                    <Input
                      id="mileage"
                      name="mileage"
                      type="number"
                      min="0"
                      value={formData.mileage}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                    <Input
                      id="seatingCapacity"
                      name="seatingCapacity"
                      type="number"
                      min="0"
                      value={formData.seatingCapacity}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="doors">Doors</Label>
                    <Input
                      id="doors"
                      name="doors"
                      type="number"
                      min="0"
                      value={formData.doors}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="topSpeed">Top Speed</Label>
                    <Input
                      id="topSpeed"
                      name="topSpeed"
                      type="number"
                      min="0"
                      value={formData.topSpeed}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accidental"
                      checked={formData.accidental}
                      onCheckedChange={(c) =>
                        handleSwitchChange("accidental", c as boolean)
                      }
                    />
                    <Label htmlFor="accidental">Accidental</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="floodDamage"
                      checked={formData.floodDamage}
                      onCheckedChange={(c) =>
                        handleSwitchChange("floodDamage", c as boolean)
                      }
                    />
                    <Label htmlFor="floodDamage">Flood Damage</Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Features + Seller */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Exterior
                    </h4>
                    {["alloyWheels", "sunroof", "fogLights", "rearWiper"].map(
                      (f) => (
                        <div key={f} className="flex items-center space-x-2">
                          <Checkbox
                            id={f}
                            checked={formData.features[f]}
                            onCheckedChange={(c) =>
                              handleFeatureChange(f, c as boolean)
                            }
                          />
                          <Label htmlFor={f} className="capitalize">
                            {f.replace(/([A-Z])/g, " $1").trim()}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Interior
                    </h4>
                    {[
                      "touchscreenDisplay",
                      "leatherSeats",
                      "ac",
                      "rearAcVents",
                    ].map((f) => (
                      <div key={f} className="flex items-center space-x-2">
                        <Checkbox
                          id={f}
                          checked={formData.features[f]}
                          onCheckedChange={(c) =>
                            handleFeatureChange(f, c as boolean)
                          }
                        />
                        <Label htmlFor={f} className="capitalize">
                          {f.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Safety
                    </h4>
                    {[
                      "abs",
                      "airbags",
                      "reverseCamera",
                      "parkingSensors",
                      "tractionControl",
                    ].map((f) => (
                      <div key={f} className="flex items-center space-x-2">
                        <Checkbox
                          id={f}
                          checked={formData.features[f]}
                          onCheckedChange={(c) =>
                            handleFeatureChange(f, c as boolean)
                          }
                        />
                        <Label htmlFor={f} className="capitalize">
                          {f.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Seller Details</h3>
                <div className="grid gap-2">
                  <Label htmlFor="sellerAddress">Seller Address</Label>
                  <Textarea
                    id="sellerAddress"
                    name="sellerAddress"
                    value={formData.sellerAddress}
                    onChange={handleChange}
                    placeholder="Enter seller address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Media + Admin */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Media</h3>
                <div className="grid gap-2">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="YouTube link etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="images">Images</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.images.map((img, index) => {
                      if (!img) return null;
                      const imageUrl = img.startsWith("http")
                        ? img
                        : `${import.meta.env.VITE_IMG_URL}${img}`;
                      return (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Car ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img)}
                            className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <Upload2
                    onUploadComplete={(url) => {
                      setFormData((prev) => ({
                        ...prev,
                        images: [...prev.images, url],
                      }));
                      toast.success("Image uploaded successfully");
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Status & Description</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      name="status"
                      value={formData.status}
                      onValueChange={(v) => handleSelectChange("status", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(c) =>
                        handleSwitchChange("featured", c as boolean)
                      }
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between w-full">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  className="cursor-pointer"
                  variant="outline"
                  onClick={handleBack}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Car"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
