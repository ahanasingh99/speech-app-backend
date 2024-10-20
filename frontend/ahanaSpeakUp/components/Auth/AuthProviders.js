"use client"
import { SessionProvider } from "next-auth/react";
import React from "react";

const AuthProviders = (props) => {
  return <SessionProvider>{props.children}</SessionProvider>;
};

export default AuthProviders;