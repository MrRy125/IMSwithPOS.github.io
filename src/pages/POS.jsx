import React, { useState, useEffect } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorageHelpers';
import '/src/styles/POS.css'

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState(0);
  const [receiptVisible, setReceiptVisible] = useState(false);

  useEffect(() => {
    const storedProducts = loadFromLocalStorage('products') || [];
    setProducts(storedProducts);
  }, []);

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      const updatedItems = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const changeQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      const updatedItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      setCartItems(updatedItems);
    }
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
  };

  const confirmOrder = (payment) => {
    const change = payment - total;
    alert(`Payment received: ${payment}. Change: ${change}`);
  
    // Create an array to store sales data
    const salesData = cartItems.map((item) => ({
      id: Date.now(),
      productId: item.id, // Add the productId from the cart item
      ...item,
      date: new Date().toLocaleString(),
    }));
  
    const updatedProducts = products.map((product) => {
      const cartItem = cartItems.find((item) => item.id == product.id);
      if (cartItem) {
        const updatedPurchaseAmount = product.purchasesAmount - cartItem.quantity;
        return { 
          ...product, 
          stock: product.stock - cartItem.quantity, 
          purchasesAmount: updatedPurchaseAmount,
          salesAmount: product.salesAmount + cartItem.quantity,
        };  
      }
      console.table(product);
      return product;
    });
  
    saveToLocalStorage('products', updatedProducts);
    saveToLocalStorage('sales', [
      ...loadFromLocalStorage('sales') || [],
      ...salesData, // Save the new sales data
    ]);
  
    setProducts(updatedProducts);
    setCartItems([]);
    setPayment(payment);
    setReceiptVisible(true);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(totalAmount);
  }, [cartItems]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? product.category === selectedCategory : true)
  );

  const handleConfirm = () => {
    confirmOrder(payment);
    setIsModalOpen(false)
  };

  const change = payment - total;

  return (
    <main>
      <header>
        <h3>POS</h3>
      </header>
    <div className="pos-page">
      <div className="pos-header">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {[...new Set(products.map((product) => product.category))].map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>
      </div>

      <div className="product-catalog">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-item" onClick={() => addToCart(product)}>
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
              <span>{product.name}</span>
              <span>{product.category}</span>
              <span>{product.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-view">
        <h3>Cart</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <span>{item.name}</span>
            <div className="quantity-controls">
              <button onClick={() => changeQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => changeQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="total-bar">
        <span>Total: {total}</span>
        <button onClick={() => setIsModalOpen(true)}>Confirm Order</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Payment Processing</h2>
            <p>Total: {total}</p>
            <input
              type="number"
              value={payment}
              onChange={(e) => setPayment(parseFloat(e.target.value))}
              placeholder="Enter payment amount"
            />
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {receiptVisible && (
        <div>
          <h3>Receipt</h3>
          <div>
            {cartItems.map((item) => (
              <div key={item.id}>
                <span>{item.name}</span>
                <span>{item.quantity} x {item.price}</span>
                <span>{item.quantity * item.price}</span>
              </div>
            ))}
          </div>
          <div>
            <span>Total: {total}</span>
            <span>Payment: {payment}</span>
            <span>Change: {change}</span>
          </div>
        </div>
      )}
    </div>
    </main>
  )
}

export default POS