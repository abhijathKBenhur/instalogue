import React, { useEffect, useState } from "react";
import { Button, Modal, Container, Spinner } from "react-bootstrap";
import CatalogueInterface from "../../interface/CatalogueInterface";
import "./Admin.scss";
import PostForm from "../../components/PostForm/PostForm";
import { useHistory } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';


function trimUrl(url, maxLength = 30) {
  if (!url) return '';
  return url.length > maxLength ? url.slice(0, maxLength) + '…' : url;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function Admin() {
  const history = useHistory();
  const [refresh, setRefresh] = useState(false);
  const [editingStore, setEditingStore] = useState({});
  const [loading, setLoading] = useState(false);
  // Admin password state
  const [adminVerified, setAdminVerified] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    if (!adminVerified) return;
    setLoading(true);
    CatalogueInterface.getStores({ password: adminPassword })
      .then((res) => {
        setStores(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response?.status === 401) {
          setAdminVerified(false);
          setAdminError("Session expired or invalid password. Please login again.");
          setAdminPassword("");
        }
      });
  }, [refresh, adminVerified]);

  if (!adminVerified) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
       
        <h2 className="mb-3">Admin Panel Login</h2>
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Enter admin password"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
            autoFocus
          />
          <Button type="submit" variant="primary"  className="w-100" onClick={() => { setRefresh((r) => !r); setAdminVerified(true) }}>
            { "Login"}
          </Button>
      </Container>
    );
  }

  return (
    <div className="admin-listing-page">
      <div className="text-center mb-4">
      <Button variant="primary" onClick={() => { history.push("/") }}>
          <HomeIcon />
        </Button>
      </div>
      <PostForm
            initialData={editingStore}
          />
    </div>
  );
}

export default Admin;
