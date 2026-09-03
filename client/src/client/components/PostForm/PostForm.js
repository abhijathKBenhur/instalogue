import _ from "lodash";
import { Row, Form, Container, Button, Dropdown, Spinner } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import './PostForm.scss'
import CatalogueInterface from "../../interface/CatalogueInterface";
import CloudinaryInterface from "../../interface/cloudinaryInterface";
import InstagramInterface from "../../interface/InstagramInterface";

function PostForm(props) {
  const { initialData } = props;
  const [form, setFormData] = useState({
    category: "",
    subCategory: "",
    postURL: "",
    thumbnailURL: "",
    storeName: "",
    password: "",
    keywords: "",
    fullData: "",
    fullSheet: "",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);

  // Drag-and-drop image state — preview only; upload happens on "Add store"
  const [imagePreview, setImagePreview] = useState("");
  const [pendingImage, setPendingImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch categories on mount
    CatalogueInterface.getCategories({})
      .then(res => {
        if (Array.isArray(res?.data?.data)) {
          setCategories(res?.data?.data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch categories', err);
      });
  }, []);
  const loadSubCategories = () => {
    CatalogueInterface.getSubCategories()
      .then(res => {
        if (Array.isArray(res?.data?.data)) {
          setSubCategories(res?.data?.data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch subcategories', err);
      });
  }

  const loadCategories = () => {
    CatalogueInterface.getCategories({})
      .then(res => {
        if (Array.isArray(res?.data?.data)) {
          setCategories(res?.data?.data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch categories', err);
      });
  }

  useEffect(() => {
    loadCategories();
    loadSubCategories();
    // if (initialData) {
    setFormData({
      storeName: initialData.storeName || '',
      category: initialData.category || '',
      subCategory: initialData.subCategory || '',
      postURL: initialData.postURL || '',
      thumbnailURL: initialData.thumbnailURL || '',
      keywords: initialData.keywords || '',
      // ... add other fields as needed
    });
    setImagePreview(initialData.thumbnailURL || "");
    // }
  }, []);

  // Read a dropped/selected image and show a local preview only.
  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    setUploadError("");
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setPendingImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (event) => {
    let returnObj = {};
    returnObj[event.target.name] = event.target.value;
    setFormData({ ...form, ...returnObj });
  };

  const [stepStatus, setStepStatus] = useState("");

  const addStore = async () => {
    setUploadError("");
    setUploading(true);
    setStepStatus("Starting automated posting flow...");

    try {
      let thumbnailURL = form.thumbnailURL;
      let postURL = form.postURL;

      if (pendingImage) {
        // Step 1: Cloudinary upload
        setStepStatus("Step 1/3: Uploading image to Cloudinary...");
        const cloudinaryRes = await CloudinaryInterface.uploadImage({ image: pendingImage });
        thumbnailURL = cloudinaryRes.data?.thumbnailURL;
        if (!thumbnailURL) {
          throw new Error("Cloudinary upload failed — no URL returned");
        }

        // Step 2: Instagram post (only after Cloudinary completes)
        setStepStatus("Step 2/3: Publishing post to Instagram...");
        const storeName = form.storeName || "";
        const igRes = await InstagramInterface.postImage({
          imageUrl: thumbnailURL,
          caption: `Click here to open the store page -> @${storeName}`,
        });
        postURL = igRes.data?.postURL || "";
      }

      const storeData = {
        ...form,
        thumbnailURL,
        postURL,
      };

      // Step 3: Save to MongoDB (only after uploads complete)
      setStepStatus("Step 3/3: Saving store to Catalogue...");
      await CatalogueInterface.addStore(storeData);

      setFormData(prev => ({
        ...prev,
        postURL: "",
        thumbnailURL: "",
        storeName: "",
        keywords: "",
      }));
      setImagePreview("");
      setPendingImage("");
      setStepStatus("✅ Store successfully added!");
    } catch (err) {
      setUploadError(err?.response?.data?.error || err.message);
      setStepStatus("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className="add-form">
      <Form.Group>
        <Dropdown className="w-100" show={showCategoryDropdown} onToggle={(isOpen) => setShowCategoryDropdown(isOpen)}>
          <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start" style={{ justifyContent: "start" }}>
            {form.category || "Select Category"}
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100">
            {Array.isArray(categories) && categories.map((cat) => (
              <Dropdown.Item
                key={cat}
                onClick={() => handleChange({ target: { name: 'category', value: cat } })}
                active={form.category === cat}
              >
                {cat}
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setNewCategory("")}>
              <div className="d-flex">
                <Form.Control
                  placeholder="Add new category"
                  value={newCategory}
                  onChange={e => {
                    e.stopPropagation();
                    setNewCategory(e.target.value);
                  }}
                  onClick={e => e.stopPropagation()}
                />
                <Button
                  size="sm"
                  variant=""
                  style={{ marginLeft: '8px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (newCategory && !categories.includes(newCategory)) {
                      setCategories([...categories, newCategory]);
                      setFormData({ ...form, category: newCategory });
                      setNewCategory("");
                      setShowCategoryDropdown(false);
                    }
                  }}
                >
                  OK
                </Button>
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>

      <Form.Group>
        <Dropdown className="w-100" show={showSubCategoryDropdown} onToggle={(isOpen) => setShowSubCategoryDropdown(isOpen)}>
          <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start" style={{ justifyContent: "start" }}>
            {form.subCategory || "Select Sub Category"}
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100">
            {Array.isArray(subCategories) && subCategories.map((subCat) => (
              <Dropdown.Item
                key={subCat}
                onClick={() => handleChange({ target: { name: 'subCategory', value: subCat } })}
                active={form.subCategory === subCat}
              >
                {subCat}
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setNewSubCategory("")}>
              <div className="d-flex">
                <Form.Control
                  placeholder="Add new sub category"
                  value={newSubCategory}
                  onChange={e => {
                    e.stopPropagation();
                    setNewSubCategory(e.target.value);
                  }}
                  onClick={e => e.stopPropagation()}
                />
                <Button
                  size="sm"
                  variant=""
                  style={{ marginLeft: '8px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (newSubCategory && !subCategories.includes(newSubCategory)) {
                      setSubCategories([...subCategories, newSubCategory]);
                      setFormData({ ...form, subCategory: newSubCategory });
                      setNewSubCategory("");
                      setShowSubCategoryDropdown(false);
                    }
                  }}
                >
                  OK
                </Button>
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>
      <div
        className={`pf-dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleImageFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="preview" className="pf-preview" />
        ) : (
          <p>Drag &amp; drop an image, or click to select</p>
        )}
        {uploading && <Spinner animation="border" size="sm" className="pf-spinner" />}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleImageFile(e.target.files?.[0])}
        />
      </div>
      {form.thumbnailURL ? (
        <small className="pf-url">{form.thumbnailURL}</small>
      ) : null}
      {form.postURL ? (
        <small className="pf-url">Instagram: {form.postURL}</small>
      ) : null}
      {stepStatus ? (
        <small className="pf-step-status" style={{ color: stepStatus.startsWith("✅") ? "#1a7f37" : "#0d6efd", fontWeight: "500" }}>
          {stepStatus}
        </small>
      ) : null}
      {uploadError ? (
        <small style={{ color: "#b22222" }}>{uploadError}</small>
      ) : null}
      <Form.Control
        placeholder="Store name"
        value={form.storeName}
        name="storeName"
        onChange={handleChange}
      />
      <Form.Control
        placeholder="Keywords"
        value={form.keywords}
        name="keywords"
        onChange={handleChange}
      />
      <Form.Control
        placeholder="Password"
        value={form.password}
        name="password"
        onChange={handleChange}
      />
      <Button
        onClick={addStore}
        id="submitButton"
        disabled={uploading}
      >
        {uploading ? "Uploading…" : "Add store"}
      </Button>
    </Container>
  );
}

export default PostForm;
