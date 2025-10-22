import React from "react";
import "./post.scss";
import { Image } from "react-bootstrap";

const Post = (props) => {
  const handleInstagramClick = (url) => {
    // Check if it's a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Try to open the Instagram app first
      const instagramUrl = url.replace('https://www.instagram.com', 'instagram://');
      
      // Create a hidden anchor element
      const link = document.createElement('a');
      link.href = instagramUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Try to open the app
      const now = Date.now();
      link.click();
      
      // If the app doesn't open within 1 second, open in browser
      setTimeout(() => {
        if (Date.now() - now < 2000) {
          window.location.href = url;
        }
      }, 1000);
      
      document.body.removeChild(link);
    } else {
      // On desktop, open in a new tab
      window.open(url, '_blank');
    }
  };

  const getOptimisedURL = (imageURL) => {
    const optimizedSrc = imageURL ? imageURL.replace(
      "/upload/",
      "/upload/f_auto,q_auto/" 
    ) : imageURL;
    return optimizedSrc;
  }

  return (
    <div className="post-container">
      {props.postinfo && (
        <Image
          className="post"
          src={getOptimisedURL(props?.postinfo?.thumbnailURL)}
          onClick={() => handleInstagramClick(props?.postinfo?.post)}
        />
      )}
    </div>
  );
};

export default Post;
