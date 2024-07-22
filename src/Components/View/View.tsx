import React, { useEffect, useState, useContext } from "react";
import { PostContext } from "../../context/PostContext";
import { FirebaseContext } from "../../context/FirebaseContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./View.css";

const View: React.FC = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const postContext = useContext(PostContext);
  const firebaseContext = useContext(FirebaseContext);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (firebaseContext && postContext?.postDetails) {
        const { db } = firebaseContext;
        const { userId } = postContext.postDetails;

        if (db && userId) {
          try {
            const usersCollection = collection(db, 'users');
            const q = query(usersCollection, where("id", "==", userId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              setUserDetails(doc.data());
            });
          } catch (error) {
            console.error("Error fetching user details: ", error);
          }
        }
      }
    };

    fetchUserDetails();
  }, [firebaseContext, postContext]);

  return (
    <div className="viewParentDiv">
      <div className="imageShowDiv">
        {postContext?.postDetails && <img src={postContext.postDetails.url} alt="product images" />}
      </div>
      <div className="rightSection">
        <div className="productDetails">
          {postContext?.postDetails && (
            <>
              <p>&#x20B9; {postContext.postDetails.price}</p>
              <span>{postContext.postDetails.name}</span>
              <p>{postContext.postDetails.category}</p>
              <span>{postContext.postDetails.createdAt}</span>
            </>
          )}
        </div>
        {userDetails && (
          <div className="contactDetails">
            <p>Seller details</p>
            <p>{userDetails.username}</p>
            <p>{userDetails.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default View;
