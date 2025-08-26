import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Calculator, DollarSign, MapPin, TrendingUp } from "lucide-react";
import { AffordabilityResults } from "./AffordabilityResults";

interface FormData {
  country: string;
  state: string;
  city: string;
  email: string;
  phone: string;
  annualSalary: string;
  monthlyExpenses: string;
  monthlyInvestments: string;
  monthlyDebt: string;
  creditScore: string;
  emergencyFunds: string;
  productName: string;
  productPrice: string;
  downPayment: string;
  interestRate: string;
  loanTerm: string;
}

interface AffordabilityResponse {
  "Affordability Score": number;
  "Verdict": string;
  "Existing DTI": {
    "Percentage": string;
    "Risk": string;
  };
  "DTI After Purchase": {
    "Percentage": string;
    "Risk": string;
  };
  "Emergency Fund Survival (Months)": string | number;
  "Credit Score Rating": string;
  "Budget Impact Analysis": {
    "Monthly Budget": number;
    "Budget Utilization %": string;
    "Emergency Fund Balance": string | number;
    "Report": string;
  };
  "Credit Score Analysis": {
    "Current Benefits": string[];
    "Disadvantages": string[];
    "Improvement Tips": string[];
    "Recommendations": string[];
  };
  "Emergency Fund Analysis": {
    "Recommended Emergency Funds": number;
    "ShortfallOrSurplus": number;
    "Monthly Target": number;
    "Importance": string;
    "Building Strategy": string;
    "Action Plan": string;
  };
  "Personalized Advice": string;
  "Financial Wellness Tips": string[];
  "How You Can Afford This": string[];
  "Minimum Requirements": string[];
  "In-depth Financial Growth Strategy": string[];
  "Long-term Wealth Building Strategy": string[];
  "90-day Action Plan": string[];
}

export function AffordabilityForm() {
  const [formData, setFormData] = useState<FormData>({
    country: "",
    state: "",
    city: "",
    email: "",
    phone: "",
    annualSalary: "",
    monthlyExpenses: "",
    monthlyInvestments: "",
    monthlyDebt: "",
    creditScore: "",
    emergencyFunds: "",
    productName: "",
    productPrice: "",
    downPayment: "",
    interestRate: "",
    loanTerm: "",
  });

  const [results, setResults] = useState<AffordabilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        "Country": formData.country,
        "State": formData.state,
        "City": formData.city,
        "Email": formData.email,
        "Phone": formData.phone,
        "Annual in-hand salary": Number(formData.annualSalary),
        "Monthly Expenses": Number(formData.monthlyExpenses),
        "Monthly Investments": Number(formData.monthlyInvestments),
        "Monthly Debt": Number(formData.monthlyDebt),
        "Credit Score": Number(formData.creditScore),
        "Emergency funds (if any)": Number(formData.emergencyFunds) || 0,
        "Product Name": formData.productName,
        "Product Price": Number(formData.productPrice),
        "Down Payment (if financing)": Number(formData.downPayment) || 0,
        "Interest Rate (if financing)": Number(formData.interestRate) || 0,
        "Loan Term (Months)": Number(formData.loanTerm) || 0,
      };

      const response = await fetch("https://n8n.techzard.fun/webhook/personal-finance-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to get affordability analysis");
      }

      const result = await response.json();
      setResults(result);
      
      toast({
        title: "Analysis Complete",
        description: "Your financial affordability report is ready!",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze affordability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (results) {
    return <AffordabilityResults results={results} formData={formData} onBack={() => setResults(null)} />;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-info rounded-full mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Affordability Checker</h1>
          <p className="text-xl text-muted-foreground">
            Make informed financial decisions with our comprehensive analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-secondary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your location details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="e.g., India"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="e.g., Maharashtra"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="e.g., Mumbai"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="e.g., john.doe@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="e.g., +1234567890"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-secondary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-success" />
                <div>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>Your current financial situation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annualSalary">Annual In-hand Salary</Label>
                <Input
                  id="annualSalary"
                  type="number"
                  value={formData.annualSalary}
                  onChange={(e) => handleInputChange("annualSalary", e.target.value)}
                  placeholder="600000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  value={formData.monthlyExpenses}
                  onChange={(e) => handleInputChange("monthlyExpenses", e.target.value)}
                  placeholder="30000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyInvestments">Monthly Investments</Label>
                <Input
                  id="monthlyInvestments"
                  type="number"
                  value={formData.monthlyInvestments}
                  onChange={(e) => handleInputChange("monthlyInvestments", e.target.value)}
                  placeholder="10000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyDebt">Monthly Debt</Label>
                <Input
                  id="monthlyDebt"
                  type="number"
                  value={formData.monthlyDebt}
                  onChange={(e) => handleInputChange("monthlyDebt", e.target.value)}
                  placeholder="5000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditScore">Credit Score (300-900)</Label>
                <Input
                  id="creditScore"
                  type="number"
                  min="300"
                  max="900"
                  value={formData.creditScore}
                  onChange={(e) => handleInputChange("creditScore", e.target.value)}
                  placeholder="780"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyFunds">Emergency Funds (Optional)</Label>
                <Input
                  id="emergencyFunds"
                  type="number"
                  value={formData.emergencyFunds}
                  onChange={(e) => handleInputChange("emergencyFunds", e.target.value)}
                  placeholder="20000"
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Purchase Details */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-secondary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-warning" />
                <div>
                  <CardTitle>Product Purchase Details</CardTitle>
                  <CardDescription>What you're planning to buy</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) => handleInputChange("productName", e.target.value)}
                  placeholder="iPhone 15"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productPrice">Product Price</Label>
                <Input
                  id="productPrice"
                  type="number"
                  value={formData.productPrice}
                  onChange={(e) => handleInputChange("productPrice", e.target.value)}
                  placeholder="80000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment (Optional)</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={formData.downPayment}
                  onChange={(e) => handleInputChange("downPayment", e.target.value)}
                  placeholder="20000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate % (Optional)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => handleInputChange("interestRate", e.target.value)}
                  placeholder="12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (Months, Optional)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={formData.loanTerm}
                  onChange={(e) => handleInputChange("loanTerm", e.target.value)}
                  placeholder="24"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="px-12 py-3 text-lg font-semibold bg-gradient-to-r from-primary to-info hover:from-primary/90 hover:to-info/90 transition-all duration-300 shadow-lg"
            >
              {isLoading ? "Analyzing..." : "Check Affordability"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}