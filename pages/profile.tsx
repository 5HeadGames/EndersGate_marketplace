import React from "react";
import 'shared/firebase'
import {uploadFile, getFileUrl} from "shared/firebase/utils";

const Profile = () => {
  const [testUrl, setTestUrl] = React.useState('')
  const inputFile = React.useRef(null);

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  const onLoad = (load: unknown) => {
    console.log({load})
  }

  const onError = (error: unknown) => {
    console.log({error})
  }

  const onSuccess = () => {
  }

  const onChangeFile = async (e: React.ChangeEvent<any>) => {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    console.log('Fukc')
    const metadata = {
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      size: file.size,
      type: file.type,
    };
    const url = await getFileUrl({path: `firstImage/${metadata.name}`})
    //uploadFile({path: `firstImage/${metadata.name}`, file, metadata, onLoad, onError, onSuccess});
    console.log(url)
    setTestUrl(url)
  };

  return (
    <div className="p-20 flex flex-col h-screen w-full justify-center align-center">
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={onChangeFile}
        style={{display: "none"}}
      />
      <img src={testUrl} style={{width: '100px', height: '100px'}} />
      <button onClick={onButtonClick} className="text-white">
        Open file upload window
      </button>
    </div>
  );
};

export default Profile;
