import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft, Mail, Lock, User, Sparkles, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type SignupStep = "details" | "otp";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState<SignupStep>("details");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock OTP code for demo purposes
  const MOCK_OTP = "123456";

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Handle login
      setLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    } else {
      // Validate phone number format (Singapore: 8 digits starting with 8 or 9)
      const phoneRegex = /^[89]\d{7}$/;
      if (!phoneRegex.test(phoneNumber)) {
        toast.error("Please enter a valid Singapore phone number (8 digits starting with 8 or 9)");
        return;
      }
      
      // Move to OTP step
      setSignupStep("otp");
      toast.info("Demo mode: Use OTP code 123456 to verify");
    }
  };

  const handleOtpVerify = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    // Verify mock OTP
    if (otpValue !== MOCK_OTP) {
      toast.error("Invalid OTP code. Demo mode: Use 123456");
      return;
    }

    setLoading(true);
    try {
      // Create the account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) throw error;

      // Update the profile with phone number
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ phone_number: `+65${phoneNumber}` })
          .eq("user_id", data.user.id);
        
        if (profileError) {
          console.error("Error updating phone number:", profileError);
        }
      }

      toast.success("Account created successfully!");
      resetForm();
      setIsLogin(true);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setPhoneNumber("");
    setOtpValue("");
    setSignupStep("details");
  };

  const handleBackToDetails = () => {
    setSignupStep("details");
    setOtpValue("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary-light flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-glow">
              <Heart className="w-8 h-8 text-primary-foreground heartbeat" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Gen<span className="text-gradient-hero">Bridge</span>SG
            </h1>
            <p className="text-muted-foreground">
              Connect. Share. Grow together.
            </p>
          </div>

          {/* Auth Card */}
          <Card className="border-0 shadow-elevated">
            <CardHeader className="text-center pb-4">
              <CardTitle className="font-display text-2xl">
                {isLogin 
                  ? "Welcome Back" 
                  : signupStep === "otp" 
                    ? "Verify Your Phone" 
                    : "Join Our Community"
                }
              </CardTitle>
              <CardDescription className="text-base">
                {isLogin 
                  ? "Sign in to continue your skill-sharing journey" 
                  : signupStep === "otp"
                    ? `Enter the 6-digit code sent to +65 ${phoneNumber}`
                    : "Create an account to start exchanging skills"
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* OTP Verification Step */}
              {!isLogin && signupStep === "otp" ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={setOtpValue}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Demo mode: Use code <span className="font-mono font-bold text-primary">123456</span></p>
                  </div>

                  <Button 
                    onClick={handleOtpVerify}
                    variant="hero" 
                    size="xl" 
                    className="w-full"
                    disabled={loading || otpValue.length !== 6}
                  >
                    {loading ? "Creating account..." : "Verify & Create Account"}
                  </Button>

                  <Button 
                    type="button"
                    variant="ghost" 
                    className="w-full"
                    onClick={handleBackToDetails}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to details
                  </Button>
                </div>
              ) : (
                /* Details Form */
                <form onSubmit={handleDetailsSubmit} className="space-y-5">
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-medium">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-12 h-14 text-base"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-base font-medium">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <div className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                            +65
                          </div>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="8123 4567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 8))}
                            className="pl-24 h-14 text-base"
                            required
                            maxLength={8}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Singapore mobile number (8 digits)
                        </p>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 h-14 text-base"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="xl" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      "Please wait..."
                    ) : (
                      <>
                        {isLogin ? "Sign In" : "Continue"}
                        <Sparkles className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Toggle - only show when not in OTP step */}
              {(isLogin || signupStep === "details") && (
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      resetForm();
                    }}
                    className="mt-2 font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    {isLogin ? "Sign up for free" : "Sign in instead"}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trust badges */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              🔒 Your data is safe with us • 🇸🇬 Made in Singapore
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;