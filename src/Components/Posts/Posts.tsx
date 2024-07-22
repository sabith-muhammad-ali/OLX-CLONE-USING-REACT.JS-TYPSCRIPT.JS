import React, { useEffect, useContext, useState } from "react";
import { FirebaseContext } from "../../context/FirebaseContext";
import Heart from "../../assets/Heart";
import "./Post.css";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import { PostContext } from "../../context/PostContext";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  [key: string]: any;
}

const Posts: React.FC = () => {
  const firebaseContext = useContext(FirebaseContext);
  const [products, setProducts] = useState<Product[]>([]);
  const postContext = useContext(PostContext )
  const navigate = useNavigate()
  useEffect(() => {
    const fetchProducts = async () => {
      if (firebaseContext) {
        const { db } = firebaseContext;
        console.log("Inside useEffect");
        console.log("Firestore context: ", db);

        if (db) {
          try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const allPosts = querySnapshot.docs.map((product) => ({
              ...product.data(),
              id: product.id,
            }));
            console.log("Fetched posts: ", allPosts);
            setProducts(allPosts);
          } catch (error) {
            console.error("Error fetching products: ", error);
          }
        }
      }
    };

    fetchProducts();
  }, [firebaseContext]);

  return (
    <div className="postParentDiv">
      <div className="moreView">
        <div className="heading">
          <span>Quick Menu</span>
          <span>View more</span>
        </div>
        <div className="cards">
          {products.map((product) => {
            return (
              <div className="card" key={product.id } 
              onClick={() => {
                if (postContext) {
                  postContext.setPostDetails(product)
                  navigate('/view') 
                }
              }} 
              >
                <div className="favorite">
                  <Heart></Heart>
                </div>
                <div className="image">
                  <img src={product.url} alt="product images" />
                </div>
                <div className="content">
                  <p className="rate">&#x20B9; {product.price}</p>
                  <span className="kilometer">{product.category}</span>
                  <p className="name"> {product.name}</p>
                </div>
                <div className="date">
                  <span>{product.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="recommendations">
        <div className="heading">
          <span>Fresh recommendations</span>
        </div>
        <div className="cards">
          <div className="card">
            <div className="favorite">
              <Heart></Heart>
            </div>
            <div className="image">
              <img src="../../../Images/R15V3.jpg" alt="" />
            </div>
            <div className="content">
              <p className="rate">&#x20B9; 250000</p>
              <span className="kilometer">Two Wheeler</span>
              <p className="name"> YAMAHA R15V3</p>
            </div>
            <div className="date">
              <span>10/5/2021</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
