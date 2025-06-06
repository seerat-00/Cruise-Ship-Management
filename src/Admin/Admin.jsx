import React, { useState, useEffect } from "react";
import AddNewItem from "./AddNewItem";
import EditDeleteNewItem from "./EditDeleteNewItem";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Admin.css";

const Admin = () => {
  const [items, setItems] = useState([]); //state to store items

  //function to fetch items from the firestore and update state
  const fetchItems = async () => {
    console.log("Fetching items from Firestore...");
    try {
      //fetching the documnets from the cateringItems and stationeryItems collection
      const cateringSnapshot = await getDocs(collection(db, "cateringItems"));
      const stationerySnapshot = await getDocs(collection(db, "stationeryItems"));

      //maps the doc and type field to differentiate
      const cateringItems = cateringSnapshot.docs.map(doc => {
        const item = { id: doc.id, ...doc.data(), type: "catering" };
        console.log("Fetched catering item:", item);
        return item;
      });

      //maps the doc and type field to differentiate
      const stationeryItems = stationerySnapshot.docs.map(doc => {
        const item = { id: doc.id, ...doc.data(), type: "stationery" };
        console.log("Fetched stationery item:", item);
        return item;
      });

      //combine the arrays and update them
      const combinedItems = [...cateringItems, ...stationeryItems];
      setItems(combinedItems);
      console.log("All items combined and set in state:", combinedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  //fetchItems when the component mounts
  useEffect(() => {
    console.log("Admin component mounted. Initiating fetchItems...");
    fetchItems();
  }, []);

  return (
    <div className="admin-handle">
      <h2 className="admin-title">Admin Panel</h2>

      {/* Component for adding a new item */}
      {/* onItemAdded refresh after new item is added */}
      <AddNewItem onItemAdded={() => {
        console.log("New item added. Refreshing item list...");
        fetchItems();
      }} />

      {/* Component for editing and deleting items */}
      {/* refreshItems to fetch items on edit/delete */}
      <EditDeleteNewItem items={items} refreshItems={() => {
        console.log("Refresh requested from child component. Re-fetching items...");
        fetchItems();
      }} />
    </div>
  );
};

export default Admin;
