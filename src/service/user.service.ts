"use server";

import { instance } from "@/lib/instance";

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
    return { success: true, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false,
      message: error.response.data.message,
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
    return { success: true, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false,
      message: error.response.data.message,
      status: error?.response?.status,
    };
  }
}
