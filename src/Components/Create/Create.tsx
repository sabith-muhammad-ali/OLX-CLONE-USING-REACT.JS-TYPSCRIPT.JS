import React, { useContext, useState } from "react";
import firebase from "firebase/compat/app";
import "./Create.css";
import Header from "../Header/Header";
import { AuthContext, FirebaseContext } from "../../context/FirebaseContext";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const Create = () => {
  const firebaseContext = useContext(FirebaseContext);
  const authContext = useContext(AuthContext);
  const [name, setName] = useState<string | null>("");
  const [category, setCategory] = useState<string | null>("");
  const [price, setPrice] = useState<string | null>("");
  const [image, setImage] = useState<File | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const date = new Date()
  const navigate = useNavigate()


  const handleSubmit = async () => {
    // Clear previous errors
    setNameError(null);
    setCategoryError(null);
    setPriceError(null);
    setImageError(null);

    // Validation
    let valid = true;

    if (!name) {
      setNameError("Name is required.");
      valid = false;
    }
    if (!category) {
      setCategoryError("Category is required.");
      valid = false;
    }
    if (!price) {
      setPriceError("Price is required.");
      valid = false;
    } else if (isNaN(Number(price))) {
      setPriceError("Price must be a valid number.");
      valid = false;
    }
    if (!image) {
      setImageError("Image is required.");
      valid = false;
    }

    if (!valid) return;

    if (firebaseContext && image && authContext) {
      const {storage} = firebaseContext;
      const imageRef = ref(storage, `images/${image.name}`);
      try {
        const uploadResult = await uploadBytes(imageRef, image);
        const url = await getDownloadURL(uploadResult.ref);
        console.log("file available at", url);
        const db = getFirestore()
        await addDoc(collection(db, 'products'), {
          name,
          category,
          price,
          url,
          userId: authContext.user?.uid,
          createdAt:date.toString()
        })
        navigate('/')
        console.log('product added successfully');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="centerDiv">
        <label htmlFor="name">Name</label>
        <br />
        {nameError && <div className="error">{nameError}</div>}
        <input
          className="input"
          type="text"
          id="name"
          name="name"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label htmlFor="category">Category</label>
        <br />
        {categoryError && <div className="error">{categoryError}</div>}
        <input
          className="input"
          type="text"
          id="category"
          name="category"
          value={category || ""}
          onChange={(e) => setCategory(e.target.value)}
        />
        <br />
        <label htmlFor="price">Price</label>
        <br />
        {priceError && <div className="error">{priceError}</div>}
        <input
          className="input"
          type="number"
          id="price"
          name="price"
          value={price || ""}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br />
        {imageError && <div className="error">{imageError}</div>}
        <label htmlFor="image">Image</label>
        <br />
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
        <br />
        {image && (
          <img
            alt="Image Preview"
            width="200px"
            height="200px"
            src={image ? URL.createObjectURL(image) : ""}
          />
        )}
        <br />
        <button onClick={handleSubmit} className="uploadBtn" type="submit">
          Upload and Submit
        </button>
      </div>
    </>
  );
};

export default Create;
