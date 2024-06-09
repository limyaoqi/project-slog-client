import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFilesAdded }) => {
  
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 9, // Setting maximum number of files to 9
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-1 flex flex-col items-center justify-center w-full text-black px-3 py-20 border-2 border-dashed rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
        isDragActive
          ? "bg-gray-200 border-gray-400"
          : "bg-white border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      <FiUploadCloud className="text-4xl text-gray-400 mb-3" />
      {isDragActive ? (
        <p className="text-gray-600">Drop the files here...</p>
      ) : (
        <p className="text-gray-600">
          {"Drag 'n' drop some files here, or click to select files"}
        </p>
      )}
      <p className="text-sm text-gray-500 mt-2">Maximum 9 files allowed</p>
    </div>
  );
};

export default Dropzone;
