import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "./createContact.css";

function CreateContact({ onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSave = async () => {
    if (!name || !phone || !email) {
      alert("All fields are required");
      return;
    }

    try {
      await addDoc(collection(db, "contacts"), {
        name,
        phone,
        email,
        createdAt: serverTimestamp()
      });

      setName("");
      setPhone("");
      setEmail("");
      onClose(); 
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  return (
    <div className="contact-form-container">
      <div className="contact-card">
        <h2>Create Contact</h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="btn-group">
          <button className="save-btn" onClick={handleSave}>
            Save Contact
          </button>

          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateContact;
