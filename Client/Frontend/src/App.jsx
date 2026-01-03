import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import ContactCard from './components/ContactCard';
import Modal from './components/Modal';
import ContactForm from './components/ContactForm';
import { AnimatePresence, motion } from 'framer-motion';

// Use the environment variable, fallback to localhost if missing (for dev)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/contacts`;

function App() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Contacts
  const fetchContacts = async (search = "") => {
    setIsLoading(true);
    try {
      const url = search ? `${API_URL}/search?name=${search}` : API_URL;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();

      const list = data.mappedarray || [];
      // Sort by first name default
      list.sort((a, b) => a.firstName.localeCompare(b.firstName));

      setContacts(list);
      setFilteredContacts(list);
    } catch (error) {
      console.error(error);
      toast.error("Could not load contacts. Check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Search Handler
  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchContacts(term);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  // Handle Form Submit (Create or Update)
  const handleSave = async (formData) => {
    try {
      if (editingContact) {
        // Update
        const res = await fetch(`${API_URL}/${editingContact._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Contact updated successfully!");
      } else {
        // Create
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Creation failed");
        }
        toast.success("New contact created!");
      }

      setIsModalOpen(false);
      fetchContacts(searchTerm); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // Handle Delete
  const handleDelete = async (contact) => {
    if (!window.confirm(`Are you sure you want to delete ${contact.firstName}?`)) return;

    try {
      const res = await fetch(`${API_URL}/${contact._id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.info("Contact deleted.");
      fetchContacts(searchTerm);
    } catch (error) {
      toast.error("Failed to delete contact.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-indigo-500/30">
      <Navbar onSearch={handleSearch} onOpenCreate={handleOpenCreate} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-500">No contacts found</h2>
            <p className="text-slate-400 mt-2">Try adding a new one or adjusting your search.</p>
            <button
              onClick={handleOpenCreate}
              className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
            >
              Create Contact
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact._id}
                  contact={contact}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContact ? "Edit Contact" : "Add New Contact"}
      >
        <ContactForm
          initialData={editingContact}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isLoading={false}
        />
      </Modal>

      <ToastContainer
        position="bottom-right"
        theme="dark"
        toastStyle={{ backgroundColor: '#1e293b', color: '#fff' }}
      />
    </div>
  );
}

export default App;
