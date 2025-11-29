import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENDPOINT_URL } from "@/hooks/user";
import { toast } from "sonner";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import type { ICountry, IState, ICity } from "country-state-city";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onUserCreated,
}: CreateUserDialogProps) {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    UserName: "",
    PhoneNumber: "",
    Email: "",
    Password: "",
    Pincode: "",
    Role: "user", // Default role
  });

  const [country, setCountry] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("user"); // State for role dropdown

  const [countriesList, setCountriesList] = useState<ICountry[]>([]);
  const [statesList, setStatesList] = useState<IState[]>([]);
  const [citiesList, setCitiesList] = useState<ICity[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCountriesList(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (country) {
      setStatesList(State.getStatesOfCountry(country));
      setStateVal("");
      setCity("");
    }
  }, [country]);

  useEffect(() => {
    if (country && stateVal) {
      setCitiesList(City.getCitiesOfState(country, stateVal));
      setCity("");
    }
  }, [country, stateVal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedCountry = countriesList.find((c) => c.isoCode === country);
    const selectedState = statesList.find((s) => s.isoCode === stateVal);

    try {
      const response = await axios.post(`${ENDPOINT_URL}/v1/auth/signup`, {
        ...formData,
        City: city,
        State: selectedState ? selectedState.name : "",
        Country: selectedCountry ? selectedCountry.name : "",
        Role: role, // Include the selected role
      });

      if (response.data.success) {
        toast.success("User created successfully!");
        onUserCreated();
        onOpenChange(false);
        // Reset form
        setFormData({
          FirstName: "",
          LastName: "",
          UserName: "",
          PhoneNumber: "",
          Email: "",
          Password: "",
          Pincode: "",
          Role: "user",
        });
        setCountry("");
        setStateVal("");
        setCity("");
        setRole("user"); // Reset role
      } else {
        toast.error(response.data.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="FirstName">First Name *</Label>
                <Input
                  id="FirstName"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="LastName">Last Name *</Label>
                <Input
                  id="LastName"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="UserName">Username *</Label>
                <Input
                  id="UserName"
                  name="UserName"
                  value={formData.UserName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="PhoneNumber">Phone Number *</Label>
                <Input
                  id="PhoneNumber"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Email">Email *</Label>
                <Input
                  id="Email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Password">Password *</Label>
                <Input
                  id="Password"
                  name="Password"
                  type="password"
                  value={formData.Password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Role Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={role}
                  onValueChange={(val) => {
                    setRole(val);
                    setFormData({ ...formData, Role: val });
                  }}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="Pincode">Pincode *</Label>
                <Input
                  id="Pincode"
                  name="Pincode"
                  value={formData.Pincode}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={country}
                  onValueChange={(val) => {
                    setCountry(val);
                  }}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countriesList.map((c) => (
                      <SelectItem key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select
                  value={stateVal}
                  onValueChange={(val) => {
                    setStateVal(val);
                  }}
                  disabled={!country}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {statesList.map((s) => (
                      <SelectItem key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                {citiesList.length > 0 ? (
                  <Select
                    value={city}
                    onValueChange={setCity}
                    disabled={!stateVal}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {citiesList.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="city"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!stateVal}
                    placeholder="Enter City"
                    required
                  />
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="cursor-pointer"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
