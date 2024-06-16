// Products.js
import React, { useState, useEffect } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorageHelpers';
import '/src/styles/Products.css'

const Products = () => {
  const [products, setProducts] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
const [isModalOpen, setIsModalOpen] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

useEffect(() => {
  const storedProducts = loadFromLocalStorage('products') || [];
  setProducts(storedProducts);
}, []);

const addProduct = (product) => {
  const newProduct = {
    id: Date.now(),
    ...product,
    purchasesAmount: 0,
    salesAmount: 0,
  };
  const updatedProducts = [...products, newProduct];
  setProducts(updatedProducts);
  saveToLocalStorage('products', updatedProducts);
};

const editProduct = (editedProduct) => {
  const updatedProducts = products.map((product) =>
    product.id === editedProduct.id ? editedProduct : product
  );
  setProducts(updatedProducts);
  saveToLocalStorage('products', updatedProducts);
};

const deleteProduct = (productId) => {
  const updatedProducts = products.filter((product) => product.id !== productId);
  setProducts(updatedProducts);
  saveToLocalStorage('products', updatedProducts);
};

const filteredProducts = products.filter(
  (product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? product.category === selectedCategory : true)
);

const paginatedProducts = filteredProducts.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

const [product, setProduct] = useState({
  image: '',
  name: '',
  price: '',
  category: '',
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setProduct({ ...product, [name]: value });
};

const handleFileChange = (e) => {
  setProduct({ ...product, image: e.target.files[0] });
};

const handleSubmit = (e) => {
  e.preventDefault();
  addProduct(product);
  setIsModalOpen(false);
};

// Render the components
return (
  <main className="container">
      <header className="header">
        <h3>Product Management</h3>
      </header>

      <div className="products-header">
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
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
        <button onClick={() => setIsModalOpen(true)} className="add-button">
          Add Product
        </button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Purchases</th>
            <th>Sales</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr key={product.id}>
              <td>
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-image" />
                ) : (
                  'No Image'
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>{product.purchasesAmount}</td>
              <td>{product.salesAmount}</td>
              <td>
                <button onClick={() => editProduct(product)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => deleteProduct(product.id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Image:</label>
                <input type="file" name="image" onChange={handleFileChange} />
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input type="text" name="name" value={product.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input type="number" name="price" value={product.price} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input type="text" name="category" value={product.category} onChange={handleChange} />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">
        {filteredProducts.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </footer>
    </main>
  );
};

export default Products;
