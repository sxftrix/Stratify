import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { db } from '../firebase';

import Navbar from '../components/Navbar';
import landingBG from '../assets/images/bg_landing.png';
import panelImage from '../assets/images/panel_top_image.png';

export default function DetailedTransacPage({ user }) {
    const location = useLocation();
    const navigate = useNavigate();

    const categories = {
        'Material Procurement': {
            collection: 'materialProcurement',
            columns: ['Item Purchased', 'Department', 'Price'],
            fields: ['item', 'department', 'price'],
            renderRow: (entry) => [
                entry.item,
                entry.department,
                `$${parseFloat(entry.price || 0).toFixed(2)}`
            ],
            totalField: 'price'
        },
        'Employee Reimbursements': {
            collection: 'employeeReimbursements',
            columns: ['Name of Employee', 'Amount', 'Status'],
            fields: ['employee', 'amount', 'status'],
            renderRow: (entry) => [
                entry.employee,
                `$${parseFloat(entry.amount || 0).toFixed(2)}`,
                entry.status
            ],
            totalField: 'amount'
        }
    };

    const [selectedCategory, setSelectedCategory] = useState('Material Procurement');
    const [entries, setEntries] = useState([]);
    const [form, setForm] = useState({});
    const [editIndex, setEditIndex] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const current = categories[selectedCategory];

    const fetchEntries = async () => {
        const snapshot = await getDocs(collection(db, current.collection));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEntries(data);
    };

    useEffect(() => {
        fetchEntries();
    }, [selectedCategory]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const colRef = collection(db, current.collection);

        if (editIndex !== null) {
            const entry = entries[editIndex];
            const docRef = doc(colRef, entry.id);
            await updateDoc(docRef, form);
            const updated = [...entries];
            updated[editIndex] = { id: entry.id, ...form };
            setEntries(updated);
        } else {
            const docRef = await addDoc(colRef, form);
            setEntries([...entries, { id: docRef.id, ...form }]);
        }

        setForm({});
        setEditIndex(null);
        setEditMode(false);
    };

    const handleEdit = (index) => {
        const entry = entries[index];
        setEditIndex(index);
        setForm(entry);
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
        setForm({ name: '', email: '', role: 'Viewer' });
        setEditMode(false);
    };

    const handleDelete = async (index) => {
        const entry = entries[index];
        await deleteDoc(doc(db, current.collection, entry.id));
        setEntries(entries.filter((_, i) => i !== index));
        if (editIndex === index) {
            setEditIndex(null);
            setForm({});
            setEditMode(false);
        }
    };

    const totalAmount = entries.reduce((sum, entry) => {
        const val = parseFloat(entry[current.totalField] || 0);
        return sum + (isNaN(val) ? 0 : val);
    }, 0);

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
                    minHeight: '100vh'
                }}
            >
                <div className="panel-container">
                    {/* Panel Top Image */}
                    <img src={panelImage} alt="Panel Top" className="panel-top-image" />

                    <div className="panel-header">
                        <div className="panel-header-left">
                            <span className="business-icon">💸</span>
                            <span>Detailed Transactions : by {user?.name || 'User'}</span>
                        </div>
                    </div>

                    {/* Business Type */}
                    <div className="business-type">Retail Store</div>

                    {/* Tabs + Add Button */}
                    <div className="tab-section">
                        <button onClick={() => navigate('/user-management')}
                            className={`tab-button ${location.pathname === '/user-management' ? 'active' : ''}`}>
                            User Management
                        </button>
                        <button onClick={() => navigate('/bill-tracker')}
                            className={`tab-button ${location.pathname === '/bill-tracker' ? 'active' : ''}`}>
                            Bill Tracker
                        </button>
                        <button onClick={() => navigate('/detailed-transactions')}
                            className={`tab-button ${location.pathname === '/detailed-transactions' ? 'active' : ''}`}>
                            Detailed Transactions
                        </button>

                        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                            {Object.keys(categories).map(cat => (
                                <button
                                    key={cat}
                                    className={`tab-button small ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setEditIndex(null);
                                        setForm({});
                                        setEditMode(false);
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="edit-button-wrapper">
                            <button
                                onClick={() => {
                                    setEditMode(true);
                                    setEditIndex(null);
                                    setForm({});
                                }}
                                className="tab-button"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <table className="crud-table">
                        <thead>
                            <tr>
                                {current.columns.map((col, i) => (
                                    <th key={i}>{col}</th>
                                ))}
                                <th style={{ width: '10%' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, index) => (
                                <tr key={entry.id || index}>
                                    {current.renderRow(entry).map((cell, i) => (
                                        <td key={i}>{cell}</td>
                                    ))}
                                    <td>
                                        <button
                                            onClick={() => handleEdit(index)}
                                            title="Edit"
                                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', marginRight: '0.5rem' }}
                                        >
                                            ⭕
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            title="Delete"
                                            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                                        >
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {entries.length > 0 && (
                                <tr>
                                    <td colSpan={current.columns.length - 1}><strong>Total:</strong></td>
                                    <td><strong>${totalAmount.toFixed(2)}</strong></td>
                                    <td></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Floating Modal */}
                {editMode && (
                    <div className="modal-overlay" onClick={() => setEditMode(false)}>
                        <div className="panel-form" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={handleCancelEdit}>✕</button>
                            <h2>{editIndex !== null ? 'Edit Entry' : 'Add New Entry'}</h2>
                            <form onSubmit={handleSubmit}>
                                {current.fields.map((field, idx) => (
                                    <input
                                        key={idx}
                                        name={field}
                                        placeholder={current.columns[idx]}
                                        value={form[field] || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                ))}
                                <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
                                    {editIndex !== null ? 'Update' : 'Add'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}