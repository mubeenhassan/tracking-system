"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { client } from "@/sanity/lib/client";

const SESSION_EXPIRATION = 10 * 60 * 1000; // 10 minutes in milliseconds

async function getLocationFromIP(ip) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    if (data.status === "success") {
      return `${data.city}, ${data.country}`;
    }
    return "Unknown";
  } catch (error) {
    console.error("Error fetching location:", error);
    return "Unknown";
  }
}
export async function login(email, password, location) {
  try {
    const user = await client.fetch(
      `*[_type == "auth" && email == $email && password == $password][0]{
        email
      }`,
      { email, password }
    );

    if (user) {
      const expirationTime = Date.now() + SESSION_EXPIRATION;
      const cookieStore = cookies();
      await cookieStore.set("user", JSON.stringify({ email: user.email }), {
        httpOnly: true,
        secure: true,
        expires: new Date(expirationTime),
      });
      await cookieStore.set("sessionExpiration", expirationTime.toString(), {
        httpOnly: true,
        secure: true,
        expires: new Date(expirationTime),
      });

      // Create Google Maps URL from location
      const googleMapUrl = location
        ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
        : "Unknown";

      // Record login history with Google Maps URL
      try {
        const loginHistoryDoc = await client.create({
          _type: "loginHistory",
          username: email,
          loginTime: new Date().toISOString(),
          location: googleMapUrl,
        });
        console.log("Login history recorded:", loginHistoryDoc);
      } catch (error) {
        console.error("Error creating login history:", error);
      }

      return { success: true, user: { email: user.email } };
    } else {
      return { success: false, error: "Invalid credentials" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred" };
  }
}

export async function logout() {
  const cookieStore = cookies();
  await cookieStore.delete("user");
  await cookieStore.delete("sessionExpiration");
}

export async function checkSession() {
  const cookieStore = cookies();
  const userCookie = await cookieStore.get("user");
  const sessionExpiration = await cookieStore.get("sessionExpiration");

  if (userCookie && sessionExpiration) {
    const expirationTime = Number.parseInt(sessionExpiration.value, 10);
    if (Date.now() > expirationTime) {
      await logout();
      return null;
    }
    try {
      const { email } = JSON.parse(userCookie.value);
      // Fetch fresh user data from Sanity
      const userData = await client.fetch(
        `*[_type == "auth" && email == $email][0]{
          email,
          message
        }`,
        { email }
      );
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }

  return null;
}
