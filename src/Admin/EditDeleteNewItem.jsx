import React, { useState } from "react";
import './EditDeleteNewItem.css';
import { db } from '../Firebase';
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const EditDeleteNewItem = ({ items = [], refreshItems }) => {
  const [editItemId, setEditItemId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", type: "catering", price: "" });

  const handleEditClick = (item) => {
    console.log("Editing item:", item);
    setEditItemId(item.id);
    setEditForm({ name: item.name, type: item.type, price: item.price });
  };

  const handleEditChange = (e) => {
    console.log(`Edit field changed - ${e.target.name}:`, e.target.value);
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    const collectionName = editForm.type === "catering" ? "cateringItems" : "stationeryItems";
    const itemRef = doc(db, collectionName, id);
    console.log("Attempting to save item:", { id, ...editForm });

    try {
      await updateDoc(itemRef, {
        name: editForm.name,
        type: editForm.type,
        price: parseFloat(editForm.price),
        updatedAt: new Date()
      });
      console.log(`Item (${id}) updated successfully in ${collectionName}.`);
      alert("Item updated successfully.");
      refreshItems();
      console.log("Items refreshed after update.");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item.");
    }

    setEditItemId(null);
    console.log("Exited edit mode.");
  };

  const handleDelete = async (id, type) => {
    const collectionName = type === "catering" ? "cateringItems" : "stationeryItems";
    const itemRef = doc(db, collectionName, id);
    console.log(`Attempting to delete item ${id} from ${collectionName}`);

    try {
      await deleteDoc(itemRef);
      console.log(`Item (${id}) deleted successfully from ${collectionName}`);
      alert("Item deleted.");
      refreshItems();
      console.log("Items refreshed after deletion.");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  const handleCancel = () => {
    console.log("Edit cancelled for item:", editItemId);
    setEditItemId(null);
  };

  return (
    <div className="edit-delete-container">
      <h2 className="edit-delete-title">Edit / Delete Items</h2>
      <table className="edit-delete-table">
        <thead>
          <tr className="edit-delete-header-row">
            <th className="edit-delete-header-cell">Name</th>
            <th className="edit-delete-header-cell">Type</th>
            <th className="edit-delete-header-cell">Price</th>
            <th className="edit-delete-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="4" className="edit-delete-empty-row">
                No items to display.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="edit-delete-data-row">
                <td className="edit-delete-cell">
                  {editItemId === item.id ? (
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="edit-delete-input"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="edit-delete-cell">
                  {editItemId === item.id ? (
                    <select
                      name="type"
                      value={editForm.type}
                      onChange={handleEditChange}
                      className="edit-delete-select"
                    >
                      <option value="catering">Catering</option>
                      <option value="stationery">Stationery</option>
                    </select>
                  ) : (
                    item.type
                  )}
                </td>
                <td className="edit-delete-cell">
                  {editItemId === item.id ? (
                    <input
                      name="price"
                      type="number"
                      value={editForm.price}
                      onChange={handleEditChange}
                      className="edit-delete-input"
                    />
                  ) : (
                    `$${item.price}`
                  )}
                </td>
                <td className="edit-delete-cell">
                  {editItemId === item.id ? (
                    <>
                      <button
                        onClick={() => handleSave(item.id)}
                        className="edit-delete-btn save"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="edit-delete-btn cancel"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(item)}
                        className="edit-delete-btn edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.type)}
                        className="edit-delete-btn delete"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EditDeleteNewItem;
