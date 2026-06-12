"use client";

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Use a named instance so it doesn't conflict with the main app
const adminApp =
  getApps().find((a) => a.name === "admin-app") ||
  initializeApp(firebaseConfig, "admin-app");

export const adminAuth = getAuth(adminApp);

export async function signInAdmin(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(adminAuth, email, password);
  const token = await cred.user.getIdToken();

  // Persist token in secure cookie via server action
  const res = await fetch("/api/admin/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    throw new Error("Failed to create session");
  }

  return cred.user;
}

export async function signOutAdmin() {
  await signOut(adminAuth);
  await fetch("/api/admin/auth/session", { method: "DELETE" });
}

export function onAdminAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(adminAuth, callback);
}
