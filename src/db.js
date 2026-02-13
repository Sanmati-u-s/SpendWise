import { db } from './firebase';
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    orderBy,
    serverTimestamp,
    doc,
    deleteDoc,
    updateDoc,
    setDoc,
    getDocs
} from "firebase/firestore";

const EXPENSES_COLLECTION = 'expenses';
const USERS_COLLECTION = 'users';

export const createUserProfile = (uid, username, email) => {
    // Store username -> email mapping. specific doc ID = username ensures uniqueness check via rule or code if needed.
    // Here we just add a doc. For uniqueness we'd ideally use username as ID.
    // Let's use username as doc ID to enforce uniqueness easily.
    return setDoc(doc(db, USERS_COLLECTION, username), {
        uid,
        email,
        username,
        createdAt: serverTimestamp()
    });
};

export const getUserEmailByUsername = async (username) => {
    const docRef = doc(db, USERS_COLLECTION, username);
    // actually we need to read it. But to be safe if we didn't use username as ID, we'd query.
    // Plan said "getUserEmailByUsername".
    // Let's assume we use username as the Document ID for fast lookup.
    // We need to import getDoc.
    const snapshot = await import("firebase/firestore").then(m => m.getDoc(docRef));
    if (snapshot.exists()) {
        return snapshot.data().email;
    }
    return null;
};

export const addExpense = (uid, expense) => {
    return addDoc(collection(db, EXPENSES_COLLECTION), {
        ...expense,
        uid,
        createdAt: serverTimestamp()
    });
};

export const deleteExpense = (id) => {
    return deleteDoc(doc(db, EXPENSES_COLLECTION, id));
};

export const updateExpense = (id, data) => {
    return updateDoc(doc(db, EXPENSES_COLLECTION, id), data);
};

export const subscribeToExpenses = (uid, callback) => {
    const q = query(
        collection(db, EXPENSES_COLLECTION),
        where("uid", "==", uid),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const expenses = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.type !== 'budget') { // Filter out budget docs
                expenses.push({ id: doc.id, ...data });
            }
        });
        callback(expenses);
    });
};

// Start Refactor: Store budgets in expenses collection to allow write
export const setMonthlyBudget = (uid, month, amount) => {
    // ID: budget_UID_YYYY-MM
    const budgetId = `budget_${uid}_${month}`;
    return setDoc(doc(db, EXPENSES_COLLECTION, budgetId), {
        uid,
        type: 'budget',
        month,
        limit: parseFloat(amount),
        updatedAt: serverTimestamp()
    });
};

export const subscribeToBudget = (uid, callback) => {
    const q = query(
        collection(db, EXPENSES_COLLECTION),
        where("uid", "==", uid),
        where("type", "==", "budget")
    );

    return onSnapshot(q, (snapshot) => {
        const budgets = {};
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.month) {
                budgets[data.month] = data.limit;
            }
        });
        callback(budgets);
    });
};