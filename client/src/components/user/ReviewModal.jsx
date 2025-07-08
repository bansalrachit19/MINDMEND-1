import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import axios from "axios";
const base = import.meta.env.VITE_API_BASE_URL;

export default function ReviewModal({ isOpen, onClose, appointmentId, therapistId, onReviewSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${base}/api/reviews`,
        { therapistId, appointmentId, rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Review submitted!");
      onReviewSubmit(); // callback to refresh
      onClose(); // close modal
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <DialogPanel className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
        <DialogTitle className="text-xl font-bold text-purple-700">Leave a Review</DialogTitle>

        <div className="flex space-x-2 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={star <= rating ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
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
          className="w-full border rounded-lg p-2"
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-gray-500 hover:underline">Cancel</button>
          <button onClick={handleSubmit} className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700">Submit</button>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
