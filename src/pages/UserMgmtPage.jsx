import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';

import Navbar from '../components/Navbar';
import panelImage from '../assets/images/panel_top_image.png';
import landingBG from '../assets/images/bg_landing.png';

export default function UserMgmtPage({ user }) {
    const [collaboratorOn, setCollaboratorOn] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', role: 'Viewer' });
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const snapshot = await getDocs(collection(db, 'users'));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const location = useLocation();
    const navigate = useNavigate();

    const handleToggleCollaborator = () => setCollaboratorOn(!collaboratorOn);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const usersRef = collection(db, 'users');

        if (editIndex !== null) {
            const updatedUser = users[editIndex];
            const userDocRef = doc(db, 'users', updatedUser.id);

            try {
                await updateDoc(userDocRef, form);
                const updated = [...users];
                updated[editIndex] = { ...form, id: updatedUser.id };
                setUsers(updated);
            } catch (err) {
                console.error('Error updating user:', err);
            }
        } else {
            try {
                const docRef = await addDoc(usersRef, form);
                setUsers([...users, { ...form, id: docRef.id }]);
            } catch (err) {
                console.error('Error adding user:', err);
            }
        }

        // Reset form and exit edit mode
        setEditIndex(null);
        setForm({ name: '', email: '', role: 'Viewer' });
        setEditMode(false);
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        const selected = users[index];
        setForm({ name: selected.name, email: selected.email, role: selected.role });
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
        setForm({ name: '', email: '', role: 'Viewer' });
        setEditMode(false);
    };

    const handleDelete = async (index) => {
        const userToDelete = users[index];
        await deleteDoc(doc(db, 'users', userToDelete.id));
        const updated = [...users];
        updated.splice(index, 1);
        setUsers(updated);
        setEditIndex(null);
        setForm({ name: '', email: '', role: 'Viewer' });
        setEditMode(false);
    };

    return (
        <>
            <Navbar user={user} />
            <div
                className="page"
                style={{
                    backgroundImage: `url(${landingBG})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div className="panel-container">
                    {/* Panel Top Image */}
                    <img src={panelImage} alt="Panel Top" className="panel-top-image" />

                    {/* Header */}
                    <div className="panel-header">
                        <div className="panel-header-left">
                            <span className="business-icon">🏢</span>
                            <span>My Business : by {user?.name || 'User'}</span>
                        </div>
                        <button
                            onClick={handleToggleCollaborator}
                            className={`collaborator-btn ${collaboratorOn ? 'collaborator-on' : 'collaborator-off'}`}
                        >
                            COLLABORATOR {collaboratorOn ? 'ON' : 'OFF'}
                        </button>
                    </div>

                    {/* Business Type */}
                    <div className="business-type">Retail Store</div>

                    {/* Tabs */}
                    <div className="tab-section">
                        <button
                            onClick={() => navigate('/user-management')}
                            className={`tab-button ${location.pathname === '/user-management' ? 'active' : ''}`}
                        >
                            User Management
                        </button>
                        <button
                            onClick={() => navigate('/bill-tracker')}
                            className={`tab-button ${location.pathname === '/bill-tracker' ? 'active' : ''}`}
                        >
                            Bill Tracker
                        </button>
                        <button
                            onClick={() => navigate('/detailed-transactions')}
                            className={`tab-button ${location.pathname === '/detailed-transactions' ? 'active' : ''}`}
                        >
                            Detailed Transactions
                        </button>
                        <div className="edit-button-wrapper">
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className="tab-button"
                            >
                                {editMode ? 'Close' : 'Add'}
                            </button>
                        </div>
                    </div>

                    {/* Edit/Add Form */}
                    {editMode && (
                        <div className="modal-overlay">
                            <div className="panel-form" onClick={(e) => e.stopPropagation()}>
                                <button className="close-btn" onClick={handleCancelEdit}>✕</button>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <select
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Editor">Editor</option>
                                        <option value="Viewer">Viewer</option>
                                    </select>
                                    <button type="submit">
                                        {editIndex !== null ? 'Update' : 'Add'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Users Table */}
                    <table className="crud-table">
                        <thead>
                            <tr>
                                <th style={{ width: '35%' }}>Name</th>
                                <th style={{ width: '35%' }}>Email</th>
                                <th style={{ width: '20%' }}>Role</th>
                                <th style={{ width: '10%'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((userObj, index) => (
                                <tr key={userObj.id} className={editMode ? 'editable-row' : ''}>
                                    <td>
                                        {editMode && editIndex === index ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="table-input"
                                                autoFocus
                                            />
                                        ) : (
                                            userObj.name
                                        )}
                                    </td>
                                    <td>
                                        {editMode && editIndex === index ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                className="table-input"
                                            />
                                        ) : (
                                            userObj.email
                                        )}
                                    </td>
                                    <td>
                                        {editMode && editIndex === index ? (
                                            <select
                                                name="role"
                                                value={form.role}
                                                onChange={handleChange}
                                                className="table-select"
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Editor">Editor</option>
                                                <option value="Viewer">Viewer</option>
                                            </select>
                                        ) : (
                                            userObj.role
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                if (editIndex === index) {
                                                    handleCancelEdit();
                                                } else {
                                                    handleEdit(index);
                                                }
                                            }}
                                            title={editIndex === index ? 'Cancel edit' : 'Edit'}
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                marginRight: '0.5rem',
                                                color: 'red'
                                            }}
                                        >
                                            ⭕
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="btn-delete"
                                            title="Delete"
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                color: 'red'
                                            }}
                                        >
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
