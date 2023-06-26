import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CommentModal.css";

const CommentModal = ({ picture, closeModal }) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const validateComment = () => {
    if (comment.trim().length === 0) {
      setError("Please enter a comment.");
      return false;
    }
    return true;
  };

  const handlePostComment = () => {
    setError(null); // Reset the error state
    if (!validateComment()) {
      return; // Validation failed, exit the function
    }

    const token = localStorage.getItem("token");

    const commentData = {
      pictureId: picture.id,
      comment: comment.trim(),
    };

    axios
      .post("/comments", commentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Comment saved successfully!", response.data);
        closeModal(); // Close the modal after successful save
      })
      .catch((error) => {
        console.error("Error saving the comment:", error);
      });
  };

  useEffect(() => {
    fetchComments();
  }, [picture]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/comments?pictureId=${picture.id}`);
      if (response.status === 200) {
        const commentsData = response.data;
  
        // Filter comments based on pictureId
        const filteredComments = commentsData.filter(
          (comment) => comment.pictureId === picture.id
        );
        
        // Fetch user data for each comment
        const commentPromises = filteredComments.map(async (comment) => {
          try {
            const userResponse = await axios.get(`/users/${comment.userId}`);
            if (userResponse.status === 200) {
              const user = userResponse.data;
              return {
                ...comment,
                username: user.username
              };
            } else {
              throw new Error("Failed to fetch user data");
            }
          } catch (error) {
            console.error(error);
            return {
              ...comment,
              username: "Unknown User"
            };
          }
        });
  
        const resolvedComments = await Promise.all(commentPromises);
        setComments(resolvedComments);
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const renderPicture = () => {
    const drawingData = JSON.parse(picture.drawingData);
    const squareSize = Math.sqrt(drawingData.length);
    const canvasSize = squareSize * 10;

    return (
      <div className="picture-container">
        <canvas
          width={canvasSize}
          height={canvasSize}
          style={{ border: "1px solid transparent" }}
          ref={(canvas) => {
            if (canvas) {
              const ctx = canvas.getContext("2d");
              drawingData.forEach((color, index) => {
                const x = index % squareSize;
                const y = Math.floor(index / squareSize);
                ctx.fillStyle = color;
                ctx.fillRect(x * 10, y * 10, 10, 10);
              });
            }
          }}
        ></canvas>
      </div>
    );
  };

  return (
    <div className="comment-modal">
      <div className="modal-content">
        <span className="close-modal" onClick={closeModal}>
          &times;
        </span>
        <div className="picture-and-comments">
          <div className="picture-info">
            <h3 className="text-2xl mb-5">{picture.title}</h3>
            {renderPicture()}
            <p className="mb-5">{picture.caption}</p>
            <div className="comment-input-container">
              <textarea
                rows="6"
                className="comment-input"
                placeholder="Enter your comment..."
                value={comment}
                onChange={handleCommentChange}
              ></textarea>
              {error && <p className="error-message">{error}</p>}
              <button className="comment-button" onClick={handlePostComment}>
                Post Comment
              </button>
            </div>
          </div>
          <div className="comment-section">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p className="comment-user">{comment.username} :</p>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
