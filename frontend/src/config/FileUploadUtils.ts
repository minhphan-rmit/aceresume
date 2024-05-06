import React from "react";
import { ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { getStorage, getDownloadURL } from "firebase/storage";


const FileUploadUtils = () => {
  const storage = getStorage();
  const [downloadURL, setDownloadURL] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const uploadFile = (onSuccess, onError) => {
    if (selectedFile) {
        const storageRef = ref(storage, `resume/${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error("Error uploading file:", error);
                onError(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((url) => {
                        setDownloadURL(url);
                        console.log("File available at", url);
                        onSuccess(url);
                    })
                    .catch((error) => {
                        console.error("Error getting download URL:", error);
                        onError(error);
                    });
            }
        );
    } else {
        onError(new Error('No file selected'));
    }
};


  const handleDelete = (url: string) => {
    alert("Delete button clicked");
    const desertRef = ref(storage, url);
    deleteObject(desertRef)
      .then(() => {
        console.log("File deleted successfully");
        setDownloadURL(null); // Clear the download URL to hide the preview after deletion
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };



  return{uploadFile, handleDelete, downloadURL, progress, selectedFile, setSelectedFile};
};

export default FileUploadUtils;
