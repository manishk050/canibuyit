import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ArrowLeft, 
  TrendingUp, 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ChevronDown,
  Target,
  Lightbulb,
  Star,
  Calendar,
  DollarSign,
  Activity,
  CreditCard,
  Home
} from "lucide-react";
import { useState } from "react";

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

interface ResultsProps {
  results: AffordabilityResponse;
  formData: any;
  onBack: () => void;
}

const getCurrencySymbol = (country: string) => {
  const currencyMap: { [key: string]: string } = {
    'india': '₹',
    'usa': '$',
    'united states': '$',
    'canada': 'C$',
    'uk': '£',
    'united kingdom': '£',
    'australia': 'A$',
    'japan': '¥',
    'china': '¥',
    'south korea': '₩',
    'singapore': 'S$',
    'malaysia': 'RM',
    'thailand': '฿',
    'indonesia': 'Rp',
    'philippines': '₱',
    'vietnam': '₫',
    'taiwan': 'NT$',
    'hong kong': 'HK$',
    'new zealand': 'NZ$',
    'south africa': 'R',
    'brazil': 'R$',
    'mexico': 'MX$',
    'germany': '€',
    'france': '€',
    'italy': '€',
    'spain': '€',
    'netherlands': '€',
    'belgium': '€',
    'austria': '€',
    'portugal': '€',
    'ireland': '€',
    'finland': '€',
    'greece': '€',
    'switzerland': 'CHF',
    'norway': 'kr',
    'sweden': 'kr',
    'denmark': 'kr',
    'poland': 'zł',
    'czech republic': 'Kč',
    'hungary': 'Ft',
    'russia': '₽',
    'turkey': '₺',
    'israel': '₪',
    'uae': 'AED',
    'saudi arabia': 'SR',
    'qatar': 'QR',
    'kuwait': 'KD',
    'bahrain': 'BD',
    'oman': 'OR',
    'egypt': 'E£',
    'nigeria': '₦',
    'kenya': 'KSh',
    'ghana': 'GH₵',
    'morocco': 'MAD',
    'algeria': 'DA',
    'tunisia': 'DT',
    'chile': 'CL$',
    'argentina': 'AR$',
    'colombia': 'CO$',
    'peru': 'S/',
    'ecuador': '$',
    'uruguay': 'UY$',
    'paraguay': 'Gs',
    'bolivia': 'Bs',
    'venezuela': 'Bs.S'
  };
  
  return currencyMap[country.toLowerCase()] || '$';
};

export function AffordabilityResults({ results, formData, onBack }: ResultsProps) {
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const getScoreValue = (score: string | number) => {
    if (typeof score === 'number') {
      return score;
    }
    const match = score.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-500";
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getCreditScoreColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case "very good":
        return "text-emerald-600 bg-emerald-50";
      case "good":
        return "text-blue-600 bg-blue-50";
      case "average":
        return "text-orange-600 bg-orange-50";
      case "bad":
      case "very bad":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTimelineSteps = (actionPlan: string[]) => {
    const steps = Math.ceil(actionPlan.length / 3);
    return [
      { title: "Days 1-30", actions: actionPlan.slice(0, steps) },
      { title: "Days 31-60", actions: actionPlan.slice(steps, steps * 2) },
      { title: "Days 61-90", actions: actionPlan.slice(steps * 2) }
    ];
  };

  const scoreValue = getScoreValue(results["Affordability Score"]);
  const emergencyMonths =
    typeof results["Emergency Fund Survival (Months)"] === "number"
      ? results["Emergency Fund Survival (Months)"]
      : parseFloat(results["Emergency Fund Survival (Months)"] || "0");
  const currency = getCurrencySymbol(formData?.country || 'usa');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 hover:bg-white/60"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Can You Afford It?</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Make smarter financial decisions with our intelligent affordability calculator.
              Get personalized insights about your purchasing power and savings goals.
            </p>
          </div>
        </div>

        {/* Product Summary Card */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Analysis</h2>
                <p className="text-gray-600">Based on your financial profile</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Affordability Score</div>
                <div className={`text-4xl font-bold ${getScoreColor(scoreValue)}`}>
                  {scoreValue}<span className="text-lg">/100</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  scoreValue >= 80 ? 'bg-emerald-500' :
                  scoreValue >= 60 ? 'bg-blue-500' :
                  scoreValue >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${scoreValue}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Verdict */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verdict</h2>
              <p className="text-gray-600">{results["Verdict"]}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Financial Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Financial Profile Table */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Your Financial Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="font-medium text-gray-700">DTI (Current)</div>
                  <div className="text-right">
                    <Badge className={`${getRiskColor(results["Existing DTI"]["Risk"])} border text-xs`}>
                      {results["Existing DTI"]["Percentage"]}
                    </Badge>
                  </div>
                  
                  <div className="font-medium text-gray-700">DTI (After Purchase)</div>
                  <div className="text-right">
                    <Badge className={`${getRiskColor(results["DTI After Purchase"]["Risk"])} border text-xs`}>
                      {results["DTI After Purchase"]["Percentage"]}
                    </Badge>
                  </div>
                  
                  <div className="font-medium text-gray-700">Emergency Fund</div>
                  <div className="text-right font-semibold text-gray-900">
                    {emergencyMonths} months
                  </div>
                  
                  <div className="font-medium text-gray-700">Credit Score</div>
                  <div className="text-right">
                    <Badge className={`${getCreditScoreColor(results["Credit Score Rating"])} border text-xs`}>
                      {results["Credit Score Rating"]}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {results["Existing DTI"]["Percentage"]}
                  </div>
                  <div className="text-xs text-gray-600">DTI</div>
                  <div className={`text-xs mt-1 ${
                    results["Existing DTI"]["Risk"].toLowerCase() === 'low' ? 'text-emerald-600' :
                    results["Existing DTI"]["Risk"].toLowerCase() === 'medium' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {results["Existing DTI"]["Risk"]} Risk
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {emergencyMonths}
                  </div>
                  <div className="text-xs text-gray-600">Emergency Fund</div>
                  <div className={`text-xs mt-1 ${emergencyMonths >= 6 ? 'text-emerald-600' : emergencyMonths >= 3 ? 'text-orange-600' : 'text-red-600'}`}>
                    {emergencyMonths >= 6 ? 'Good' : emergencyMonths >= 3 ? 'Fair' : 'Critical'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">752</div>
                  <div className="text-xs text-gray-600">Credit Score</div>
                  <div className="text-xs mt-1 text-blue-600">
                    {results["Credit Score Rating"]}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">
                    {results["DTI After Purchase"]["Percentage"]}
                  </div>
                  <div className="text-xs text-gray-600">After DTI</div>
                  <div className={`text-xs mt-1 ${
                    results["DTI After Purchase"]["Risk"].toLowerCase() === 'low' ? 'text-emerald-600' :
                    results["DTI After Purchase"]["Risk"].toLowerCase() === 'medium' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {results["DTI After Purchase"]["Risk"]} Risk
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Impact */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                  <AlertCircle className="w-5 h-5" />
                  Budget Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Monthly Budget</span>
                    <span className="font-semibold text-gray-900">{currency}{results["Budget Impact Analysis"]["Monthly Budget"]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Budget Utilization</span>
                    <span className="font-semibold text-red-600">{results["Budget Impact Analysis"]["Budget Utilization %"]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Emergency Fund Balance</span>
                    <span className="font-semibold text-gray-900">{results["Budget Impact Analysis"]["Emergency Fund Balance"]}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                  {results["Budget Impact Analysis"]["Report"]}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analysis & Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Credit Score Analysis */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Credit Score Analysis (740-799)
                </CardTitle>
                <CardDescription>About average credit profile with good lending terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-emerald-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Current Benefits
                    </h4>
                    <ul className="space-y-2">
                      {results["Credit Score Analysis"] && results["Credit Score Analysis"]["Current Benefits"] && results["Credit Score Analysis"]["Current Benefits"].map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Disadvantages
                    </h4>
                    <ul className="space-y-2">
                      {results["Credit Score Analysis"] && results["Credit Score Analysis"]["Disadvantages"] && results["Credit Score Analysis"]["Disadvantages"].map((disadvantage, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{disadvantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-700 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Improvement Actions
                    </h4>
                    <ul className="space-y-2">
                      {results["Credit Score Analysis"] && results["Credit Score Analysis"]["Improvement Tips"] && results["Credit Score Analysis"]["Improvement Tips"].map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Financing Recommendations */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-3 text-blue-800">Financing Recommendations</h4>
                  <ul className="space-y-2">
                    {results["Credit Score Analysis"] && results["Credit Score Analysis"]["Recommendations"] && results["Credit Score Analysis"]["Recommendations"].map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Fund Analysis */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Emergency Fund Analysis
                </CardTitle>
                <CardDescription>Critical for handling financial emergencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">{currency}{results["Emergency Fund Analysis"]["Recommended Emergency Funds"]}</div>
                      <div className="text-xs text-orange-700">Recommended</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600 mb-1">{currency}{results["Emergency Fund Analysis"]["ShortfallOrSurplus"]}</div>
                      <div className="text-xs text-red-700">Shortfall/Surplus</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{currency}{results["Emergency Fund Analysis"]["Monthly Target"]}</div>
                      <div className="text-xs text-green-700">Monthly Target</div>
                    </CardContent>
                  </Card>
                </div>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">
                    <span className="font-medium text-orange-800">Why Emergency Funds Matter</span>
                    <ChevronDown className="w-4 h-4 text-orange-600" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 text-gray-700 text-sm leading-relaxed">
                    {results["Emergency Fund Analysis"]["Importance"]}
                  </CollapsibleContent>
                </Collapsible>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold mb-2 text-blue-800">Building Strategy</h4>
                    <p className="text-sm text-blue-700">{results["Emergency Fund Analysis"]["Building Strategy"]}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold mb-2 text-purple-800">Action Plan to Reach Goal</h4>
                    <p className="text-sm text-purple-700">{results["Emergency Fund Analysis"]["Action Plan"]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personalized Advice */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-purple-800">
                  <Lightbulb className="w-5 h-5" />
                  Personalized Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/60 rounded-lg border border-purple-200">
                      <h4 className="font-semibold mb-2 text-purple-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Reconsider This Purchase
                      </h4>
                      <p className="text-sm text-purple-700">{results["Personalized Advice"]}</p>
                    </div>
                    
                    <div className="p-4 bg-white/60 rounded-lg border border-blue-200">
                      <h4 className="font-semibold mb-2 text-blue-800 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Build Liquid Financial Foundation
                      </h4>
                      <p className="text-sm text-blue-700">Focus on creating a balanced foundation for long-term financial security with liquid emergency reserves.</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-purple-800">Financial Wellness Tips</h4>
                    <ul className="space-y-2">
                      {results["Financial Wellness Tips"] && results["Financial Wellness Tips"].slice(0, 5).map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-purple-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* How You Can Afford This */}
              <Card className="bg-green-50 border-green-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                    <CheckCircle2 className="w-5 h-5" />
                    How You Can Afford This
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results["How You Can Afford This"] && results["How You Can Afford This"].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-green-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Minimum Requirements */}
              <Card className="bg-red-50 border-red-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    Minimum Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results["Minimum Requirements"] && results["Minimum Requirements"].map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-red-800">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Financial Growth Strategies */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Financial Growth Strategies
                </CardTitle>
                <CardDescription>Build wealth and improve your financial future</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-800">Income Growth</h4>
                    <ol className="space-y-2">
                      {results["In-depth Financial Growth Strategy"] && results["In-depth Financial Growth Strategy"].slice(0, Math.ceil(results["In-depth Financial Growth Strategy"].length / 2)).map((strategy, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm text-gray-700">{strategy}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-green-800">Smart Spending</h4>
                    <ol className="space-y-2">
                      {results["In-depth Financial Growth Strategy"] && results["In-depth Financial Growth Strategy"].slice(Math.ceil(results["In-depth Financial Growth Strategy"].length / 2)).map((strategy, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {index + Math.ceil(results["In-depth Financial Growth Strategy"].length / 2) + 1}
                          </div>
                          <span className="text-sm text-gray-700">{strategy}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Long-term Wealth Building */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-3 text-green-800">Long-term Wealth Building Strategies</h4>
                  <ol className="space-y-2">
                    {results["Long-term Wealth Building Strategy"] && results["Long-term Wealth Building Strategy"].map((strategy, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm text-green-800">{strategy}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* 90-Day Action Plan */}
            <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <Calendar className="w-6 h-6" />
                  Your 90-Day Action Plan
                </CardTitle>
                <CardDescription className="text-purple-100">Start improving your financial position today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results["90-day Action Plan"] && getTimelineSteps(results["90-day Action Plan"]).map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-lg text-white">{step.title}</h4>
                      </div>
                      <ul className="space-y-2 ml-13">
                        {step.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-purple-200 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-purple-100">{action}</span>
                          </li>
                        ))}
                      </ul>
                      {index < 2 && (
                        <div className="hidden md:block absolute top-5 -right-3 w-6 h-0.5 bg-purple-300" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}