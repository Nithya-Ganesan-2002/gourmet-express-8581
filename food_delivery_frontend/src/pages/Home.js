import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <h2>Welcome to Gourmet Express</h2>
        <p>Browse restaurants and get your favorite meals delivered fast.</p>
        <Link className="btn" to="/restaurants">Find Restaurants</Link>
      </div>
    </div>
  );
}
