import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../features/auth/api/auth.api";
import { AuthInput } from "../../shared/components/AuthInput";
import { AuthButton } from "../../shared/components/AuthButton";
import { Mail, KeyRound, Lock } from "lucide-react";

export const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const authService = AuthService.getInstance();
    const RESEND_OTP_SECONDS = 120;

    const [formData, setFormData] = useState({ email: "", otp: "", password: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSeconds, setResendSeconds] = useState(0);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [resetToken, setResetToken] = useState<string>("");

    useEffect(() => {
        if (step !== 2 || resendSeconds <= 0) {
            return;
        }

        const timer = window.setInterval(() => {
            setResendSeconds((seconds) => Math.max(seconds - 1, 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [step, resendSeconds]);

    const formatResendTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (step === 1) {
                const response = await authService.sendOTP({ email: formData.email });
                if (response.success) {
                    setResendSeconds(RESEND_OTP_SECONDS);
                    setStep(2);
                }
            } else if (step === 2) {
                const response = await authService.verifyOtp({
                    email: formData.email,
                    otp: formData.otp
                });
                if (response.success) {
                    setResetToken(response.data);
                    setStep(3);
                }
            } else if (step === 3) {
                const response = await authService.resetPassword({
                    password: formData.password,
                    resetToken: resetToken
                });
                if (response.success) {
                    // Handle post-success redirection or notification here
                    console.log("Password changed successfully");
                    navigate("/login", { replace: true });
                    return;
                }
            }
        } catch (error: any) {
            setErrors({
                api: error.response?.data?.message || error.message || "An error occurred."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendSeconds > 0 || resendLoading) {
            return;
        }

        setResendLoading(true);
        setErrors({});

        try {
            const response = await authService.sendOTP({ email: formData.email });
            if (response.success) {
                setFormData((prev) => ({ ...prev, otp: "" }));
                setResendSeconds(RESEND_OTP_SECONDS);
            }
        } catch (error: any) {
            setErrors({
                api: error.response?.data?.message || error.message || "Unable to resend OTP."
            });
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div>
            {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div>
                        <h2>Forgot Password</h2>
                        <AuthInput
                            label="Email address"
                            name="email"
                            type="email"
                            icon={Mail}
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            required
                        />
                        <AuthButton type="submit" isLoading={loading} className="auth-btn-submit mt-2">
                            Send OTP
                        </AuthButton>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2>Verify OTP</h2>
                        <AuthInput
                            label="Verification code"
                            name="otp"
                            type="text"
                            icon={KeyRound}
                            placeholder="Enter 6-digit OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            error={errors.otp}
                            required
                        />
                        <AuthButton type="submit" isLoading={loading} className="auth-btn-submit mt-2">
                            Verify Code
                        </AuthButton>
                        <AuthButton
                            type="button"
                            variant="social"
                            isLoading={resendLoading}
                            disabled={resendSeconds > 0 || loading}
                            className="mt-2"
                            onClick={handleResendOtp}
                        >
                            {resendSeconds > 0
                                ? `Resend OTP in ${formatResendTime(resendSeconds)}`
                                : "Resend OTP"}
                        </AuthButton>

                    </div>
                    
                )}

                {step === 3 && (
                    <div>
                        <h2>Reset Password</h2>
                        <AuthInput
                            label="New password"
                            name="password"
                            type="password"
                            icon={Lock}
                            placeholder="Enter new password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            required
                        />
                        <AuthButton type="submit" isLoading={loading} className="auth-btn-submit mt-2">
                            Update Password
                        </AuthButton>
                    </div>
                )}
            </form>
        </div>
    );
};
