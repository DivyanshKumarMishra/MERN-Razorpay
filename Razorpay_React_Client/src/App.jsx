import Product from './components/Product';
import ProductList from './components/ProductList';
import products from './data/products';

function App() {
  return (
    <main className="h-screen w-screen flex flex-col gap-10 items-center">
      <h1 className="text-6xl text-blue-600 font-bold mt-5 text-center">
        Razorpay Integration
      </h1>
      <ProductList products={products} />
    </main>
  );
}

export default App;
