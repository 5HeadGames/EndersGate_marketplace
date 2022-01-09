import {getDatabase, ref, set, child, get} from "firebase/database";
import {getStorage, ref as getStorageRef, getDownloadURL, uploadBytesResumable} from 'firebase/storage'

export const readUser = async (userPath: string) => {
  const dbRef = ref(getDatabase());
  try {
    const snapshot = await get(child(dbRef, userPath));
    if (snapshot.exists()) return snapshot.val();
  } catch (err) {
    console.log({err});
  }
  return false;
};

export const writeUser = async (userPath: string, newData: Partial<User>) => {
  const db = getDatabase();
  const user = await readUser(userPath)
  set(ref(db, userPath), {
    ...user,
    ...newData,
  });
  return false;
};

export const uploadFile = ({
  path,
  file,
  metadata,
  onLoad,
  onError,
  onSuccess,
}: {
  path: string;
  file: Blob;
  metadata?: Record<string, unknown>;
  onLoad?: (snapshot: unknown) => void;
  onError?: (snapshot: unknown) => void;
  onSuccess?: () => void;
}) => {
  const storageRef = getStorageRef(getStorage(), path);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  uploadTask.on('state_changed', onLoad, onError, onSuccess);
};

export const getFileUrl = async ({path}: {path: string}) => {
  const storageRef = getStorageRef(getStorage(), path);
  return await getDownloadURL(storageRef);
}
