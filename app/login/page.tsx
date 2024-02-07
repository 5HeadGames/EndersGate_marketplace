"use client";
import Login from "@shared/components/Login/login";
import React, { Suspense } from "react";

const LoginPage = () => {
  return (
    <>
      <Suspense>
        <Login />
      </Suspense>
    </>
  );
};

export default LoginPage;
