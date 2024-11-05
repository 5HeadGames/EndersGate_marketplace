"use client";
import Login from "@shared/components/Login/login";
import React, {Suspense} from "react";

const LoginPage = () => {
  return (
    <>
      <Suspense fallback={<div></div>}>
        <Login />
      </Suspense>
    </>
  );
};

export default LoginPage;
