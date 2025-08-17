"use client";

import init from "@/init";
import { useEffect } from "react";

export default function GlobalProvider({ children }) {
  useEffect(() => {
    init(); // initialize ReactN global state
  }, []);

  return children;
}
