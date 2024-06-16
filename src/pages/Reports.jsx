// Reports.js
import React, { useState, useEffect } from 'react';
import { loadFromLocalStorage } from '../utils/localStorageHelpers';

const Reports = () => {
  const [currentReport, setCurrentReport] = useState('sales');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const itemsPerPage = 30;

  useEffect(() => {
    const fetchData = () => {
      const salesData = loadFromLocalStorage('sales') || [];
      const purchasesData = loadFromLocalStorage('purchases') || [];
      const productsData = loadFromLocalStorage('products') || [];
      
      if (currentReport === 'sales') {
        setData(salesData);
      } else if (currentReport === 'purchases') {
        setData(purchasesData);
      } else {
        setData(productsData);
      }
    };

    fetchData();
  }, [currentReport]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleExport = () => {
    const csvData = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${currentReport}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <header>
        <h3>Reports000-/</h3>
      </header>
      <div>
        <button onClick={() => setCurrentReport('sales')} className={currentReport === 'sales' ? 'active' : ''}>Sales</button>
        <button onClick={() => setCurrentReport('purchases')} className={currentReport === 'purchases' ? 'active' : ''}>Purchases</button>
        <button onClick={() => setCurrentReport('products')} className={currentReport === 'products' ? 'active' : ''}>Products</button>
      </div>

      <table>
        <thead>
          <tr>
            {currentData.length > 0 && Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((value, idx) => <td key={idx}>{value}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
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

      <button onClick={handleExport}>Export as CSV</button>
    </div>
  );
};

export default Reports;
