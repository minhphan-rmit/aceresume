import React from "react";
import { ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { getStorage, getDownloadURL } from "firebase/storage";

interface FileUploadProps {
  initialDownloadURL?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ initialDownloadURL }) => {
  const storage = getStorage();
  const [downloadURL, setDownloadURL] = React.useState<string | undefined>(initialDownloadURL);
  const [progress, setProgress] = React.useState<number>(0);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleUpload = () => {
    alert("Upload button clicked");
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
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setDownloadURL(downloadURL);
              console.log("File available at", downloadURL);
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        }
      );
    }
  };

  const handleDelete = (url: string) => {
    alert("Delete button clicked");
    const desertRef = ref(storage, url);
    deleteObject(desertRef)
      .then(() => {
        console.log("File deleted successfully");
        setDownloadURL(undefined); // Clear the download URL to hide the preview after deletion
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  const renderFilePreview = (url?: string) => {
    if (url) {
      if (url.endsWith(".pdf")) {
        return <iframe src={url} width="100%" height="500px" title="PDF Preview"></iframe>;
      } else if (url.endsWith(".docx")) {
        return <iframe src={url} width="100%" height="500px" title="Doc Preview"></iframe>;
      }
    }
    return null;
  };

  return (
    <div>
      <input type="file" onChange={(e) => setSelectedFile(e.target.files![0])} />
      <button className="bg-indigo-500 text-white p-5 rounded-lg" onClick={()=>handleUpload()}>
        Upload
      </button>
      <button
        className="bg-red-500 text-white p-5 rounded-lg"
        onClick={() => handleDelete(downloadURL!)}
        disabled={!downloadURL}
      >
        Delete
      </button>
      <div>Progress: {progress}%</div>
      {renderFilePreview(downloadURL)}
    </div>
  );
};

export default FileUpload;
