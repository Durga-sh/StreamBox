import React, { useEffect, useState } from "react";
import videoService from "../../services/video.service";
import { useAuth } from "../../hooks/useAuth";

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user } = useAuth();
  const limit = 10;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await videoService.getVideoComments(videoId, {
          page,
          limit,
        });
        setComments(response.data.docs || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        setError(err.message || "Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [videoId, page]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to comment");
      return;
    }
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    try {
      const response = await videoService.addComment(videoId, {
        content: newComment,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to post comment");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setLoading(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        Comments ({comments.length})
      </h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {token && (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="flex items-start space-x-3">
            <img
              src={user?.avatar || "https://ui-avatars.com/api/?name=User"}
              alt="User avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[80px] resize-y"
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-4">
          <svg
            className="animate-spin h-6 w-6 text-purple-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-slate-500 text-center">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-3">
              <img
                src={
                  comment.owner?.avatar ||
                  "https://ui-avatars.com/api/?name=User"
                }
                alt={comment.owner?.username || "User"}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {comment.owner?.username || "Unknown"}
                  <span className="text-xs text-slate-500 ml-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-sm text-slate-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-slate-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
