interface ModalProps {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: () => void;
}

export default function Model({
  content,
  setContent,
  setOpenModal,
  handleSubmit,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-90 flex justify-center items-center z-30">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/3 text-white">
        <h2 className="text-xl font-semibold mb-4">Add a Comment</h2>
        <textarea
          className="w-full p-2 bg-gray-800 border border-gray-300 rounded mb-4  focus:outline-none"
          rows={4}
          placeholder="Type your comment here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
            onClick={() => {setOpenModal(false);setContent("")}}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
