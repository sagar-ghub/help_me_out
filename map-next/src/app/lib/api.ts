import { getSession } from "next-auth/react";

// lib/api.ts
const API_ENDPOINT:string=process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000/api";
export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    payload?: any,
    extraHeaders: Record<string, string> = {}
  ): Promise<T> {
    let token: string | undefined;
    try {
      const session = await getSession();
      if (session && session.user && (session.user as any).token) {
        token = (session.user as any).token;
      }
    } catch (err) {
      console.error("Error retrieving session:", err);
    }
    // token=localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...extraHeaders,
    };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
    const options: RequestInit = {
      method,
      headers,
      body: method !== "GET" && payload ? JSON.stringify(payload) : undefined,
    };
  
    const response = await fetch(API_ENDPOINT+endpoint, options);
    const data=await response.json();
    if (!response.ok) {
      console.log(data.error);
      
      throw new Error(data.error || "API request failed");
    }
  
    return data;
  }
  