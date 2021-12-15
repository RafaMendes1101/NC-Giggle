import React from "react";
import App from "../App";
import { UserProvider } from "../context/context";
export default function Wrapper() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}
