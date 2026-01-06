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
import type { User } from "./user-columns";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onUserUpdated: () => void;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onUserUpdated,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    UserName: "",
    PhoneNumber: "",
    Email: "",
    Pincode: "",
  });

  const [country, setCountry] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("");

  const [countriesList, setCountriesList] = useState<ICountry[]>([]);
  const [statesList, setStatesList] = useState<IState[]>([]);
  const [citiesList, setCitiesList] = useState<ICity[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCountriesList(Country.getAllCountries());
  }, []);

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        FirstName: user.FirstName || "",
        LastName: user.LastName || "",
        UserName: user.UserName || "",
        PhoneNumber: user.PhoneNumber || "",
        Email: user.Email || "",
        Pincode: user.Pincode || "",
      });
      setRole(user.role.roleName === "vendor" ? "vendor" : "user");

      // Handle Address prefilling
      const allCountries = Country.getAllCountries();
      const foundCountry = allCountries.find((c) => c.name === user.Country);

      if (foundCountry) {
        setCountry(foundCountry.isoCode);

        const countryStates = State.getStatesOfCountry(foundCountry.isoCode);
        setStatesList(countryStates);

        const foundState = countryStates.find((s) => s.name === user.State);
        if (foundState) {
          setStateVal(foundState.isoCode);

          const stateCities = City.getCitiesOfState(
            foundCountry.isoCode,
            foundState.isoCode
          );
          setCitiesList(stateCities);

          setCity(user.City || "");
        } else {
          setStateVal("");
          setCitiesList([]);
          setCity("");
        }
      } else {
        setCountry("");
        setStatesList([]);
        setStateVal("");
        setCitiesList([]);
        setCity("");
      }
    }
  }, [user, open]);

  useEffect(() => {
    if (country) {
      setStatesList(State.getStatesOfCountry(country));
    }
  }, [country]);

  useEffect(() => {
    if (country && stateVal) {
      setCitiesList(City.getCitiesOfState(country, stateVal));
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
      // //console.log("role:",role)
      const payload = {
        firstName: formData.FirstName,
        lastName: formData.LastName,
        username: formData.UserName,
        email: formData.Email,
        phoneNumber: formData.PhoneNumber,
        city: city,
        state: selectedState ? selectedState.name : "",
        country: selectedCountry ? selectedCountry.name : "",
        pincode: formData.Pincode,
        Role: role,
      };

      const token = localStorage.getItem("Authorization");

      const response = await axios.post(
        `${ENDPOINT_URL}/v1/user/${user.id}`,
        payload,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("User updated successfully!");
        onOpenChange(false);
        setTimeout(() => {
          onUserUpdated();
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update the user details.</DialogDescription>
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
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={role}
                    onValueChange={(val) => {
                      setRole(val);
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
                    setStateVal("");
                    setCity("");
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
                    setCity("");
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
              {loading ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
