import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  productid: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/product/getAllProducts', {
        params: {
          search: search,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div style={{ background: "url('/static/img/2pizza.jpeg') no-repeat center center fixed", backgroundSize: 'cover', display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg bg-transparent navbar-dark navbar fixed-top">
        <a className="navbar-brand" href="/"> <img src="/static/img/pizza-loggo.png" style={{ height: '32px' }} alt=""/> </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-collapse home" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/logout">
                <span style={{ color: 'white', fontSize: '1.3rem' }}>Log-Out</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ marginTop: '7%', textAlign: 'center', border: '2px solid rgba(255, 255, 255, .3)', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '15px', boxShadow: '0 4px 30px rgba(0, 0, 0, .3)', backdropFilter: 'invert(1)', padding: '20px', width: '80%', fontSize: '1.5em' }}>
        <h2>Product List</h2>

        <form method="GET" action="">
          <div className="input-group mb-3">
            <input type="text" name="search" className="form-control" placeholder="Search by First or Last Name" aria-label="Search" aria-describedby="button-search" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-outline-secondary" type="submit" id="button-search">Search</button>
          </div>
        </form>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', border: '2px solid black', backgroundColor: 'white' }}>
          <thead style={{ backgroundColor: '#f2f2f2' }}>
            <tr>
              <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Product ID</th>
              <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Product Name</th>
              <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productid}>
                <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{product.productid}</td>
                <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{product.name}</td>
                <td style={{ border: '1px solid black', padding: '10px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
