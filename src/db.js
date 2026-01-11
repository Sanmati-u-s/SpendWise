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
    updateDoc
} from "firebase/firestore";

const EXPENSES_COLLECTION = 'expenses';

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
            expenses.push({ id: doc.id, ...doc.data() });
        });
        callback(expenses);
    });
};
