"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateName = (name: string) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      return "Name can only contain letters and spaces";
    }
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*)";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (confirmPassword !== formData.password) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
    setServerError(null);
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword)
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password
          }),
        }
      );
      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setServerError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setServerError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-800 p-6">
      <div className="container flex justify-center items-center">
        <form
          className="flex flex-col gap-6 w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800 border border-gray-300"
          onSubmit={handleSubmit}
          style={{
            boxShadow:
              "0 0 10px rgba(0, 255, 255, 0.7), 0 0 20px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3)",
          }}
        >
          <h1 className="font-bold text-2xl text-center text-white">
            Create Your Account
          </h1>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => setErrors(prev => ({ ...prev, name: validateName(formData.name) }))}
              placeholder="Name"
              className={`p-3 border border-solid ${
                errors.name ? 'border-red-500' : 'border-teal-400'
              } text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => setErrors(prev => ({ ...prev, email: validateEmail(formData.email) }))}
              placeholder="Email"
              className={`p-3 border border-solid ${
                errors.email ? 'border-red-500' : 'border-teal-400'
              } text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => setErrors(prev => ({ ...prev, password: validatePassword(formData.password) }))}
              placeholder="Password"
              className={`p-3 border border-solid ${
                errors.password ? 'border-red-500' : 'border-teal-500'
              } text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(formData.confirmPassword) }))}
              placeholder="Confirm Password"
              className={`p-3 border border-solid ${
                errors.confirmPassword ? 'border-red-500' : 'border-teal-500'
              } text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="bg-teal-700 p-3 text-white font-bold w-full rounded-md hover:bg-teal-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          {serverError && (
            <p className="text-red-500 text-sm text-center">{serverError}</p>
          )}

          <Link href="/login" className="text-center">
            <button 
              type="button"
              className="text-red-500 font-bold w-full rounded-md transition duration-300"
              disabled={isSubmitting}
            >
              {"Already have an account?"}{" "}
              <span className="text-yellow-500 hover:text-teal-800">Sign In</span>
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}