import React from "react";
import Inventory from "@shared/components/Profile/inventory/inventory";

import ProfileIndexPage from "@shared/components/Profile/index";

const ProfileInventory = () => {
  return (
    <ProfileIndexPage>
      <Inventory />
    </ProfileIndexPage>
  );
};

export default ProfileInventory;
