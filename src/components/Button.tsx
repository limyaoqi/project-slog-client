import React from "react";
import { SlDislike, SlLike } from "react-icons/sl";
import { FaRegCommentAlt } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";

interface ButtonGroupProps {
  onDetailClick: () => void;
  onLikeClick: () => void;
  onCommentClick: () => void;
  isLiked: boolean;
}

export default function ButtonGroup({
  onLikeClick,
  onCommentClick,
  onDetailClick,
  isLiked,
}: ButtonGroupProps) {
  return (
    <div className="flex w-full rounded mt-4">
      <button
        className="flex items-center justify-center border border-red-500 hover:bg-red-300 hover:text-white text-red-500 font-bold py-2 px-4 flex-1 rounded-l transition duration-300"
        onClick={onLikeClick}
      >
        {isLiked ? (
          <>
            <SlDislike className="mr-2" /> Unlike
          </>
        ) : (
          <>
            <SlLike className="mr-2" /> Like
          </>
        )}
      </button>
      <button className="flex items-center justify-center border border-blue-500 hover:bg-blue-300 hover:text-white text-blue-500 font-bold py-2 px-4 flex-1 transition duration-300">
        <FaRegCommentAlt className="mr-2" /> Comment
      </button>
      <button
        className="flex items-center justify-center border border-gray-500 hover:bg-gray-300 hover:text-white text-gray-500 font-bold py-2 px-4 flex-1 rounded-r transition duration-300"
        onClick={onDetailClick}
      >
        <FaCircleInfo className="mr-2" /> Detail
      </button>
    </div>
  );
}
