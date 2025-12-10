import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft, Mail, Lock, User, Sparkles, Phone, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";
import logo from "@/assets/logo.png";

type SignupStep = "details" | "otp";
type AuthMode = "login" | "signup" | "forgot";

const Auth = () => {
  const { t } = useLanguage();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [signupStep, setSignupStep] = useState<SignupStep>("details");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock OTP code for demo purposes
  const MOCK_OTP = "123456";

  // Password strength validation
  const isPasswordStrong = useMemo(() => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password)
    );
  }, [password]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const checkDuplicatePhone = async (phone: string): Promise<boolean> => {
    const formattedPhone = `+65${phone}`;
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("phone_number", formattedPhone)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking phone:", error);
      return false;
    }
    return !!data;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      if (error) throw error;
      setResetEmailSent(true);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "login") {
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
      // Validate password strength
      if (!isPasswordStrong) {
        toast.error("Please create a stronger password");
        return;
      }

      // Validate phone number format (Singapore: 8 digits starting with 8 or 9)
      const phoneRegex = /^[89]\d{7}$/;
      if (!phoneRegex.test(phoneNumber)) {
        toast.error("Please enter a valid Singapore phone number (8 digits starting with 8 or 9)");
        return;
      }

      // Check for duplicate phone number
      setLoading(true);
      const isDuplicate = await checkDuplicatePhone(phoneNumber);
      setLoading(false);
      
      if (isDuplicate) {
        toast.error("This phone number is already registered");
        return;
      }

      // Move to OTP step
      setSignupStep("otp");
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
      // Create the account with phone number in metadata
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: name,
            phone_number: `+65${phoneNumber}`
          }
        }
      });
      if (error) throw error;
      toast.success("Account created successfully!");
      resetForm();
      setAuthMode("login");
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
    setResetEmailSent(false);
  };
  const handleBackToDetails = () => {
    setSignupStep("details");
    setOtpValue("");
  };
  const switchAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    resetForm();
  };
  return <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary-light flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t.auth.backToHome}</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="GenBridgeSG Logo" className="h-20 w-auto object-contain mx-auto mb-4" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Gen<span className="text-gradient-hero">Bridge</span>SG
            </h1>
            <p className="text-muted-foreground">
              {t.auth.connectShareGrow}
            </p>
          </div>

          {/* Auth Card */}
          <Card className="border-0 shadow-elevated">
            <CardHeader className="text-center pb-4">
              <CardTitle className="font-display text-2xl">
                {authMode === "forgot" ? t.auth.resetPassword : authMode === "login" ? t.auth.welcomeBack : signupStep === "otp" ? t.auth.verifyPhone : t.auth.joinCommunity}
              </CardTitle>
              <CardDescription className="text-base">
                {authMode === "forgot" ? (resetEmailSent ? t.auth.checkEmailReset : t.auth.enterEmailReset) : authMode === "login" ? t.auth.signInContinue : signupStep === "otp" ? `${t.auth.enterOtpCode} +65 ${phoneNumber}` : t.auth.createAccountStart}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Forgot Password Flow */}
              {authMode === "forgot" ? (
                resetEmailSent ? (
                  <div className="space-y-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto">
                      <Mail className="w-8 h-8" />
                    </div>
                    <p className="text-muted-foreground">
                      {t.auth.emailSent} <strong>{email}</strong>
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => switchAuthMode("login")}>
                      {t.auth.backToSignIn}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="text-base font-medium">
                        {t.auth.emailAddress}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="reset-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-12 h-14 text-base" required />
                      </div>
                    </div>
                    <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
                      {loading ? t.auth.sending : t.auth.sendResetLink}
                    </Button>
                    <Button type="button" variant="ghost" className="w-full" onClick={() => switchAuthMode("login")}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t.auth.backToSignIn}
                    </Button>
                  </form>
                )
              ) : authMode === "signup" && signupStep === "otp" ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
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
                    
                  </div>

                  <Button onClick={handleOtpVerify} variant="hero" size="xl" className="w-full" disabled={loading || otpValue.length !== 6}>
                    {loading ? t.auth.creatingAccount : t.auth.verifyCreate}
                  </Button>

                  <Button type="button" variant="ghost" className="w-full" onClick={handleBackToDetails}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.auth.backToDetails}
                  </Button>
                </div>
              ) : (/* Details Form */
            <form onSubmit={handleDetailsSubmit} className="space-y-5">
                  {authMode === "signup" && <>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-medium">
                          {t.auth.fullName}
                        </Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input id="name" type="text" placeholder={t.auth.enterName} value={name} onChange={e => setName(e.target.value)} className="pl-12 h-14 text-base" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-base font-medium">
                          {t.auth.phoneNumber}
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <div className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                            +65
                          </div>
                          <Input id="phone" type="tel" placeholder="8123 4567" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 8))} className="pl-24 h-14 text-base" required maxLength={8} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t.auth.sgMobileNumber}
                        </p>
                      </div>
                    </>}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      {t.auth.emailAddress}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-12 h-14 text-base" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium">
                      {t.auth.password}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-12 pr-12 h-14 text-base" required minLength={8} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {authMode === "signup" && <PasswordStrengthIndicator password={password} />}
                  </div>

                  <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
                    {loading ? t.auth.pleaseWait : <>
                        {authMode === "login" ? t.auth.signIn : t.auth.continue}
                        <Sparkles className="ml-2 w-5 h-5" />
                      </>}
                  </Button>

                  {authMode === "login" && (
                    <button
                      type="button"
                      onClick={() => switchAuthMode("forgot")}
                      className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t.auth.forgotPassword}
                    </button>
                  )}
                </form>)}

              {/* Toggle - only show when not in OTP step */}
              {(authMode === "login" || (authMode === "signup" && signupStep === "details")) && <div className="mt-8 text-center">
                  <p className="text-muted-foreground">
                    {authMode === "login" ? t.auth.noAccount : t.auth.hasAccount}
                  </p>
                  <button type="button" onClick={() => {
                switchAuthMode(authMode === "login" ? "signup" : "login");
              }} className="mt-2 font-semibold text-primary hover:text-primary-dark transition-colors">
                    {authMode === "login" ? t.auth.signUpFree : t.auth.signInInstead}
                  </button>
                </div>}
            </CardContent>
          </Card>

          {/* Trust badges */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              🔒 {t.auth.dataSafe} • 🇸🇬 {t.auth.madeInSg}
            </p>
          </div>
        </div>
      </main>
    </div>;
};
export default Auth;