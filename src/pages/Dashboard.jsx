import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth } from "../firebase/firebase";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import CreateContact from "./CreateContact";
import "./dashboard.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState([]);



  const [searchTerm, setSearchTerm] = useState("");


  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );


  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleDelete = async (contact) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${contact.name}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "contacts", contact.id));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };



  const handleEdit = async (contact) => {
    const newName = prompt("Edit Name", contact.name);
    const newEmail = prompt("Edit Email", contact.email);
    const newPhone = prompt("Edit Phone", contact.phone);

    if (!newName || !newEmail || !newPhone) return;

    try {
      await updateDoc(doc(db, "contacts", contact.id), {
        name: newName,
        email: newEmail,
        phone: newPhone,
      });
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "contacts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setContacts(contactList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard">


      <div className="sidebar">
        <h2>Contacts</h2>
        <button
          className="create-btn"
          onClick={() => setShowForm(true)}
        >
          + Create Contact
        </button>
        <h3>Contacts ({contacts.length})</h3>

      </div>


      <div className="main-content">


        <div className="top-bar">
          <h2 className="welcome">Welcome {user?.email}</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>



        <div className="table-header">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span></span>
        </div>


        {searchTerm.trim() !== "" && filteredContacts.length === 0 ? (
          <div className="no-result">
            <div className="no-result-box">
              <p className="search-message">No Match in Your Data...</p>
            </div>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div className="contact-row" key={contact.id}>
              <span>{contact.name}</span>
              <span>{contact.email}</span>
              <span>{contact.phone}</span>

              <div className="actions">
                <FaEdit
                  className="icon edit"
                  onClick={() => handleEdit(contact)}
                />
                <FaTrash
                  className="icon delete"
                  onClick={() => handleDelete(contact)}
                />
              </div>
            </div>
          ))
        )}

        {/* Create Form */}
        {showForm && (
          <CreateContact onClose={() => setShowForm(false)} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
