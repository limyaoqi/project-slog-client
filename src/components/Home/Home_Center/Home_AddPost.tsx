import Dropzone from "@/components/Dropzone";
import { AddPostForm } from "@/components/Form";
import { createPost } from "@/utils/api_posts";
import { getTags } from "@/utils/api_tags";
import { PostData, Tags } from "@/utils/interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

interface Home_AddPostProps {
  setView: (view: string) => void;
  backpage: string;
  token: string;
}

export default function Home_AddPost({
  setView,
  backpage,
  token,
}: Home_AddPostProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: tagsData = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("public");
  const [status, setStatus] = useState<string>("draft");
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  //send to backend
  const [tags, setTags] = useState<string[]>([]);
  //input tag
  const [newTag, setNewTag] = useState<string>("");
  const [newTagsArr, setNewTagsArr] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setNewTagsArr([...newTagsArr, newTag]);
      setNewTag("");
    }
  };

  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prevTags) => [...prevTags, tag]);
    } else {
      setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
    }
  };

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleCancelFile = (indexToRemove: number) => {
    setFiles(files.filter((file, index) => index !== indexToRemove));
  };

  const addPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      enqueueSnackbar("Post added Successfully", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setView("Home_Post");
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postData: PostData = {
      token,
      title: title,
      description: description,
      visibility: visibility,
      status: status,
      tags: selectedTags,
      attachments: files,
    };

    addPostMutation.mutate(postData);
  };
  return (
    <>
      <div className="flex  justify-center h-full overflow-y-auto ">
        <div className="bg-gray-300 p-4 rounded shadow-md w-full max-w-md text-gray-800 h-fit">
          <button
            onClick={() => setView(backpage)}
            className="bg-gray-300  py-2 rounded text-black mb-2"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl text-gray-800 font-bold mb-2">Add My Post</h1>
          <AddPostForm
            type="add"
            title={title}
            description={description}
            visibility={visibility}
            status={status}
            tagsData={tagsData}
            newTag={newTag}
            files={files}
            selectedTags={selectedTags}
            newTagsArr={newTagsArr}
            error={error}
            setTitle={setTitle}
            setDescription={setDescription}
            setVisibility={setVisibility}
            setStatus={setStatus}
            setNewTag={setNewTag}
            handleAddTag={handleAddTag}
            handleTagClick={handleTagClick}
            handleFilesAdded={handleFilesAdded}
            handleCancelFile={handleCancelFile}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
