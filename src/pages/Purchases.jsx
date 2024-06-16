// Purchases.js
import React, { useState, useEffect} from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorageHelpers';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const storedPurchases = loadFromLocalStorage('purchases') || [];
    const storedProducts = loadFromLocalStorage('products') || [];
    setPurchases(storedPurchases);
    setProducts(storedProducts);
  }, []);

  const loadFromLocalStorage = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  };

  const saveToLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const updateProductPurchaseAmount = (productId, amount) => {
    const storedProducts = loadFromLocalStorage('products') || [];
    const updatedProducts = storedProducts.map((product) => {
      const prevPurchaseAmount = product.purchasesAmount;
      console.log(prevPurchaseAmount);
      const existingAmount = product.purchaseAmount ? product.purchaseAmount.toString().split('').map(Number) : [0];
      console.log(existingAmount)
      const newPurchaseAmount = Number([...existingAmount.filter((digit, index) => index !== 0 || digit !== 0), ...amount.toString().split('').map(Number)].join(''));
      if (product.id == productId) {
        return {
          ...product,
          purchasesAmount: newPurchaseAmount + Number(prevPurchaseAmount),
        };
      }
      return product;
    
    });
    console.table(updatedProducts)
    saveToLocalStorage('products', updatedProducts);
  };

  const addPurchase = (purchase) => {
    const newPurchase = {
      id: Date.now(),
      ...purchase,
    };
    const product = products.find((p) => p.id == purchase.productId);

  if (product) {
    // Add price and quantity properties to the newPurchase object
    newPurchase.price = Number(product.price);
    newPurchase.quantity = Number(purchase.amount);

    const updatedPurchases = [...purchases, newPurchase];
    setPurchases(updatedPurchases);
    saveToLocalStorage('purchases', updatedPurchases);

    // Update the product's purchase amount
    updateProductPurchaseAmount(newPurchase.productId, newPurchase.amount);
  } else {
    console.error(`Product with id ${purchase.productId} not found.`);
  }
  };

  const editPurchase = (editedPurchase) => {
    const updatedPurchases = purchases.map((purchase) =>
      purchase.id === editedPurchase.id ? editedPurchase : purchase
    );
    setPurchases(updatedPurchases);
    saveToLocalStorage('purchases', updatedPurchases);
  };

  const deletePurchase = (purchaseId) => {
    const updatedPurchases = purchases.filter((purchase) => purchase.id !== purchaseId);
    setPurchases(updatedPurchases);
    saveToLocalStorage('purchases', updatedPurchases);
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const product = products.find((product) => product.id == purchase.productId);
    if (!product) {
      return false; // Skip this purchase if no matching product is found
    }
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? product.category === selectedCategory : true)
    );
  });

  const paginatedPurchases = filteredPurchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [purchase, setPurchase] = useState({
    productId: '',
    amount: '',
    date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchase({ ...purchase, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPurchase(purchase);
    setIsModalOpen(false);
    setPurchase({ productId: '', amount: '', date: '' });
  };


  return (
    <main>
      <header>
        <h3>Purchases</h3>
      </header>

      <div className="purchases-page">
        <div className="purchases-header">
          <input
            type="text"
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-combo-box"
          >
            <option value="">All Categories</option>
            {[...new Set(products.map((product) => product.category))].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button onClick={() => setIsModalOpen(true)}>Add Purchase</button>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Add Purchase</h2>
              <form onSubmit={handleSubmit}>
                <select name="productId" value={purchase.productId} onChange={handleChange} required>
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={purchase.amount}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={purchase.date}
                  onChange={handleChange}
                  required
                />
                <button type="submit">Add Purchase</button>
              </form>
              <button onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        )}

        <table className="purchase-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPurchases.map((purchase) => {
              const product = products.find((product) => product.id == purchase.productId);
              return (
                <tr key={purchase.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{purchase.amount}</td>
                  <td>{purchase.date}</td>
                  <td>
                    <button onClick={() => editPurchase(purchase)}>Edit</button>
                    <button onClick={() => deletePurchase(purchase.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredPurchases.length / itemsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={i + 1 === currentPage ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Purchases