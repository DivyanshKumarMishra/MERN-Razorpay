import axiosInstance from '../config/axios';
import { ORDER_URL, RAZORPAY_KEY, VERIFY_PAYMENT_URL } from '../constants';

const Product = ({ product, loading = false, setLoading = () => {} }) => {
  const paymentHandler = async (e) => {
    try {
      setLoading(true);

      // creating razorpay order
      const { data: order_data } = await axiosInstance.post(`${ORDER_URL}`, {
        amount: product.price,
        currency: 'INR',
        receipt: `receipt - ${Date.now()}`,
        description: `Purchased ${product.name}`,
        items: [product.name],
      });

      const { razorpay_order_id, amount, currency, notes, _id } = order_data;

      // opening razorpay payment window
      var options = {
        key: RAZORPAY_KEY,
        amount: amount,
        currency: currency,
        name: 'Divyansh Business', //your business name
        description: notes?.description || '',
        image: 'https://example.com/your_logo',
        order_id: razorpay_order_id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_signature } = response;

          const { data: verification_data } = await axiosInstance.post(
            `${VERIFY_PAYMENT_URL}`,
            {
              order: _id,
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            }
          );

          console.log(verification_data);
        },
        prefill: {
          //CUSTOMER DETAILS
          name: 'Vashu Mishra',
          email: 'socialaddict97@gmail.com',
          contact: '8004203435',
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      };

      var paymentObject = new window.Razorpay(options);
      // paymentObject.on('payment.failed', function (response) {
      //   alert(response.error.code);
      //   alert(response.error.description);
      //   alert(response.error.source);
      //   alert(response.error.step);
      //   alert(response.error.reason);
      //   alert(response.error.metadata.order_id);
      //   alert(response.error.metadata.payment_id);
      // });

      paymentObject.open();
      e.preventDefault();
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-500 mt-1">{product.description}</p>
        <p className="mt-2 font-bold text-blue-600">₹{product.price}</p>
        <button
          onClick={paymentHandler}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Product;
