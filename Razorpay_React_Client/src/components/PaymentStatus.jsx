import React from 'react';
import { useLocation } from 'react-router-dom';

function PaymentStatus() {
  const location = useLocation();
  console.log(location)
  
  return (
    <main className="h-screen w-screen flex flex-col gap-10 items-center">
      <h1 className="text-6xl text-blue-600 font-bold mt-5 text-center">
        Payment Status
      </h1>
    </main>
  );
}

export default PaymentStatus;
