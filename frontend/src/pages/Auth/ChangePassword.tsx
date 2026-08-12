import React, { useState } from "react";
import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { NavBar } from "../../shared/components/NavBar";
import { useChangePasswordMutation } from "../../features/auth/hooks/useAuthMutation";
import { useMe } from "../../features/auth/hooks/useMe";
import "./ChangePassword.css";

export const ChangePassword: React.FC = () => {
    const { mutate: changePassword, isPending, isError, error, isSuccess } = useChangePasswordMutation();
    const [password, setPassword] = useState({ oldPassword: "", newPassword: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPassword((previous) => ({ ...previous, [name]: value }));
        if (errors[name]) setErrors((previous) => ({ ...previous, [name]: "" }));
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = {
            oldPassword: password.oldPassword ? "" : "Current password is required.",
            newPassword: password.newPassword ? "" : "New password is required.",
        };
        if (nextErrors.oldPassword || nextErrors.newPassword) {
            setErrors(nextErrors);
            return;
        }
        changePassword(password, { onSuccess: () => setPassword({ oldPassword: "", newPassword: "" }) });
    };

    const { data } = useMe();
    const username = (data?.data as { name?: string } | undefined)?.name || (data as { name?: string } | undefined)?.name || "Developer";

    return (
        <main className="change-password-page">
            <div className="change-password-shell">
                <NavBar username={username} />
                <section className="change-password-content" aria-labelledby="change-password-title">
                    <article className="change-password-card">
                        <header className="change-password-header">
                            <span className="change-password-icon" aria-hidden="true"><KeyRound size={25} /></span>
                            <div>
                                <p className="change-password-kicker">Account security</p>
                                <h1 id="change-password-title">Change password</h1>
                                <p>Choose a strong password you do not use on other services.</p>
                            </div>
                        </header>
                        <form className="change-password-form" onSubmit={onSubmit} noValidate>
                            <div className="change-password-field">
                                <label htmlFor="oldPassword">Current password</label>
                                <div className="change-password-input-wrap">
                                    <LockKeyhole size={18} aria-hidden="true" />
                                    <input id="oldPassword" type="password" name="oldPassword" autoComplete="current-password" placeholder="Enter your current password" value={password.oldPassword} onChange={handleChange} aria-describedby={errors.oldPassword ? "oldPassword-error" : undefined} aria-invalid={Boolean(errors.oldPassword)} />
                                </div>
                                {errors.oldPassword && <span id="oldPassword-error" className="change-password-field-error">{errors.oldPassword}</span>}
                            </div>
                            <div className="change-password-field">
                                <label htmlFor="newPassword">New password</label>
                                <div className="change-password-input-wrap">
                                    <ShieldCheck size={18} aria-hidden="true" />
                                    <input id="newPassword" type="password" name="newPassword" autoComplete="new-password" placeholder="Create a new password" value={password.newPassword} onChange={handleChange} aria-describedby={errors.newPassword ? "newPassword-error" : "password-guidance"} aria-invalid={Boolean(errors.newPassword)} />
                                </div>
                                {errors.newPassword ? <span id="newPassword-error" className="change-password-field-error">{errors.newPassword}</span> : <span id="password-guidance" className="change-password-guidance">Use a unique password with a mix of letters, numbers, and symbols.</span>}
                            </div>
                            {isSuccess && <p className="change-password-alert change-password-alert-success" role="status">Password updated successfully.</p>}
                            {isError && <p className="change-password-alert change-password-alert-error" role="alert">{error?.message || "Unable to update your password. Please try again."}</p>}
                            <button className="change-password-submit" type="submit" disabled={isPending}>{isPending ? "Updating password..." : "Update password"}</button>
                        </form>
                    </article>
                </section>
            </div>
        </main>
    );
};
