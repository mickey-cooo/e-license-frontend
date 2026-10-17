"use server";

import { instance } from "@/lib/instance";
import { apiError } from "@/lib/helper/api-error";

export interface LoginBodyInterface {
  email: string;
  password: string;
}

export interface RegisterBodyInterface {
  email: string;
  password: string;
  confirmPassword: string;
}

export async function signIn(body: LoginBodyInterface) {
  try {
    const response = await instance.post("/api/v1/user/sign-in", {
      email: body.email,
      password: body.password,
    });
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to reach the server"),
      status: error?.response?.status,
    };
  }
}

export async function signUp(body: RegisterBodyInterface) {
  try {
    const response = await instance.post("/api/v1/user/register", {
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
    });
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to reach the server"),
      status: error?.response?.status,
    };
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await instance.post("/api/v1/user/forgot-password", {
      email,
    });
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to send reset email"),
      status: error?.response?.status,
    };
  }
}

export async function resetPassword(body: {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  try {
    const response = await instance.post("/api/v1/user/reset-password", body);
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to reset password"),
      status: error?.response?.status,
    };
  }
}
