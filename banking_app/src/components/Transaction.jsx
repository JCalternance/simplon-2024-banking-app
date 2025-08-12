import React, {useState, useEffect} from 'react';
import {
    getTransactions,
    createTransaction,
    deleteTransaction
} from '../services/transactionService.js';
import {getCategories} from '../services/categoryService.js';
import {getPaymentMethods} from '../services/paymentMethodService.js';
import { formatDate, formatTime} from "../utils/DateTimeFormatter.js";
import DeleteButton from "./commons/deleteButton/DeleteButton.jsx";
import AddButton from "./commons/addButton/AddButton.jsx";

export default function Transactions() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('00:00');
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [paymentMethodName, setPaymentMethodName] = useState('');
    const [categoryColor, setCategoryColor] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'asc'});

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    useEffect(() => {
        loadAll();
    }, []);


    async function loadAll() {
        try {
            const [txs, cats, pms] = await Promise.all([
                getTransactions(),
                getCategories(),
                getPaymentMethods(),
            ]);
            setTransactions(txs);
            setCategories(cats);
            setPaymentMethods(pms);
        } catch (e) {
            alert('Erreur chargement: ' + e.message);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        toggleModal();
        if (!categoryId || !paymentMethodId) {
            alert('Catégorie et moyen de paiement requis');
            return;
        }
        try {
            await createTransaction({
                title,
                description,
                amount: parseFloat(amount),
                date,
                time,
                categoryId,
                paymentMethodId
            });
            // reset form
            setTitle('');
            setDescription('');
            setAmount('');
            setDate('');
            setTime('00:00');
            setCategoryId('');
            setPaymentMethodId('');
            loadAll();
        } catch (e) {
            alert('Erreur création transaction: ' + e.message);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Supprimer cette transaction ?')) return;
        try {
            await deleteTransaction(id);
            loadAll();
        } catch (e) {
            alert('Erreur suppression: ' + e.message);
        }
    }

    const sortedTransactions = [...transactions].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];
        if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({key, direction});
    };

    return (
        <div >
            <div className="title">
                <h2>Transactions</h2>
                <AddButton onClick={() => toggleModal()}/>
            </div>
            {isModalOpen && (
                <div className="modal">
                    <form onSubmit={handleAdd}>
                        <input
                            type="text"
                            placeholder="Titre"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Montant"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                            step="0.01"
                        />
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                        <input
                            type="time"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            required
                        />
                        <select
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">-- Choisir catégorie --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={paymentMethodId}
                            onChange={e => setPaymentMethodId(e.target.value)}
                            required
                        >
                            <option value="">-- Choisir moyen de paiement --</option>
                            {paymentMethods.map(pm => (
                                <option key={pm.id} value={pm.id}>
                                    {pm.name} - **** {pm.lastDigits}
                                </option>
                            ))}
                        </select>
                        <button type="submit">Ajouter</button>
                    </form>
                    <button className="close" onClick={toggleModal}>Fermer</button>
                </div>
            )}

            <table className="table">
                <thead>
                <tr>
                    <th className="th-order" onClick={() => requestSort('date')}>Date</th>
                    <th className="th-order sm-hide" onClick={() => requestSort('time')}>Heure</th>
                    <th className="th-order" onClick={() => requestSort('title')}>Titre</th>
                    <th className="th-order" onClick={() => requestSort('amount')}>Montant (€)</th>
                    <th className="th-order" onClick={() => requestSort('categoryName')}>Catégorie</th>
                    <th className="th-order sm-hide" onClick={() => requestSort('paymentMethoName')}>Moyen de paiement</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedTransactions.map(tx => (
                    <tr key={tx.id}>
                        <td>{formatDate(tx.date)}</td>
                        <td className="sm-hide">{formatTime(tx.date)}</td>
                        <td>{tx.title}</td>
                        <td>{tx.amount} €</td>
                        <td className="cat-badge" style={{background: tx.categoryColor}}>{tx.categoryName}</td>
                        <td className="sm-hide">{tx.paymentMethodName}</td>
                        <td>
                            <DeleteButton onClick={() => handleDelete(tx.id)}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
