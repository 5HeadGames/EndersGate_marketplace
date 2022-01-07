import {getDatabase, ref, set, child, get} from "firebase/database";
import firebase from "shared/firebase";

export const readUser = async (userId: string) => {
  const dbRef = ref(getDatabase());
  try {
    const snapshot = await get(child(dbRef, `users/${userId}`));
    if (snapshot.exists()) return snapshot.val();
  } catch (err) {
    console.log({err});
  }
  return false;
};

export const writeUser = async (userPath: string, newData: Partial<User>) => {
  const db = getDatabase();
  set(ref(db, "users/" + userPath), {
    ...newData,
  });
  return false;
};

export const uploadFile = ({
  path,
  file,
  onLoad,
  onError,
  onSuccess,
}: {
  path: string;
  file: Blob;
  onLoad: (snapshot: unknown) => void;
  onError: (snapshot: unknown) => void;
  onSuccess: (snapshot: unknown) => void;
}) => {
  const storageRef = firebase.storage().ref();
  storageRef.child(path);
  const uploadTask = storageRef.put(file);

  uploadTask.on('state_changed', onLoad, onError, onSuccess);
};

export const getFileUrl = async ({path}: {path: string}) => {
  const storageRef = firebase.storage().ref();
  return await storageRef.child(path).getDownloadURL();
}
