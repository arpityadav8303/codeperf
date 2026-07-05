import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../features/auth/api/auth.api";
import { AuthInput } from "../../shared/components/AuthInput";
import { AuthButton } from "../../shared/components/AuthButton";
import { Mail, KeyRound, Lock } from "lucide-react";
import "./ForgotPassword.css";

export const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const authService = AuthService.getInstance();
    const RESEND_OTP_SECONDS = 120;
    const OTP_LENGTH = 6;

    const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
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

    const updateOtp = (otp: string) => {
        setFormData((prev) => ({ ...prev, otp }));
        if (errors.otp) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated.otp;
                return updated;
            });
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const otpDigits = formData.otp.padEnd(OTP_LENGTH, " ").split("");
        otpDigits[index] = digit || " ";
        const nextOtp = otpDigits.join("").replace(/\s/g, "");

        updateOtp(nextOtp);

        if (digit && index < OTP_LENGTH - 1) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && !formData.otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pastedOtp = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        updateOtp(pastedOtp);
        otpInputRefs.current[Math.min(pastedOtp.length, OTP_LENGTH - 1)]?.focus();
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
                otpInputRefs.current[0]?.focus();
            }
        } catch (error: any) {
            setErrors({
                api: error.response?.data?.message || error.message || "Unable to resend OTP."
            });
        } finally {
            setResendLoading(false);
        }
    };

    const otpDigits = Array.from({ length: OTP_LENGTH }, (_, index) => formData.otp[index] || "");

    return (
        <main className="forgot-page">
            <section className="forgot-card" aria-live="polite">
                <div className="forgot-header">
                    <div className="forgot-icon" aria-hidden="true">
                        {step === 1 && <Mail size={28} />}
                        {step === 2 && <KeyRound size={28} />}
                        {step === 3 && <Lock size={28} />}
                    </div>
                    <div>
                        <p className="forgot-kicker">Account recovery</p>
                        <h1>
                            {step === 1 && "Forgot Password"}
                            {step === 2 && "Verify OTP"}
                            {step === 3 && "Reset Password"}
                        </h1>
                        <p className="forgot-copy">
                            {step === 1 && "Enter your email and we will send a verification code."}
                            {step === 2 && `Enter the 6-digit code sent to ${formData.email}.`}
                            {step === 3 && "Create a new password for your CodePerf account."}
                        </p>
                    </div>
                </div>

                {errors.api && <p className="forgot-alert-error">{errors.api}</p>}

                <form className="forgot-form" onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="forgot-step">
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
                            <AuthButton type="submit" isLoading={loading} className="auth-btn-submit forgot-primary-btn">
                                Send OTP
                            </AuthButton>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="forgot-step">
                            <div className="otp-field-group">
                                <label className="auth-label" htmlFor="otp-0">Verification code</label>
                                <div className="otp-box-row">
                                    {otpDigits.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={index === 0 ? "otp-0" : undefined}
                                            ref={(element) => {
                                                otpInputRefs.current[index] = element;
                                            }}
                                            className={`otp-box ${errors.otp ? "otp-box-error" : ""}`}
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(event) => handleOtpChange(index, event.target.value)}
                                            onKeyDown={(event) => handleOtpKeyDown(index, event)}
                                            onPaste={handleOtpPaste}
                                            aria-label={`OTP digit ${index + 1}`}
                                            required
                                        />
                                    ))}
                                </div>
                                {errors.otp && <span className="forgot-field-error">{errors.otp}</span>}
                            </div>

                            <AuthButton type="submit" isLoading={loading} className="auth-btn-submit forgot-primary-btn">
                                Verify Code
                            </AuthButton>
                            <AuthButton
                                type="button"
                                variant="social"
                                isLoading={resendLoading}
                                disabled={resendSeconds > 0 || loading}
                                className="forgot-secondary-btn"
                                onClick={handleResendOtp}
                            >
                                {resendSeconds > 0
                                    ? `Resend OTP in ${formatResendTime(resendSeconds)}`
                                    : "Resend OTP"}
                            </AuthButton>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="forgot-step">
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
                            <AuthButton type="submit" isLoading={loading} className="auth-btn-submit forgot-primary-btn">
                                Update Password
                            </AuthButton>
                        </div>
                    )}
                </form>
            </section>
        </main>
    );
};
