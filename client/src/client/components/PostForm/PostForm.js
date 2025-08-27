import _ from "lodash";
import { Row, Form, Container, Button, Dropdown } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import './PostForm.scss'
import CatalogueInterface from "../../interface/CatalogueInterface";

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
    // }
  }, []);

  const handleChange = (event) => {
    let returnObj = {};
    returnObj[event.target.name] = event.target.value;
    setFormData({ ...form, ...returnObj });
  };

  const addStore = () => {
    CatalogueInterface.addStore(form)
      .then((success) => {
        alert("posted");
      })
      .catch((err) => {
        alert("Posting failed", err)
      });
  };

  return (
    <Container className="add-form">
      <Form.Group>
        <Dropdown className="w-100" show={showCategoryDropdown} onToggle={(isOpen) => setShowCategoryDropdown(isOpen)}>
          <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start" style={{justifyContent: "start"}}>
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
          <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start"  style={{justifyContent: "start"}}>
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
      <Form.Control
        placeholder="Cloudinary image link"
        value={form.thumbnailURL}
        name="thumbnailURL"
        onChange={handleChange}
      />
      <Form.Control
        placeholder="Instagram post link"
        value={form.postURL}
        name="postURL"
        onChange={handleChange}
      />
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
        onClick={() => {
          addStore();
        }}
        id="submitButton"
      >
        Add store
      </Button>
    </Container>
  );
}

export default PostForm;
