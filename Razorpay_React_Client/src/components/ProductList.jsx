import Product from './Product';
import { useState } from 'react';

const ProductList = ({ products = [] }) => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {products?.length > 0 &&
        products?.map((product) => (
          <Product
            key={product.id}
            product={product}
            loading={loading}
            setLoading={setLoading}
          />
        ))}
    </div>
  );
};

export default ProductList;
