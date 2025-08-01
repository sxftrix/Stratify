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

export default function BillTrackerPage({ user }) {
    const [editMode, setEditMode] = useState(false);
    const [bills, setBills] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', amount: '' });
    const [editIndex, setEditIndex] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBills = async () => {
            const snapshot = await getDocs(collection(db, 'bills'));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBills(data);
        };
        fetchBills();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleEdit = (index) => {
        setEditIndex(index);
        setForm(bills[index]);
        setEditMode(true);
    };

    const handleDelete = async (index) => {
        const billToDelete = bills[index];
        if (!billToDelete.id) return;

        try {
            await deleteDoc(doc(db, 'bills', billToDelete.id));
            const updated = bills.filter((_, i) => i !== index);
            setBills(updated);
        } catch (err) {
            console.error('Error deleting bill:', err);
        }

        setEditIndex(null);
        setForm({ name: '', description: '', amount: '' });
        setEditMode(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const billsRef = collection(db, 'bills');

        if (editIndex !== null) {
            const billToUpdate = bills[editIndex];
            const billDocRef = doc(db, 'bills', billToUpdate.id);
            try {
                await updateDoc(billDocRef, form);
                const updated = [...bills];
                updated[editIndex] = { ...form, id: billToUpdate.id };
                setBills(updated);
            } catch (err) {
                console.error('Error updating bill:', err);
            }
        } else {
            try {
                const docRef = await addDoc(billsRef, form);
                setBills([...bills, { ...form, id: docRef.id }]);
            } catch (err) {
                console.error('Error adding bill:', err);
            }
        }

        setEditIndex(null);
        setForm({ name: '', description: '', amount: '' });
        setEditMode(false);
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
        setForm({ name: '', description: '', amount: '' });
        setEditMode(false);
    };

    const totalCost = bills.reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);

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
                            <span className="business-icon">💸</span>
                            <span>Bill Tracker : by {user?.name || 'User'}</span>
                        </div>
                        {/* If you want a collaborator toggle, add it here */}
                    </div>

                    {/* Business Type */}
                    <div className="business-type">Retail Store</div>

                    {/* Tabs + Edit button */}
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
                                onClick={() => {
                                    setEditMode(true);
                                    setEditIndex(null);
                                    setForm({ name: '', description: '', amount: '' });
                                }}
                                className="tab-button"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Edit/Add Form */}
                    {editMode && (
                        <div className="modal-overlay">
                            <div className="panel-form">
                                <button className="close-btn" onClick={handleCancelEdit}>✕</button>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Name of Bill"
                                        required
                                        autoFocus
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Description"
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="amount"
                                        value={form.amount}
                                        onChange={handleChange}
                                        placeholder="Amount"
                                        step="0.01"
                                        required
                                    />
                                    <button type="submit">
                                        {editIndex !== null ? 'Update' : 'Add'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Bills Table */}
                    <table className="crud-table">
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>Name of Bill</th>
                                <th style={{ width: '40%' }}>Description</th>
                                <th style={{ width: '25%' }}>Amount</th>
                                <th style={{ width: '10%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill, index) => (
                                <tr key={bill.id || index} className={editMode ? 'editable-row' : ''}>
                                    <td>{bill.name}</td>
                                    <td>{bill.description}</td> 
                                    <td>${parseFloat(bill.amount).toFixed(2)}</td>
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
                            {bills.length > 0 && (
                                <tr>
                                    <td><strong>Total:</strong></td>
                                    <td colSpan="3"><strong>${totalCost.toFixed(2)}</strong></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
