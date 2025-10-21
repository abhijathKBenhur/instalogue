import { useState, useEffect } from 'react';

const useViewportCalculator = () => {
  const [postsPerPage, setPostsPerPage] = useState(9); // Default value
  const [deviceType, setDeviceType] = useState('desktop');

  const calculatePostsPerPage = () => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Determine device type based on viewport width
    let newDeviceType = 'desktop';
    if (viewportWidth <= 768) {
      newDeviceType = 'mobile';
    } else if (viewportWidth <= 1024) {
      newDeviceType = 'tablet';
    }
    setDeviceType(newDeviceType);

    // Calculate post size based on the grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)
    const columns = newDeviceType === 'mobile' ? 1 : (newDeviceType === 'tablet' ? 2 : 4);
    const postWidth = (viewportWidth - (32 * columns)) / columns; // Subtracting padding
    const postHeight = postWidth; // Since posts are square

    // Calculate rows that fit in viewport
    const rowsInViewport = Math.ceil(viewportHeight / (postHeight + 32)); // Adding padding
    
    // Calculate total posts that should be loaded
    const newPostsPerPage = columns * (rowsInViewport + 1); // Adding one extra row for smooth scrolling
    
    setPostsPerPage(newPostsPerPage);
  };

  useEffect(() => {
    calculatePostsPerPage();
    
    const handleResize = () => {
      calculatePostsPerPage();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    postsPerPage,
    deviceType
  };
};

export default useViewportCalculator;
