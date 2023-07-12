import React from "react";
import ProfileIndexPage from "@shared/components/Profile/index";
import Inventory from "@shared/components/Profile/inventory/inventory";

const Profile: React.FunctionComponent<{}> = () => {
  return (
    <ProfileIndexPage>
      <Inventory></Inventory>
    </ProfileIndexPage>
  );
};

export default Profile;
