import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // adjust your path

function PaymentStatus() {
  const location = useLocation();
  const initialPayment = location.state;
  const [payment, setPayment] = useState(initialPayment);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!payment?.razorpay_payment_id) return;

    if (payment.status === 'pending') {
      // Poll backend for status updates
      const interval = setInterval(async () => {
        try {
          setLoading(true);
          const { data } = await axiosInstance.get(
            `/payments/status/${payment.razorpay_payment_id}`
          );
          setPayment((prev) => ({ ...prev, status: data.status }));
          if (data.status === 'success' || data.status === 'failed') {
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Error fetching payment status', err);
        } finally {
          setLoading(false);
        }
      }, 2000); 

      return () => clearInterval(interval);
    }
  }, [payment?.razorpay_payment_id, payment?.status]);

  const renderStatus = () => {
    if (loading && payment.status === 'pending') {
      return (
        <p className="text-gray-600 text-lg animate-pulse">
          Checking payment status...
        </p>
      );
    }

    switch (payment.status) {
      case 'pending':
        return (
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-blue-600 text-lg">Payment is being verified...</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-green-600 text-4xl font-bold">✅ Success!</h2>
            <p className="text-gray-600 mt-2">
              Payment captured successfully. Thank you for your purchase.
            </p>
          </div>
        );
      case 'failed':
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-red-600 text-4xl font-bold">❌ Payment Failed</h2>
            <p className="text-gray-600 mt-2">
              Something went wrong. If money was deducted, it’ll be refunded soon.
            </p>
          </div>
        );
      default:
        return (
          <p className="text-gray-600 text-lg">Waiting for payment update...</p>
        );
    }
  };

  return (
    <main className="h-screen w-screen flex flex-col gap-10 justify-center items-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Payment Status
      </h1>
      {renderStatus()}
      {payment?.razorpay_payment_id && (
        <p className="text-gray-500 mt-4">
          Reference ID: <strong>{payment.razorpay_payment_id}</strong>
        </p>
      )}
    </main>
  );
}

export default PaymentStatus;