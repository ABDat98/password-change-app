import { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React from "react";
import { showToast } from "../utils/showToast";
import { FormFields, passwordSchema } from "../utils/validation";
import { useChangePassword } from "../lib/react-query/mutations";
import PasswordInput from "./PasswordInput";

const PasswordChangeForm = () => {
  
    const { register, handleSubmit, formState: { errors, isDirty }, setError, setFocus, watch, reset } = useForm<FormFields>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const { mutate: changePassword } = useChangePassword()

    const watchFields = watch(["newPassword", "confirmPassword"]);
    const watchNewPassword = watchFields[0];

    

    const onSubmit = (data) => {
        changePassword(data, {
            onSuccess: () => {
                reset();
                showToast("Password changed successfully!", "success");
            },
            onError: (err) => {
                setError("currentPassword", { type: "manual", message: err.message });
                setFocus("currentPassword");
            },
        });
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-section flex flex-col gap-8">
                        {/* Current Password */}
                        <PasswordInput
                            id="current-password"
                            label="Current Password"
                            placeholder="Enter your password"
                            register={register("currentPassword")}
                            error={errors.currentPassword?.message}
                        />

                        {/* New Password */}
                        <PasswordInput
                            id="new-password"
                            label="New Password"
                            placeholder="Enter your new password"
                            register={register("newPassword")}
                            error={errors.newPassword?.message}
                        />

                        <ul className="password-criteria flex flex-col gap-2 md:gap-3 px-2 text-xs md:text-lg">
                            {passwordCriteria.map(({ condition, label }, index) => (
                                <li key={index} className={condition ? "passed" : "failed"}>
                                    <span className="icon"><i className="fas fa-check md:text-sm"></i></span> {label}
                                </li>
                            ))}
                        </ul>

                        {/* Confirm Password */}
                        <PasswordInput
                            id="confirm-password"
                            label="Confirm New Password"
                            placeholder="Confirm your new password"
                            register={register("confirmPassword")}
                            error={errors.confirmPassword?.message}
                            watchValue={watch("confirmPassword")}
                            compareWith={watch("newPassword")}
                        />

                        {/* Submit Button */}
                        <div className="form-button">
                            <button type="submit" className="btn btn-primary" disabled={!isDirty}>
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
