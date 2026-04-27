"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { auth } from "./lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default function Home() {
  redirect("/login");
}