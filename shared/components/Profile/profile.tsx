import React from "react";
import "shared/firebase";
import { uploadFile, getFileUrl } from "shared/firebase/utils";
import ProfileDataAndActions from "./profilePersonalData/profilePersonalData";

const ProfileLayoutComponent = ({ children }) => {
  const [testUrl, setTestUrl] = React.useState("");
  const inputFile = React.useRef(null);

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  const onLoad = (load: unknown) => {
    console.log({ load });
  };

  const onError = (error: unknown) => {
    console.log({ error });
  };

  const onSuccess = () => {};

  const onChangeFile = async (e: React.ChangeEvent<any>) => {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    console.log("Fukc");
    const metadata = {
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      size: file.size,
      type: file.type,
    };
    const url = await getFileUrl({ path: `firstImage/${metadata.name}` });
    //uploadFile({path: `firstImage/${metadata.name}`, file, metadata, onLoad, onError, onSuccess});
    console.log(url);
    setTestUrl(url);
  };

  return (
    <div className="flex w-full ">
      <aside className="md:flex hidden flex-col pt-32 pr-8 h-screen w-72 border-r border-overlay-border">
        <ProfileDataAndActions
          name="AN-Drew207"
          email="andrescontrerasoviedo740@gmail.com"
          photo=""
        />
      </aside>
      <div className="w-full pt-32 px-4">{children}</div>
    </div>
  );
};

export default ProfileLayoutComponent;
