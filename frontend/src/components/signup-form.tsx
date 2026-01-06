import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ENDPOINT_URL } from "@/hooks/user";
import { Country, State, City } from "country-state-city";
import type { ICountry, IState, ICity } from "country-state-city";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();
  

  useEffect(() => {
    if (localStorage.getItem("Authorization")) {
      navigate("/dashboard");
    }
  }, [ navigate]);

  const [step, setStep] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setloading] = useState(false);

  // Address data lists
  const [countriesList, setCountriesList] = useState<ICountry[]>([]);
  const [statesList, setStatesList] = useState<IState[]>([]);
  const [citiesList, setCitiesList] = useState<ICity[]>([]);

  useEffect(() => {
    setCountriesList(Country.getAllCountries());
  }, []);

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

  const valueMap: Record<string, any> = {
    firstName,
    lastName,
    userName,
    phoneNumber,
    email,
    password,
    confirmPassword,
    city,
    stateVal,
    country,
    pincode,
  };

  function validateStep() {
    const currentStepFields = [
      // Define fields for each step to validate
      ["firstName", "lastName", "userName", "email"],
      ["phoneNumber", "password", "confirmPassword"],
      ["country", "stateVal", "city", "pincode"],
    ];

    for (const field of currentStepFields[step]) {
      const val = valueMap[field];
      if (!val || (typeof val === "string" && val.trim() === "")) {
        toast.error("Please fill all fields.");
        return false;
      }
    }
    if (step === 1 && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setloading(true);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setloading(false);
      return;
    }

    const selectedCountry = countriesList.find((c) => c.isoCode === country);
    const selectedState = statesList.find((s) => s.isoCode === stateVal);

    const endpoint = `${ENDPOINT_URL}/v1/auth/signup`;
    try {
      const response = await axios.post(endpoint, {
        FirstName: firstName,
        LastName: lastName,
        UserName: userName,
        PhoneNumber: phoneNumber,
        Email: email,
        Password: password,
        City: city,
        State: selectedState ? selectedState.name : "",
        Country: selectedCountry ? selectedCountry.name : "",
        Pincode: pincode,
      });
      //console.log(response.data);

      if (response.data.token) {
        localStorage.setItem("Authorization", `Bearer ${response.data.token}`);
        navigate("/dashboard");
        toast.success("Account created successfully!");
      }
    } catch (error) {
      setloading(false);
      console.error("Error:", error);
      toast.error("Signup failed. Please try again.");
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          {step === 0 && "Step 1: Enter your personal details"}
          {step === 1 && "Step 2: Account security and contact details"}
          {step === 2 && "Step 3: Address information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <FieldGroup>
              {/* Step 0 fields */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="userName">Username</FieldLabel>
                <Input
                  id="userName"
                  type="text"
                  placeholder="johndoe123"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
            </FieldGroup>
          )}

          {step === 1 && (
            <FieldGroup>
              {/* Step 1 fields */}
              <Field>
                <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Field>
            </FieldGroup>
          )}

          {step === 2 && (
            <FieldGroup>
              {/* Step 2 fields */}
              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Select
                  value={country}
                  onValueChange={(val) => {
                    setCountry(val);
                    setStateVal("");
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
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="state">State</FieldLabel>
                  <Select
                    value={stateVal}
                    onValueChange={(val) => {
                      setStateVal(val);
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
                </Field>
                <Field>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Select
                    value={city}
                    onValueChange={setCity}
                    disabled={!stateVal}
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
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="pincode">Pincode</FieldLabel>
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </Field>
              </div>
            </FieldGroup>
          )}

          <FieldGroup>
            <Field>
              <div className="flex flex-row mt-5 flex-wrap gap-2 justify-end">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((prev) => prev - 1)}
                  >
                    Back
                  </Button>
                )}
                {step < 2 && (
                  <Button
                    type="button"
                    onClick={() => {
                      if (validateStep()) setStep((prev) => prev + 1);
                    }}
                  >
                    Next
                  </Button>
                )}
                {step === 2 && (
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                )}
              </div>
              {step === 0 && (
                <FieldDescription className="px-6 text-center mt-3">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
