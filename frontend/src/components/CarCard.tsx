import { ENDPOINT_URL, VITE_IMG_URL } from "@/hooks/user";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Fuel, Gauge, Calendar, Zap } from "lucide-react";

interface Car {
  id: string;
  title: string | null;
  brand: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  fuelType: string | null;
  kmDriven: number | null;
  transmission: string | null;
  variant: string | null;
  description: string | null;
}

const CarCard = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${ENDPOINT_URL}/v1/cars`, {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        });
        const data = response.data;
        // Check if data.cars exists, otherwise use data if it's an array
        const carList = data.cars || (Array.isArray(data) ? data : []);
        setCars(carList);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Featured Vehicles
          </h1>
          <p className="text-slate-500 mt-2">
            Discover your next dream car from our curated collection.
          </p>
        </div>
      </div> */}

      {cars.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">
            No cars available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid w-350 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <SingleCarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

const SingleCarCard = ({ car }: { car: Car }) => {
  // Construct image URL safely
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${VITE_IMG_URL}${imagePath}`;
  };

  const mainImage = car.images && car.images.length > 0 ? car.images[0] : null;
  const imageUrl = getImageUrl(mainImage);
//   const imageUrl = "https://stimg.cardekho.com/images/carexteriorimages/630x420/Mahindra/XEV-9e/9262/1755776058045/front-left-side-47.jpg?tr=w-300"

  return (
    <Card className="group overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-48 -mt-6 overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* <Badge className="absolute top-3 left-3 z-10 bg-white/90 text-slate-900 hover:bg-white dark:bg-slate-900/90 dark:text-white backdrop-blur-sm">
          {car.year}
        </Badge> */}
        <img
          src={imageUrl}
          alt={car.title || `${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/600x400?text=Image+Error";
          }}
        />
      </div>

      <CardHeader className="px-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle
            className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1"
            title={car.title || `${car.brand} ${car.model}`}
          >
            {car.title || `${car.brand} ${car.model}`}
          </CardTitle>
        </div>
        <p className="text-slate-500 text-sm font-medium">
          {car.brand} {car.model} {car.variant && `• ${car.variant}`}
        </p>
      </CardHeader>

      <CardContent className="px-4 grow">
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {car.price < 100000 ? (
              `₹${car.price.toLocaleString()}`
            ) : car.price < 10000000 ? (
              `₹${(car.price / 100000).toFixed(1)} Lakh`
            ) : (
              `₹${(car.price / 10000000).toFixed(1)} Crore`
            )}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
            <Fuel size={14} className="text-indigo-500 dark:text-indigo-400" />
            <span className="truncate">{car.fuelType || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
            <Gauge size={14} className="text-indigo-500 dark:text-indigo-400" />
            <span className="truncate">
              {car.kmDriven ? `${car.kmDriven.toLocaleString()} km` : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
            <Zap size={14} className="text-indigo-500 dark:text-indigo-400" />
            <span className="truncate">{car.transmission || "Manual"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
            <Calendar
              size={14}
              className="text-indigo-500 dark:text-indigo-400"
            />
            <span className="truncate">{car.year}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Button className="w-full bg-slate-900 cursor-pointer hover:bg-indigo-600 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-indigo-500/20">
          <Eye className="w-4 h-4 mr-2" />
          View Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
