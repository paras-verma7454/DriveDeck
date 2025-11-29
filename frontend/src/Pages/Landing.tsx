import { useState, useEffect } from "react";
import {
  Car,
  Search,
  ShieldCheck,
  Zap,
//   ChevronRight,
  Star,
  Menu,
  X,
  ArrowRight,
//   Filter,
  DollarSign,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Testimonials from "@/components/Testimonials";
import { Link } from "react-router-dom";

// --- Mock Data ---
const FEATURED_CARS = [
  {
    id: 1,
    make: "Porsche",
    model: "911 Carrera S",
    year: 2022,
    price: "125,000",
    mileage: "4,500",
    image:
      "https://images.unsplash.com/photo-1634673970798-a15ae56f6c65?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: "Trending",
  },
  {
    id: 2,
    make: "Tesla",
    model: "Model S Plaid",
    year: 2023,
    price: "89,900",
    mileage: "1,200",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800",
    badge: "Electric",
  },
  {
    id: 3,
    make: "Mercedes-Benz",
    model: "G-Wagon",
    year: 2021,
    price: "145,000",
    mileage: "12,000",
    image:
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=800",
    badge: "Luxury",
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Car Enthusiast",
    text: "Sold my M3 in 24 hours. The AI pricing tool is scarily accurate.",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "First-time Buyer",
    text: "DriveDeck made the paperwork invisible. I just clicked and drove.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 3,
    name: "Michael Ross",
    role: "Collector",
    text: "Found a rare 911 in pristine condition. The verification process gave me total peace of mind.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 4,
    name: "Emily Zhang",
    role: "Daily Commuter",
    text: "Financing was approved in minutes. Best car buying experience I've ever had.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
  },
  {
    id: 5,
    name: "David Kim",
    role: "Tech Reviewer",
    text: "The platform is incredibly intuitive. Selling my Tesla was seamless.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
  },
];

// --- Components ---

// const Button = ({
//   children,
//   variant = "primary",
//   className = "",
//   icon: Icon,
//   ...props
// }) => {
//   const baseStyle =
//     "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95";
//   const variants = {
//     primary:
//       "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50",
//     secondary:
//       "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
//     outline:
//       "border-2 border-slate-600 hover:border-indigo-500 text-slate-300 hover:text-white",
//   };

//   return (
//     <button
//       className={`${baseStyle} ${variants[variant]} ${className}`}
//       {...props}
//     >
//       {children}
//       {Icon && (
//         <Icon
//           size={18}
//           className="group-hover:translate-x-1 transition-transform"
//         />
//       )}
//     </button>
//   );
// };

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <Car className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
            DriveDeck
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {["Inventory", "Sell Your Car", "Financing", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-slate-400 hover:text-white hover:scale-105 transition-all text-sm font-medium"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-white font-medium hover:text-indigo-400 transition-colors"
          >
            Log In
          </Link>
          <Link to="/signup">
            <Button className="py-2 px-4 text-sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-6 flex flex-col gap-4 animate-fade-in-down md:hidden">
          {["Inventory", "Sell Your Car", "Financing", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-slate-300 py-2 border-b border-slate-800 hover:text-indigo-400"
            >
              {item}
            </a>
          ))}
          <Link to="/signup">
            <Button className="w-full mt-4 cursor-pointer">Get Started</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState("buy"); // 'buy' or 'sell'

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            The Future of Auto Trading
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Buy & Sell Cars <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
              Without the Friction.
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-lg">
            Experience the modern way to trade vehicles. AI-driven pricing,
            instant verification, and doorstep delivery.
          </p>

          {/* Tabbed Search Box */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-2 rounded-2xl max-w-md shadow-2xl">
            <div className="flex gap-2 mb-4 p-1 bg-slate-800/50 rounded-xl">
              <button
                onClick={() => setActiveTab("buy")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "buy"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Buy a Car
              </button>
              <button
                onClick={() => setActiveTab("sell")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "sell"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sell Your Car
              </button>
            </div>

            <div className="space-y-3 px-2 pb-2">
              {activeTab === "buy" ? (
                <>
                  <div className="flex gap-2">
                    <select className="w-full bg-slate-800 border-none rounded-lg text-slate-300 text-sm py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:bg-slate-750 transition-colors">
                      <option>Make</option>
                      <option>BMW</option>
                      <option>Audi</option>
                    </select>
                    <select className="w-full bg-slate-800 border-none rounded-lg text-slate-300 text-sm py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:bg-slate-750 transition-colors">
                      <option>Model</option>
                    </select>
                  </div>
                  <Button className="w-full mt-2 group">
                    Find Your Dream Car <Search className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter VIN or License Plate"
                      className="w-full bg-slate-800 border-none rounded-lg text-white text-sm py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-500"
                    />
                  </div>
                  <Button className="w-full mt-2 group">
                    Get Instant Offer <DollarSign className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-400" /> Verified
              Dealers
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-indigo-400" /> Instant Processing
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative hidden lg:block h-full min-h-[500px]">
          {/* Floating Cards Mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="relative w-full h-full">
              {/* Main Car Image with floating animation */}
              <div className="absolute top-10 right-0 w-[90%] h-80 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-slate-700 animate-float-slow z-20 group">
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-60 z-10" />
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000"
                  alt="Supercar"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <p className="text-xs text-indigo-400 font-bold tracking-wider mb-1">
                    FEATURED
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    Audi R8 Spyder
                  </h3>
                  <p className="text-slate-300">$165,000</p>
                </div>
              </div>

              {/* Decorative card behind */}
              <div className="absolute top-32 -right-8 w-[80%] h-64 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 -z-10 animate-float-delayed"></div>

              {/* Stats Card */}
              <div className="absolute bottom-20 -left-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-4 rounded-xl shadow-xl z-30 animate-float-reverse">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                    <TrendingUpIcon size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">
                      Market Value
                    </p>
                    <p className="font-bold text-white">
                      +12.5%{" "}
                      <span className="text-slate-500 font-normal">
                        this month
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CarCard = ({ car }: { car: any }) => {
  return (
    <div className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 relative">
      <div className="relative h-48 overflow-hidden">
        <span className="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white z-10 border border-white/20">
          {car.badge}
        </span>
        <button className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/50 text-slate-300 hover:bg-white hover:text-red-500 transition-colors z-10">
          <Star size={16} />
        </button>
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent opacity-60" />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
              {car.make} {car.model}
            </h3>
            <p className="text-slate-500 text-sm">{car.year}</p>
          </div>
          <p className="text-xl font-bold text-white">${car.price}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 my-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-800/50 p-2 rounded-lg">
            <Gauge size={14} /> {car.mileage} mi
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-800/50 p-2 rounded-lg">
            <ShieldCheck size={14} /> Clean Title
          </div>
        </div>

        <button className="w-full py-3 rounded-lg border border-slate-700 text-slate-300 font-medium text-sm hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all group-hover:translate-y-0 group/btn flex items-center justify-center gap-2">
          View Details{" "}
          <ArrowRight
            size={16}
            className="group-hover/btn:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

const Features = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse Inventory",
      desc: "Filter through thousands of verified listings with AI-powered matching.",
    },
    {
      icon: ShieldCheck,
      title: "Get Inspected",
      desc: "Every car undergoes a 150-point inspection by certified mechanics.",
    },
    {
      icon: Car,
      title: "Drive Away",
      desc: "Home delivery or pickup. 7-day money-back guarantee included.",
    },
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            How DriveDeck Works
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Buying a car used to be stressful. We fixed it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/50 transition-colors group cursor-pointer"
            >
              <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrendingSection = () => {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Trending Arrivals
            </h2>
            <p className="text-slate-400">Fresh deals added today.</p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All Inventory
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_CARS.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Button variant="outline" className="w-full">
            View All Inventory
          </Button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg">
                <Car className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white">DriveDeck</span>
            </div>
            <p className="text-slate-500 text-sm">
              The modern standard for buying and selling vehicles. Fast, fair,
              and frictionless.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Browse Cars
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Sell Your Car
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Car Values
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Stay in the loop</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 w-full"
              />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
          <p>&copy; 2024 DriveDeck Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-400">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Icon for stats
const TrendingUpIcon = ({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className={className}
//   >
//     <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
//     <polyline points="17 6 23 6 23 12"></polyline>
//   </svg>
// );

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
        .animate-float-reverse { animation: float-reverse 5s ease-in-out infinite; }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

        .animate-fade-in-down { animation: fadeInDown 0.3s ease-out forwards; }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        // @keyframes scroll {
        //   0% { transform: translateX(0); }
        //   100% { transform: translateX(-50%); }
        // }
        // .animate-scroll {
        //   animation: scroll 30s linear infinite;
        // }
        // .animate-scroll:hover {
        //   animation-play-state: paused;
        // }
      `}</style>

      <Navbar />
      <HeroSection />
      <Features />
      <TrendingSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Landing;
