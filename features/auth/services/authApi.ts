import { Axios } from "@/app/utils/axios";
import { LoginFormData } from "../schemas/loginFormSchema";
import { AuthResponse, User } from "../types";

export async function loginUser(payload: LoginFormData): Promise<AuthResponse> {
  const { data } = await Axios.post<AuthResponse>("login-id", payload);
  return data;
}

export async function logoutUser(): Promise<void> {
  await Axios.post("logout", {});
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await Axios.get<{ data: User }>("me");
  return response.data.data;
}

export async function keepSessionAlive(): Promise<AuthResponse> {
  const { data } = await Axios.post<AuthResponse>("refresh", {});
  return data;
}
