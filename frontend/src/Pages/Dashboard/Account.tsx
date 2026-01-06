import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ENDPOINT_URL } from "@/hooks/user";
import axios from "axios";
import { toast } from "sonner";
import { Country, State, City } from "country-state-city";
import type { ICountry, IState, ICity } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "@/components/example-uploader";
import { useUser } from "@/context/UserContext";

const Account = () => {
   const { user } = useUser();
  const [activeTab, setActiveTab] = useState("account");
  // Form state
  const [firstName, setFirstName] = useState("loading...");
  const [lastName, setLastName] = useState("loading...");
  const [username, setUsername] = useState("loading...");
  const [email, setEmail] = useState("loading...");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("loading...");
  const [country, setCountry] = useState("");

  // Address data lists
  const [countriesList, setCountriesList] = useState<ICountry[]>([]);
  const [statesList, setStatesList] = useState<IState[]>([]);
  const [citiesList, setCitiesList] = useState<ICity[]>([]);

  useEffect(() => {
    setCountriesList(Country.getAllCountries());
  }, []);

  // Populate fields when user data is available
  useEffect(() => {
    if (user && countriesList.length > 0) {
      setFirstName(user.FirstName || "");
      setLastName(user.LastName || "");
      setUsername(user.UserName || "");
      setEmail(user.Email || "");
      setPincode(user.Pincode || "");

      const userCountry = countriesList.find((c) => c.name === user.Country);
      if (userCountry) {
        const countryStates = State.getStatesOfCountry(userCountry.isoCode);
        setStatesList(countryStates);

        const userState = countryStates.find((s) => s.name === user.State);
        if (userState) {
          const stateCities = City.getCitiesOfState(
            userCountry.isoCode,
            userState.isoCode
          );
          setCitiesList(stateCities);

          // Now set the state variables for the selects
          setCountry(userCountry.isoCode);
          setState(userState.isoCode);
          setCity(user.City || "");
        } else {
          // Country found, but state not. Reset state and city.
          setCountry(userCountry.isoCode);
          setState("");
          setCity("");
        }
      } else {
        // Country not found. Reset everything.
        setCountry("");
        setState("");
        setCity("");
      }
    }
  }, [user, countriesList]);

  useEffect(() => {
    if (country) {
      const countryStates = State.getStatesOfCountry(country);
      setStatesList(countryStates);
    }
  }, [country]);

  useEffect(() => {
    if (country && state) {
      const stateCities = City.getCitiesOfState(country, state);
      setCitiesList(stateCities);
    }
  }, [country, state]);

  const handleSubmit = async () => {
    let payload: any = {};

    const selectedCountry = countriesList.find((c) => c.isoCode === country);
    const selectedState = statesList.find((s) => s.isoCode === state);

    if (activeTab === "account") {
      payload = { firstName, lastName, username };
    } else if (activeTab === "password") {
      payload = { currentPassword, newPassword };
    } else if (activeTab === "Address") {
      payload = {
        city,
        state: selectedState ? selectedState.name : "",
        pincode,
        country: selectedCountry ? selectedCountry.name : "",
      };
    }
    try {
      const response = await axios.post(
        `${ENDPOINT_URL}/v1/user/${user.id}`,
        payload,
        { headers: { Authorization: localStorage.getItem("Authorization") } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error?.message || "Request failed");
    }
  };

  return (
    <div className="flex w-full max-w-sm md:max-w-full flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="Address">Address</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="h-6" />
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="h-6" />
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} disabled />
                </div>
              </div>
              <div>
                <Label className="flex justify-center">Profile Image</Label>
                <Upload/>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="cursor-pointer" onClick={handleSubmit}>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="cursor-pointer"  onClick={handleSubmit}>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Address Tab */}
        <TabsContent value="Address">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>
                We need your address to deliver your order.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Country */}
              <div className="grid gap-3">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={country}
                  onValueChange={(val) => {
                    setCountry(val);
                    setState("");
                    setCity("");
                  }}
                >
                  <SelectTrigger className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
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
              {/* State & Pincode */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={state}
                    onValueChange={(val) => {
                      setState(val);
                      setCity("");
                    }}
                    disabled={!country}
                  >
                    <SelectTrigger className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
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
                <div className="grid gap-3">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* City */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={city}
                    onValueChange={setCity}
                    disabled={!state}
                  >
                    <SelectTrigger className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
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
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="cursor-pointer" onClick={handleSubmit}>Save Address</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;