import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ENDPOINT_URL, VITE_IMG_URL } from "@/hooks/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoaderOneDemo } from "@/components/LoaderOne";
import { ArrowLeft, Phone, Mail, Fuel, Gauge, Zap, User, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { SingleCarCard } from "@/components/CarCard";

interface Car {
  id: string;
  title?: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  registrationYear?: number;
  vehicleType?: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  isNegotiable: boolean;
  ownerNumber?: number;
  registrationNumber?: string;
  rcAvailable: boolean;
  insuranceType?: string;
  insuranceValidity?: string;
  pucValidTill?: string;
  serviceHistoryAvailable: boolean;
  kmDriven?: number;
  fuelType?: string;
  transmission?: string;
  engineCapacity?: string;
  mileage?: number;
  color?: string;
  seatingCapacity?: number;
  doors?: number;
  topSpeed?: number;
  accidental: boolean;
  floodDamage: boolean;
  features?: any;
  description?: string;
  images: string[];
  mainImage?: string;
  videoUrl?: string;
  vendor?: {
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
    City: string;
    State: string;
    Image?: string;
  };
  createdAt: string;
}

const CarDetails = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [suggestedCars, setSuggestedCars] = useState<Car[]>([]);
  const [suggestedLoading, setSuggestedLoading] = useState(false);
  const [suggestedError, setSuggestedError] = useState(false);


  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${VITE_IMG_URL}${imagePath}`;
  };
console.log(suggestedError)
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${ENDPOINT_URL}/v1/cars/${carId}`);
        if (response.data.success) {
          setCar(response.data.car);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Error fetching car details:", error);
        toast.error("Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };
    if (carId) {
      fetchCar();
      window.scrollTo(0, 0);
    }
  }, [carId]);

  useEffect(() => {
    const fetchSuggest = async () => {
      if (!car?.vehicleType) return;
      
      setSuggestedLoading(true);
      setSuggestedError(false);

      try {
        const response = await axios.get(
          `${ENDPOINT_URL}/v1/cars/suggest/${car.vehicleType}/${carId}/6`,
          { 
            headers: { Authorization: localStorage.getItem("Authorization") as string },
          }
        );
        
        if (response.data.success) {
          setSuggestedCars(response.data.suggestedCars);
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Error fetching suggested cars:", error);
        setSuggestedError(true);
        toast.error("Failed to load similar cars.");
      } finally {
        setSuggestedLoading(false);
      }
    };

    if (car?.vehicleType) {
      fetchSuggest();
    }
  }, [car?.vehicleType, carId]);


  const handleNextImage = () => {
    if (!car || !car.images || car.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const handlePrevImage = () => {
    if (!car || !car.images || car.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderOneDemo />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Car not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  // Derive current image to show
  const images = car.images && car.images.length > 0 ? car.images : (car.mainImage ? [car.mainImage] : []);
  const currentImage = images[currentImageIndex];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Images Section */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg border bg-background shadow-sm group">
            <img
              src={getImageUrl(currentImage)}
              alt={car.title || ""}
              className="h-[400px] w-full object-cover transition-all duration-300"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-muted-foreground/50"
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          <div className="mb-7"></div>
            <div>
              {car.features && (
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(car.features) ? (
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     {car.features.map((feature: any, idx: number) => (
                       <div key={idx} className="flex items-center gap-2">
                         <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                         </div>
                         <span className="text-sm">{String(feature)}</span>
                       </div>
                     ))}
                   </div>
                ) : typeof car.features === 'object' ? (
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                     {Object.entries(car.features).map(([key, value]) => {
                       if (!value) return null;
                       const label = value === true ? key : `${key}: ${value}`;
                       return (
                         <div key={key} className="flex items-center gap-2">
                           <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                              <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                           </div>
                           <span className="text-sm capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</span>
                         </div>
                       );
                     })}
                   </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{String(car.features)}</p>
                )}
              </CardContent>
            </Card>
          )}
            </div>
          
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary">{car.brand}</Badge>
              <Badge variant="outline">{car.vehicleType}</Badge>
            </div>
            <h1 className="text-3xl font-bold">
              {car.title || `${car.brand} ${car.model}`}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <Badge variant="outline">{car.year}</Badge>
              <span>{car.variant}</span>
              {car.color && <span>• {car.color}</span>}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-bold text-primary">
              ₹{car.price.toLocaleString()}
              {car.isNegotiable && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  (Negotiable)
                </span>
              )}
            </div>
            {car.originalPrice && car.originalPrice > car.price && (
              <div className="text-lg text-muted-foreground line-through">
                ₹{car.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Technical Specs</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 pt-0">
                <SpecItem icon={<Fuel className="h-4 w-4" />} label="Fuel" value={car.fuelType} />
                <SpecItem icon={<Gauge className="h-4 w-4" />} label="Mileage" value={car.kmDriven ? `${car.kmDriven.toLocaleString()} km` : "N/A"} />
                <SpecItem icon={<Zap className="h-4 w-4" />} label="Transmission" value={car.transmission} />
                <SpecItem icon={<Badge variant="outline" className="h-4 w-4 border-none p-0 flex items-center justify-center">cc</Badge>} label="Engine" value={car.engineCapacity} />
                <SpecItem icon={<User className="h-4 w-4" />} label="Seating" value={car.seatingCapacity?.toString()} />
                <SpecItem icon={<Zap className="h-4 w-4" />} label="Top Speed" value={car.topSpeed ? `${car.topSpeed} km/h` : "N/A"} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Ownership & History</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 pt-0">
                <SpecItem label="Owners" value={car.ownerNumber?.toString()} />
                <SpecItem label="RC Status" value={car.rcAvailable ? "Available" : "Not Available"} />
                <SpecItem label="Insurance" value={car.insuranceType || "N/A"} />
                <SpecItem label="Service History" value={car.serviceHistoryAvailable ? "Available" : "Not Available"} />
                <SpecItem label="Accidental" value={car.accidental ? "Yes" : "No"} />
                <SpecItem label="Flood Damage" value={car.floodDamage ? "Yes" : "No"} />
              </CardContent>
            </Card>
          </div>

          

          {car.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {car.description}
                </p>
              </CardContent>
            </Card>
          )}

          {car.vendor && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Seller Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden border">
                    {car.vendor.Image ? (
                      <img
                        src={getImageUrl(car.vendor.Image)}
                        className="h-full w-full object-cover"
                        alt="Vendor"
                      />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {car.vendor.FirstName} {car.vendor.LastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {car.vendor.City}, {car.vendor.State}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{car.vendor.PhoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{car.vendor.Email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
        {/* Suggested Cars Section */}
      {!loading && car && (
        <div className="mt-16">
          <Separator className="mb-8" />
          <h3 className="text-2xl font-bold mb-6">Similar {car.vehicleType} Cars</h3>
          {suggestedLoading ? (
            <div className="flex justify-center py-10">
              <LoaderOneDemo />
            </div>
          ) : suggestedCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suggestedCars.map((suggestCar) => (
                <SingleCarCard
                  key={suggestCar.id} 
                  car={suggestCar as any}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No similar cars found at the moment.</p>
            </div>
          )}
        </div>
      )}

      
    </div>
  );
};

const SpecItem = ({ icon, label, value }: { icon?: React.ReactNode; label: string; value?: string | null }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-medium">{value || "N/A"}</span>
  </div>
);

export default CarDetails;