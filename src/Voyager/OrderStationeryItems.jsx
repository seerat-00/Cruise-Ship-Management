import React, { useState, useEffect } from 'react';
import './OrderStationeryItems.css';
import { db } from '../Firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

function OrderStationeryItems() {
  // State to store all fetched items from Firestore
  const [, setItems] = useState([]);

  // State to store items grouped by category 
  const [categorizedItems, setCategorizedItems] = useState({});

  // State to hold the user's current cart with item ids as keys Each entry contains item, info, quantity
  const [cart, setCart] = useState({});

  // Fetch stationery items from Firestore on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Fetching stationery items from Firestore...");
        const querySnapshot = await getDocs(collection(db, "stationeryItems"));
        
        // Map Firestore documents into usable JS objects
        const fetchedItems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(`Fetched ${fetchedItems.length} items.`);

        // Group items by their category for better UI grouping
        const grouped = fetchedItems.reduce((acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        }, {});
        console.log("Items grouped by category:", grouped);

        // Update states
        setItems(fetchedItems);
        setCategorizedItems(grouped);
      } catch (error) {
        console.error("Error fetching stationery items:", error);
      }
    };

    fetchItems();
  }, []);

  // Add an item to the cart or increase its quantity by 1
  const addItem = (item) => {
    console.log(`Adding item to cart: ${item.name} (id: ${item.id})`);
    setCart(prev => ({
      ...prev,
      [item.id]: {
        ...item,
        quantity: (prev[item.id]?.quantity || 0) + 1
      }
    }));
  };

  // Increment quantity of an item already in the cart
  const increment = (id) => {
    console.log(`Incrementing quantity for item id: ${id}`);
    setCart(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: prev[id].quantity + 1
      }
    }));
  };

  // Decrement quantity of an item; remove if quantity reaches zero
  const decrement = (id) => {
    console.log(`Decrementing quantity for item id: ${id}`);
    setCart(prev => {
      const updated = { ...prev };
      if (updated[id].quantity > 1) {
        updated[id].quantity -= 1;
      } else {
        console.log(`Quantity reached 1, removing item id: ${id} from cart.`);
        delete updated[id];
      }
      return updated;
    });
  };

  // Remove an item completely from the cart
  const removeFromCart = (id) => {
    console.log(`Removing item id: ${id} from cart.`);
    setCart(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // Clear the entire cart
  const clearCart = () => {
    console.log("Clearing entire cart.");
    setCart({});
  };

  // Convert cart object to array for iteration and calculate total price
  const orderItems = Object.values(cart);
  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Place order by saving current cart to Firestore
  const placeOrder = async () => {
    if (orderItems.length === 0) {
      alert("Your cart is empty.");
      console.warn("Order attempt failed: cart is empty.");
      return;
    }

    try {
      console.log("Placing order with items:", orderItems);
      await addDoc(collection(db, "stationeryOrders"), { //add the data to the collection 
        items: orderItems,
        total: totalAmount,
        timestamp: new Date()
      });
      alert(`Order placed! Total: $${totalAmount.toFixed(2)}`);
      console.log("Order successfully placed.");
      clearCart();
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="stationery-container">
      <h1 className="stationery-title">Stationery Order</h1>

      {/* Display items grouped by categories */}
      {Object.entries(categorizedItems).map(([category, categoryItems]) => (
        <div key={category}>
          <h2 style={{ color: '#1558b0', margin: '1.5rem 0 1rem' }}>{category}</h2>
          <div className="stationery-grid">
            {categoryItems.map(item => (
              <div key={item.id} className="stationery-card">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>Price: ${item.price.toFixed(2)}</p>
                <button onClick={() => addItem(item)}>Add to Order</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Shopping cart section */}
      <div className="stationery-cart">
        <h2>Your Order</h2>
        {orderItems.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {orderItems.map(({ id, name, quantity }) => (
                <li key={id}>
                  <span>{name} (x{quantity})</span>
                  <div className="stationery-cart-buttons">
                    {/* Increment the quantity */}
                    <button onClick={() => increment(id)}>+</button>
                    {/* Decrement the quantity or remove if only one */}
                    {quantity > 1 ? (
                      <button onClick={() => decrement(id)}>−</button>
                    ) : (
                      <button onClick={() => removeFromCart(id)}>Remove</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Clear and Confirm buttons */}
            <div className="stationery-button-group">
              <button className="stationery-clear-button" onClick={clearCart}>
                Clear Cart
              </button>
              <button className="booking-order-button" onClick={placeOrder}>
                Confirm Booking
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderStationeryItems;
