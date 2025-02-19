import { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React from "react";
import { changePassword } from "../utils/api";
import { showToast } from "../utils/showToast";

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .max(64, "New password must be less than 64 characters")
        .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
        .regex(/[a-z]/, "New password must contain at least one lowercase letter")
        .regex(/\d/, "New password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "New password must contain at least one special character"),
    confirmPassword: z
        .string()
        .min(1, "Please confirm your password")
})
    .superRefine((data, ctx) => {
        if (data.newPassword !== data.confirmPassword) {
            ctx.addIssue({
                path: ["confirmPassword"],
                message: "Passwords don't match",
                code: z.ZodIssueCode.custom
            });
        }
    });


type FormFields = z.infer<typeof passwordSchema>;

const PasswordChangeForm = () => {
    const [passwordVisible, setPasswordVisible] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const { register, handleSubmit, formState: { errors, isDirty }, setError, setFocus, watch, reset } = useForm<FormFields>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });
    const watchFields = watch(["newPassword", "confirmPassword"]);
    const watchNewPassword = watchFields[0];
    const watchConfirmPassword = watchFields[1];

    const togglePasswordVisibility = (field: string) => {
        setPasswordVisible(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const onSubmit = async (data: FormFields) => {
        try {
            const response = await changePassword(data);

            if (response.error) {
                if (response.error === "Current password is not correct.") {
                    setError("currentPassword", {
                        type: "manual",
                        message: "Current password is incorrect"
                    });
                    setFocus("currentPassword");
                }
                showToast('Failed to change password: ' + response.error, 'error');
            } else {
                reset();
                showToast('Password changed successfully!', 'success');
            }
        } catch (error) {
            showToast('Unexpected error. Please try again later or contact support.', 'error');
        }
    };

    const passwordCriteria = useMemo(() => [
        { condition: watchNewPassword?.length >= 8 && watchNewPassword?.length <= 64, label: "8 - 64 characters" },
        { condition: /[A-Z]/.test(watchNewPassword), label: "At least one uppercase letter" },
        { condition: /[a-z]/.test(watchNewPassword), label: "At least one lowercase letter" },
        { condition: /\d/.test(watchNewPassword), label: "At least one number" },
        { condition: /[!@#$%^&*(),.?":{}|<>]/.test(watchNewPassword), label: "At least one special character (e.g., ! @ # $ % ^ & *)" },
    ], [watchNewPassword]);


    return (
        <div className="container md:mt-8">
            <h1 className="font-semibold text-lg md:text-2xl lg:text-4xl mt-4 md:mt-8">Manage Security</h1>
            <small className="text-neutral-400 text-sm mt-2 inline-block">Protect Your Data and ensure secure interactions.</small>

            <div className="mt-4">
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="form-section flex flex-col gap-8">
                        {/* Current Password */}
                        <div className="input-container">
                            <label htmlFor="current-password" className="input-label">Current Password</label>
                            <div className="relative">
                                <input
                                    type={passwordVisible.current ? "text" : "password"}
                                    id="current-password"
                                    className="password-input"
                                    placeholder="Enter your password"
                                    {...register("currentPassword")}

                                />
                                <span className="eye-icon" onClick={() => togglePasswordVisibility("current")}>
                                    <i className={`fas ${passwordVisible.current ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </span>
                            </div>

                            {errors.currentPassword && (<div className=" text-red-600 px-2">{errors.currentPassword.message}</div>)}
                        </div>

                        {/* New Password */}
                        <div className="input-container">
                            <label htmlFor="new-password" className="input-label">New Password</label>
                            <div className="relative">
                                <input
                                    type={passwordVisible.new ? "text" : "password"}
                                    id="new-password"
                                    className="password-input"
                                    placeholder="Enter your new password"
                                    {...register("newPassword")}
                                />
                                <span className="eye-icon" onClick={() => togglePasswordVisibility("new")}>
                                    <i className={`fas ${passwordVisible.new ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </span>
                            </div>
                            {errors.newPassword && (<div className="text-red-600 px-2">{errors.newPassword.message}</div>)}
                        </div>

                        {/* Password Criteria */}
                        <ul className="password-criteria flex flex-col gap-2 md:gap-3 px-2 text-xs md:text-lg">
                            {passwordCriteria.map(({ condition, label }, index) => (
                                <li key={index} className={condition ? "passed" : "failed"}>
                                    <span className="icon"><i className="fas fa-check md:text-sm"></i></span> {label}
                                </li>
                            ))}
                        </ul>

                        {/* Confirm Password */}
                        <div className="input-container">
                            <label htmlFor="confirm-password" className="input-label">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={passwordVisible.confirm ? "text" : "password"}
                                    id="confirm-password"
                                    className="password-input"
                                    placeholder="Confirm your new password"
                                    {...register("confirmPassword")}
                                />
                                <span className="eye-icon" onClick={() => togglePasswordVisibility("confirm")}>
                                    <i className={`fas ${passwordVisible.confirm ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </span>
                                {watchNewPassword === watchConfirmPassword && watchNewPassword.length > 0 && (
                                    <span className="check-icon  ">
                                        <i className="fas fa-check"></i>
                                    </span>
                                )}

                            </div>
                            {errors.confirmPassword && (<div className="text-red-600 px-2">{errors.confirmPassword.message}</div>)}
                        </div>

                        {/* Submit Button */}
                        <div className="form-button">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!isDirty}
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div id="toast-container"></div>
        </div>
    );
};

export default PasswordChangeForm;
