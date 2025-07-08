import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import axios from "axios";
const base = import.meta.env.VITE_API_BASE_URL;

export default function ReviewModal({
  isOpen,
  onClose,
  appointmentId,
  therapistId,
  onReviewSubmit,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      toast.error("Please provide both rating and feedback.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${base}/api/reviews/${appointmentId}`,
        {
          therapistId,
          rating,
          text: comment, // backend expects `text`
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Review submitted successfully!");
      onReviewSubmit();
      onClose();
    } catch (err) {
      console.error("Error submitting review:", err.response || err);
      toast.error(
        err?.response?.data?.msg || "Failed to submit review. Please try again."
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <Dialog.Panel className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
        <Dialog.Title className="text-xl font-bold text-purple-700">
          ⭐ Leave a Review
        </Dialog.Title>

        <div className="flex justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-purple-400"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Submit
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
