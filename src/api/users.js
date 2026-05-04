import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase.js";

const COL = "users";

export async function getAllUsers() {
  const q = query(collection(db, COL), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addUser({ username, password, name, role, phone, email }) {
  const existing = await getAllUsers();
  if (existing.find((u) => u.username === username)) {
    throw new Error("שם משתמש כבר קיים");
  }
  const ref = await addDoc(collection(db, COL), {
    username,
    password,
    name,
    role,
    phone: phone || "",
    email: email || "",
    createdAt: Date.now(),
  });
  return { id: ref.id, username, name, role, phone, email };
}

export async function deleteUser(id) {
  await deleteDoc(doc(db, COL, id));
}

export async function updateUser(id, fields) {
  await updateDoc(doc(db, COL, id), fields);
}

export async function updateUserPassword(id, password) {
  await updateDoc(doc(db, COL, id), { password });
}
