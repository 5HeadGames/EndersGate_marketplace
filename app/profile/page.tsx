"use client";
import React from "react";
import ProfileLayout from "@shared/components/Profile/layout";
import Inventory from "@shared/components/Profile/inventory/inventory";

const Profile = () => {
  return (
    <ProfileLayout>
      <Inventory />
    </ProfileLayout>
  );
};

export default Profile;
