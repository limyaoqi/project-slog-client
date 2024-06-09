// import Image from "next/image";
// import { FaEdit, FaTrash, FaReply, FaHeart, FaArrowLeft } from "react-icons/fa";

// const PostComponent = ({
//   post,
//   user,
//   setView,
//   backpage,
//   setOpenModal,
//   setType,
//   setPost_id,
//   setComment_id,
//   handleAddComment,
//   handleEdit,
//   handleDelete,
//   handlePostLike,
//   goProfileDetail,
//   goPostDetail,
//   handleDeleteComment,
//   openModal,
//   content,
//   setContent,
//   ButtonGroup
// }) => {
//   return (
//     <div className="h-full overflow-y-auto">
//       {setView && (
//         <button
//           onClick={() => setView(backpage)}
//           className="bg-gray-300 px-3 py-2 rounded text-black mb-2"
//         >
//           <FaArrowLeft />
//         </button>
//       )}
//       {openModal && (
//         <Model
//           content={content}
//           setContent={setContent}
//           setOpenModal={setOpenModal}
//           handleSubmit={() => handleAddComment()}
//         />
//       )}
//       <div className="border p-4 rounded mb-4">
//         <div className="flex justify-between items-center w-full mb-4">
//           <div className="flex items-center">
//             <div className="w-10 h-10 mr-4">
//               <Image
//                 className="rounded-full h-full"
//                 src={`http://localhost:2000/${post.user.profileId?.avatar}`}
//                 alt={`${post.user.username}'s avatar`}
//                 width={999}
//                 height={999}
//               />
//             </div>
//             <div
//               className="text-sm text-gray-200 hover:underline cursor-pointer"
//               onClick={() => goProfileDetail(post.user.profileId?._id)}
//             >
//               {post.user.username}
//             </div>
//           </div>
//           {user &&
//             (user.role === "superAdmin" ||
//               user.role === "admin" ||
//               user._id === post?.user?._id) && (
//               <div className="flex items-center">
//                 <button
//                   className="px-2 text-gray-700 transition duration-300 ease-in-out hover:text-blue-500"
//                   onClick={() => handleEdit(post._id)}
//                 >
//                   <FaEdit />
//                 </button>
//                 <button
//                   className="px-2 text-gray-700 transition duration-300 ease-in-out hover:text-red-500"
//                   onClick={() => handleDelete(post._id)}
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             )}
//         </div>
//         <h2 className="text-xl font-bold">{post.title}</h2>
//         <p className="text-gray-700">{post.description}</p>
//         {post.attachments && post.attachments.length > 1 ? (
//           <div className="mt-2">
//             <ul className="grid grid-cols-3 list-disc list-inside">
//               {post.attachments.map((attachment: string) => (
//                 <div key={attachment} className="w-full h-56">
//                   <Image
//                     className="w-full h-full object-cover"
//                     src={`http://localhost:2000/${attachment}`}
//                     alt={`${post.user.username}'s avatar`}
//                     width={999}
//                     height={999}
//                   />
//                 </div>
//               ))}
//             </ul>
//           </div>
//         ) : (
//           <div className="mt-2">
//             <ul className="list-disc list-inside">
//               {post.attachments?.map((attachment: string) => (
//                 <div key={attachment} className="w-full h-full">
//                   <Image
//                     className="w-full h-full"
//                     src={`http://localhost:2000/${attachment}`}
//                     alt={`${post.user.username}'s avatar`}
//                     width={999}
//                     height={999}
//                   />
//                 </div>
//               ))}
//             </ul>
//           </div>
//         )}

//         <ButtonGroup
//           isPostPage={true}
//           isLiked={post.likes?.includes(user._id) ? true : false}
//           onCommentClick={() => {
//             setOpenModal(true);
//             setType("addcomment");
//             setPost_id(post._id);
//           }}
//           onDetailClick={() => goPostDetail(post._id)}
//           onLikeClick={() => {
//             handlePostLike(post._id, "post");
//           }}
//         />

//         {post.comments && post.comments.length > 0 && (
//           <div className="mt-4">
//             <h3 className="font-semibold border-t pt-2">Comments:</h3>
//             {post.comments.map((comment) => (
//               <div key={comment._id} className="mt-4">
//                 <div className="flex items-start">
//                   <div className="w-8 h-8 mr-4">
//                     <Image
//                       className="rounded-full w-full h-full"
//                       src={`http://localhost:2000/${comment.user.profileId?.avatar}`}
//                       alt={`${comment.user.username}'s avatar`}
//                       width={999}
//                       height={999}
//                     />
//                   </div>
//                   <div className="flex-grow">
//                     <p
//                       className="text-gray-200 mr-3 hover:underline cursor-pointer"
//                       onClick={() => goProfileDetail(comment.user._id)}
//                     >
//                       {comment.user.username}:
//                     </p>
//                     <p className="text-gray-300">{comment.content}</p>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <div className="flex items-center">
//                       <button
//                         className="text-gray-500 hover:text-blue-500 transition-colors duration-300"
//                         onClick={() => {
//                           setOpenModal(true);
//                           setType("addreply");
//                           setPost_id(post._id);
//                           setComment_id(comment._id);
//                         }}
//                       >
//                         <FaReply />
//                       </button>
//                       <span className="ml-1 text-gray-500">
//                         {comment.replies ? comment.replies.length : 0}
//                       </span>
//                     </div>
//                     <div className="flex items-center">
//                       {comment && comment.likes?.includes(user._id) ? (
//                         <button
//                           className="text-rose-500 hover:text-rose-300 transition-colors duration-300"
//                           onClick={() => handlePostLike(comment._id, "comment")}
//                         >
//                           <FaHeart />
//                         </button>
//                       ) : (
//                         <button
//                           className="text-gray-500 hover:text-rose-300 transition-colors duration-300"
//                           onClick={() => handlePostLike(comment._id, "comment")}
//                         >
//                           <FaHeart />
//                         </button>
//                       )}
//                       <span className="ml-1 text-gray-500">
//                         {comment && comment.likes?.length}
//                       </span>
//                     </div>
//                     {user &&
//                       (user.role === "superAdmin" ||
//                         user.role === "admin" ||
//                         user._id === post.user._id ||
//                         user._id === comment.user._id) && (
//                         <div className="flex items-center space-x-2">
//                           <button
//                             className="text-gray-500 hover:text-red-500"
//                             onClick={() => handleDeleteComment(comment._id)}
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
//                       )}
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-500 mt-2">
//                   {new Date(comment.createdAt).toLocaleString()}
//                 </div>
//                 {comment.replies && comment.replies.length > 0 && (
//                   <div className="mt-2 pl-4 border-l">
//                     {comment.replies.map((reply) => (
//                       <div key={reply._id} className="mt-3">
//                         <div className="flex items-start">
//                           <div className="w-8 h-8 mr-4">
//                             <Image
//                               className="rounded-full w-full h-full"
//                               src={`http://localhost:2000/${reply.user.profileId?.avatar}`}
//                               alt={`${reply.user.username}'s avatar`}
//                               width={999}
//                               height={999}
//                             />
//                           </div>
//                           <div className="flex-grow">
//                             <p
//                               className="text-gray-200 mr-3 hover:underline cursor-pointer"
//                               onClick={() => goProfileDetail(reply.user._id)}
//                             >
//                               {reply.user.username}:
//                             </p>
//                             <p className="text-gray-300">{reply.content}</p>
//                           </div>
//                           <div className="flex items-center space-x-4">
//                             <div className="flex items-center">
//                               {reply && reply.likes?.includes(user._id) ? (
//                                 <button
//                                   className="text-rose-500 hover:text-rose-300 transition-colors duration-300"
//                                   onClick={() =>
//                                     handlePostLike(reply._id, "reply")
//                                   }
//                                 >
//                                   <FaHeart />
//                                 </button>
//                               ) : (
//                                 <button
//                                   className="text-gray-500 hover:text-rose-300 transition-colors duration-300"
//                                   onClick={() =>
//                                     handlePostLike(reply._id, "reply")
//                                   }
//                                 >
//                                   <FaHeart />
//                                 </button>
//                               )}
//                               <span className="ml-1 text-gray-500">
//                                 {reply && reply.likes?.length}
//                               </span>
//                             </div>
//                             {user &&
//                               (user.role === "superAdmin" ||
//                                 user.role === "admin" ||
//                                 user._id === post.user._id ||
//                                 user._id === reply.user._id) && (
//                                 <div className="flex items-center space-x-2">
//                                   <button className="text-gray-500 hover:text-red-500">
//                                     <FaTrash />
//                                   </button>
//                                 </div>
//                               )}
//                           </div>
//                         </div>
//                         <div className="text-sm text-gray-500 mt-2">
//                           {new Date(reply.createdAt).toLocaleString()}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PostComponent;
