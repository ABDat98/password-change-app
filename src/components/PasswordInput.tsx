import React from "react";
import { useState } from "react";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  register: any;
  error?: string;
  watchValue?: string; // For confirm password validation
  compareWith?: string; // Value to compare for confirm password
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label,
  placeholder,
  register,
  error,
  watchValue,
  compareWith,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-container">
      <label htmlFor={id} className="input-label">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          id={id}
          className="password-input"
          placeholder={placeholder}
          {...register}
        />
        <span className="eye-icon" onClick={() => setVisible(!visible)}>
          <i className={`fas ${visible ? "fa-eye-slash" : "fa-eye"}`}></i>
        </span>

        {/* Show check icon if passwords match */}
        {compareWith && watchValue === compareWith && watchValue.length > 0 && (
          <span className="check-icon">
            <i className="fas fa-check"></i>
          </span>
        )}
      </div>

      {error && <div className="text-red-600 px-2">{error}</div>}
    </div>
  );
};

export default PasswordInput;
