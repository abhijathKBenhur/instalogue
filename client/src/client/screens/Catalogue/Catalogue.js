import _ from "lodash";
import { Row, Col, Image } from "react-bootstrap";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import "./Catalogue.scss";
import CatalogueInterface from "../../interface/CatalogueInterface";
import Post from ".././../components/Post/Post";
import { Skeleton } from "@mui/material";
// import Header from "../../components/header/header";
import useViewportCalculator from "../../hooks/useViewportCalculator";

function Catalogue(props) {
  const [searchString, setSearchString] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [selectedSubCategory, setSelectedSubCategory] = useState(undefined);

  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoadingCategories, setLoadingCategories] = useState(true);
  
  // Pagination state
  const [hasMore, setHasMore] = useState(true);
  const { postsPerPage } = useViewportCalculator();
  const loadingRef = useRef(null); // Reference for intersection observer
  const isFetchingRef = useRef(false); // Guards against duplicate loads
  const lastQueryKeyRef = useRef(null); // Deduplicate effect-triggered fetches
  const enableInfiniteScrollRef = useRef(false); // Only load more after user scrolls

  // Reload stores function (stable)
  const reloadStores = useCallback(
    async ({ searchString, selectedCategory, selectedSubCategory, offset = 0, append = false }) => {
      isFetchingRef.current = true;
      setLoading(true);
      try {
        const results = await CatalogueInterface.getStores({
          searchString,
          selectedCategory,
          selectedSubCategory,
          limit: postsPerPage,
          offset,
        });

        const newPosts = _.get(results, "data.data", []);
        // Set hasMore to false if we got fewer items than requested, or if we got 0 items when appending
        const hasMoreData = newPosts.length === postsPerPage;
        setHasMore(hasMoreData);

        if (append) {
          // Only append if we got results, otherwise we've reached the end
          if (newPosts.length > 0) {
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
          }
        } else {
          setPosts(newPosts);
        }
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [postsPerPage]
  );

  // Memoized debounced reload function (uses latest reloadStores)
  const debouncedReloadStores = useMemo(() => _.debounce(reloadStores, 300), [reloadStores]);

  // Initial load for categories
  useEffect(() => {
    (async () => {
      setLoadingCategories(true);
      try {
        const categories = await CatalogueInterface.getCategories();
        setAvailableCategories(_.get(categories, "data.data", []));
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, []);

  // Handle category + subcategory loading
  useEffect(() => {
    if (!selectedCategory) {
      setAvailableSubCategories([]);
      setSelectedSubCategory(undefined);
      return;
    }

    (async () => {
      const subCategories = await CatalogueInterface.getSubCategories({
        category: selectedCategory,
      });
      setAvailableSubCategories(_.get(subCategories, "data.data", []));
      setSelectedSubCategory(undefined);
    })();
  }, [selectedCategory]);

  // Intersection Observer setup for infinite scroll
  const onIntersect = useCallback(
    (entries) => {
      const [entry] = entries;
      // Only append more when we already have some posts to avoid double initial load
      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoading &&
        !isFetchingRef.current &&
        posts.length > 0 &&
        enableInfiniteScrollRef.current
      ) {
        reloadStores({
          searchString,
          selectedCategory,
          selectedSubCategory,
          offset: posts.length,
          append: true,
        });
      }
    },
    [hasMore, isLoading, reloadStores, searchString, selectedCategory, selectedSubCategory, posts.length]
  );

  useEffect(() => {
    // Enable infinite scroll only after the user has scrolled/interacted
    const enable = () => {
      enableInfiniteScrollRef.current = true;
      // Remove listeners after first interaction
      window.removeEventListener('scroll', enable);
      window.removeEventListener('wheel', enable);
      window.removeEventListener('touchmove', enable);
    };
    window.addEventListener('scroll', enable, { passive: true });
    window.addEventListener('wheel', enable, { passive: true });
    window.addEventListener('touchmove', enable, { passive: true });

    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    const currentLoader = loadingRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    return () => {
      window.removeEventListener('scroll', enable);
      window.removeEventListener('wheel', enable);
      window.removeEventListener('touchmove', enable);
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
      observer.disconnect();
    };
  }, [onIntersect]);

  // Handle search, category, subcategory -> store loading (single source of truth)
  useEffect(() => {
    const currentKey = JSON.stringify({ s: searchString || "", c: selectedCategory || "", sc: selectedSubCategory || "" });
    if (currentKey === lastQueryKeyRef.current) {
      return; // No change in criteria; avoid duplicate calls (e.g., StrictMode/effect identity changes)
    }
    lastQueryKeyRef.current = currentKey;

    // Reset pagination state when search criteria changes
    setPosts([]);
    setHasMore(true);

    const params = {
      searchString,
      selectedCategory,
      selectedSubCategory,
      offset: 0,
      append: false,
    };

    if (searchString) {
      debouncedReloadStores(params);
      return () => debouncedReloadStores.cancel();
    }

    reloadStores(params);
  }, [searchString, selectedCategory, selectedSubCategory, reloadStores, debouncedReloadStores]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => debouncedReloadStores.cancel();
  }, [debouncedReloadStores]);

  return (
    <div className="catalogue">
      <div className="highlight-filters mt-5">
        {isLoadingCategories ? (
          Array(10).fill(0).map((_, index) => (
            <div key={index}>
              <div className="highlight">
                <div className="highlight-container cursor-pointer">
                  <Skeleton variant="circular" width={80} height={80} />
                </div>
              </div>
              <div className="highlight-key mt-1">
                <Skeleton variant="text" width={100} height={20} />
              </div>
            </div>
          ))
        ) : (
          availableCategories.map((highlight) => {
            return (
              <div key={highlight}>
                <div
                  className={`highlight ${highlight === selectedCategory ? "selected" : ""}`}
                  onClick={() => {
                    selectedCategory === highlight
                      ? setSelectedCategory(undefined)
                      : setSelectedCategory(highlight);
                  }}
                >
                  <div
                    className={
                      highlight === selectedCategory
                        ? "selected highlight-container cursor-pointer"
                        : "highlight-container cursor-pointer"
                    }
                  >
                    <Image
                      roundedCircle
                      src={
                        window.location.origin +
                        "/categories/" +
                        highlight +
                        ".avif"
                      }
                      title={highlight}
                    ></Image>
                  </div>
                </div>
                <div
                  className={
                    highlight === selectedCategory
                      ? "selected highlight-key mt-1"
                      : "highlight-key mt-1"
                  }
                >
                  <span className="second-header">{highlight}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
      {availableSubCategories.length > 0 && <div className="subcategories mt-3">
        {availableSubCategories.map((subCategory) => {
          return <div
          className={
            subCategory === selectedSubCategory
              ? "selected sub-category second-grey"
              : "sub-category second-grey"
          }
          onClick={() => {selectedSubCategory === subCategory ? setSelectedSubCategory(undefined) : setSelectedSubCategory(subCategory)}}
          >{subCategory.toString().toUpperCase()}</div>;
        })}
      </div>}
      <div className="search-container mt-3 mb-3">
        <div className="search-bar">
          <i className="fa fa-search search-icon"></i>
          <div style={{position: 'relative', width: '100%'}}>
            <input
              type="text"
              className="search-input"
              placeholder="Search for products, categories, stores"
              value={searchString}
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
              style={{ 
                fontSize: '16px',
                paddingLeft: '30px', // Make room for the icon
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'%3E%3C/circle%3E%3Cline x1=\'21\' y1=\'21\' x2=\'16.65\' y2=\'16.65\'%3E%3C/line%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '8px center',
                backgroundSize: '16px'
              }}
            />
            {searchString && (
              <button
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSearchString('');
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="posts-container">
        
      </div>
      <div className="posts mt-1">
        <Row>
          {posts.map((post) => {
            return (
              <Col key={post._id} md="4" sm="4" lg="4" xs="4" className="p-2">
                <Post postinfo={post}></Post>
              </Col>
            );
          })}
        </Row>
        
        {/* Loading state */}
        <div ref={loadingRef} className="loading-container">
          {isLoading && (
            <Row>
              {Array(postsPerPage).fill(0).map((_, index) => (
                <Col key={index} md="4" sm="4" lg="4" xs="4" className="p-2">
                  <Skeleton variant="rectangular" height={300}  />
                </Col>
              ))}
            </Row>
          )}
          {/* {!isLoading && !hasMore && posts.length > 0 && (
            <div className="end-message">No more posts to load</div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Catalogue;
