import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ReviewForm from "./ReviewFrom";
import "./Review.css";
import { Link } from "react-router-dom";
// import userImg from '../../../../Assets/user.svg';
import axios from "axios";
import { UserContext } from "../../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import swal from "sweetalert";

const Review = () => {
  const {
    user: { email },
    userImage,
  } = useContext(UserContext);
  const [review, setReview] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);
  const { _id, name, address, description, imgUrl } = review || {};
  useEffect(() => {
    axios
      .post("http://localhost/api/getReview.php", { email: email })
      .then((res) => {
        setReview(res.data[0]);
      });
  }, [email, isUpdated]);

  const handleDelete = (id) => {
    setIsUpdated(false);
    swal({
      title: "Are you sure?",
      text: "Are you sure! you want to delete the review?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((wantDelete) => {
      if (wantDelete) {
        const loading = toast.loading("deleting...Please wait!");
        axios
          .post("http://localhost/api/reviewDelete.php", { id: id })
          .then((res) => {
            toast.dismiss(loading);
            if (res.data.success == 1) {
              setIsUpdated(true);
              toast.success("Your review has been deleted successfully!");
            } else {
              toast.error("Something went wrong, please try again");
            }
          })
          .catch((err) => {
            toast.dismiss(loading);
            swal({
              title: "Failed!",
              text: "Something went wrong, please try again",
              icon: "error",
            });
          });
      }
    });
  };
  return (
    <div>
      <Toaster />
      {description ? (
        <div className="userReviewBox">
          <div className="review col-md-6 mx-auto">
            {userImage ? (
              <img src={userImage} alt="" />
            ) : (
              <img src={`${imgUrl}`} alt="" />
            )}
            {/* <img src={imgUrl} alt=""/> */}
            <h5 className="testimonialName">{name}</h5>
            <h6 className="testimonialAddress">{address}</h6>
            <p>
              <i>{description}</i>
            </p>
          </div>
          <Button
            as={Link}
            to={`/dashboard/review/${_id}`}
            variant="outline-success"
          >
            {" "}
            <FontAwesomeIcon icon={faEdit} /> Edit
          </Button>
          <Button variant="outline-danger" onClick={() => handleDelete(_id)}>
            {" "}
            <FontAwesomeIcon icon={faTrashAlt} /> Delete
          </Button>
        </div>
      ) : (
        <ReviewForm setIsUpdated={setIsUpdated} />
      )}
    </div>
  );
};

export default Review;
