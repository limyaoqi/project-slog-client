import { Tags } from "@/utils/interface";
import React from "react";
import { FaTimes } from "react-icons/fa";
import Dropzone from "./Dropzone";

interface LoginFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  error,
}) => {
  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Login
      </button>
    </form>
  );
};

interface RegisterFormProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  handleRegister: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleRegister,
  error,
}) => {
  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Register
      </button>
    </form>
  );
};

interface PostFormProps {
  type: "edit" | "add";
  title: string;
  description: string;
  visibility: string;
  status: string;
  tagsData: Tags[];
  newTag: string;
  files: File[];
  selectedTags: string[];
  newTagsArr: string[];
  error: string | null;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setVisibility: (value: string) => void;
  setStatus: (value: string) => void;
  setNewTag: (value: string) => void;
  handleAddTag: () => void;
  handleTagClick: (tag: string) => void;
  handleFilesAdded: (files: File[]) => void;
  handleCancelFile: (indexToRemove: number) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const AddPostForm: React.FC<PostFormProps> = ({
  type,
  title,
  description,
  visibility,
  status,
  tagsData,
  newTag,
  files,
  selectedTags,
  newTagsArr,
  error,
  setTitle,
  setDescription,
  setVisibility,
  setStatus,
  setNewTag,
  handleAddTag,
  handleTagClick,
  handleFilesAdded,
  handleCancelFile,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700"
        >
          Tags
        </label>

        <div className="flex mt-1 mb-2">
          <input
            id="newTag"
            type="text"
            placeholder="New Tag"
            className=" block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button
            type="button"
            className="ml-2 px-3  border rounded-md bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={handleAddTag}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap">
          {tagsData?.map((tag: Tags) => (
            <button
              key={tag._id}
              type="button"
              onClick={() => handleTagClick(tag.name)}
              className={`mr-2 mb-2 px-3 py-1 border rounded-md ${
                selectedTags?.includes(tag.name)
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 ease-in-out`}
            >
              {tag.name}
            </button>
          ))}
          {newTagsArr?.map((tag: string, index: number) => (
            <button
              key={index}
              type="button"
              onClick={() => handleTagClick(tag)}
              className={`mr-2 mb-2 px-3 py-1 border rounded-md ${
                selectedTags?.includes(tag)
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 ease-in-out`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="visibility"
          className="block text-sm font-medium text-gray-700"
        >
          Visibility
        </label>
        <select
          id="visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="attachments"
          className="block text-sm font-medium text-gray-700"
        >
          Attachments
        </label>
        <Dropzone onFilesAdded={handleFilesAdded} />
        <div className="mt-2">
          
          {files.map((file, index) => (
            <div
              key={index}
              className="mt-1 text-sm text-gray-700 flex justify-between px-2"
            >
              <div>{file.name}</div>
              <button
                type="button"
                onClick={() => handleCancelFile(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaTimes className="text-black" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Post
      </button>
    </form>
  );
};
