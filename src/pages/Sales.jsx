import React, { useState, useEffect } from 'react';
import { loadFromLocalStorage } from '../utils/localStorageHelpers';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    const storedProducts = loadFromLocalStorage('products') || [];
    setProducts(storedProducts);
  }, []);

  useEffect(() => {
    const storedSales = loadFromLocalStorage('sales') || [];
    setSales(storedSales);
  }, []);

  const filteredSales = sales.filter((sale) =>
    sale.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? sale.category === selectedCategory : true)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  return (
    <>
    <main>
    <header>
        <h3>Sales</h3>
    </header>
    <div className="sales-page">
      <div className="sales-header">
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
      <table className="sales-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentSales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.name}</td>
              <td>{sale.price}</td>
              <td>{sale.quantity}</td>
              <td>{sale.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={page === currentPage ? 'active' : ''}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
    </main>
    </>
  )
};

export default Sales;