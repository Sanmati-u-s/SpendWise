import { db } from './firebase';
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    orderBy,
    serverTimestamp
} from "firebase/firestore";

const EXPENSES_COLLECTION = 'expenses';

export const addExpense = (uid, expense) => {
    return addDoc(collection(db, EXPENSES_COLLECTION), {
        ...expense,
        uid,
        createdAt: serverTimestamp()
    });
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
