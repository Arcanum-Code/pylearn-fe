"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { loginFormSchema, LoginFormData } from "../schemas/loginFormSchema";
import { AUTH_MESSAGES } from "../lib/messages";
import { extractApiError } from "@/lib/error";

/**
 * Hook for managing the login form state and submission.
 * 
 * This hook provides:
 * - Form state management with react-hook-form
 * - Zod schema validation
 * - Password visibility toggle
 * - Error handling and display via toast notifications
 * - Integration with AuthContext for login
 * 
 * @example
 * const { form, passwordVisible, togglePasswordVisibility, onSubmit, clearRootError } = useLoginForm();
 * 
 * return (
 *   <form onSubmit={onSubmit}>
 *     <input {...form.register("email")} />
 *     <input type={passwordVisible ? "text" : "password"} {...form.register("password")} />
 *     <button type="button" onClick={togglePasswordVisibility}>Toggle</button>
 *     <button type="submit">Login</button>
 *   </form>
 * );
 */
export const useLoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      user_id: "",
      password: "",
    },
  });

  /**
   * Clears the root-level form error.
   * Used to remove previous error messages before submitting again.
   */
  const clearRootError = () => {
    if (form.formState.errors.root) {
      form.clearErrors("root");
    }
  };

  /**
   * Handles form submission.
   * 1. Calls login from AuthContext
   * 2. Shows success toast and refreshes the page on success
   * 3. Shows error toast and sets field errors on failure
   */
  const onSubmit = async (values: LoginFormData) => {
    try {
      await login(values);

      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);

      router.refresh();
    } catch (error: any) {
      const { message, issues } = extractApiError(error);

      toast.error(AUTH_MESSAGES.LOGIN_ERROR, {
        description: message,
      });

      // Set field-level errors from the API response
      issues.forEach((issue) => {
        form.setError(issue.field as any, {
          message: issue.message,
        });
      });

      // Fallback: set root error if no field errors
      if (issues.length === 0) {
        form.setError("root", { message });
      }
    }
  };

  return {
    form,
    passwordVisible,
    togglePasswordVisibility: () => setPasswordVisible((prev) => !prev),
    onSubmit: form.handleSubmit(onSubmit),
    clearRootError,
  };
};
