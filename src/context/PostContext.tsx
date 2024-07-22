import React, { createContext, useState, ReactNode } from "react";

interface PostContextType {
  postDetails: any;
  setPostDetails: React.Dispatch<React.SetStateAction<any>>;
}

export const PostContext = createContext<PostContextType | null>(null);

interface PostProviderProps {
  children: ReactNode;
}

const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [postDetails, setPostDetails] = useState<any>(null);

  return (
    <PostContext.Provider value={{ postDetails, setPostDetails }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;
 