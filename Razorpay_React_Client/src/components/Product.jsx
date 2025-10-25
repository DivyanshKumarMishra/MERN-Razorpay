import { ORDER_URL, RAZORPAY_KEY, VERIFY_PAYMENT_URL } from '../constants';

const Product = ({ product, loading = false, setLoading = () => {} }) => {
  const paymentHandler = async (e) => {
    try {
      setLoading(true);
      const host = import.meta.env.VITE_SERVER_URL;

      // creating razorpay order
      const res = await fetch(`${host}${ORDER_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: product.price,
          currency: 'INR',
          receipt: `receipt - ${Date.now()}`,
          description: `Purchased ${product.name}`,
        }),
      });

      if (!res.ok || res.status !== 201) {
        console.log(res.error);
        throw new Error(res.error);
      }

      const result = await res.json();

      const { id: order_id, amount, currency, notes } = result.data;

      let order = {
        razorpay_order_id: order_id,
        amount,
        currency,
        notes,
      };

      let payment = {
        order_id,
      };

      // opening razorpay payment window
      var options = {
        key: RAZORPAY_KEY,
        amount: amount,
        currency: currency,
        name: 'Divyansh Business', //your business name
        description: notes?.description || '',
        image: 'https://example.com/your_logo',
        order_id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;
          payment = {
            ...payment,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          };

          const verification_res = await fetch(`${host}${VERIFY_PAYMENT_URL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              order_id,
              razorpay_payment_id,
              razorpay_signature,
            }),
          });

          if(!verification_res.ok || verification_res.status !== 200) {
            console.log(verification_res.error);
            throw new Error(verification_res.error);
          }

          const result = await verification_res.json();
          console.log(result);
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
      paymentObject.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });

      paymentObject.open();
      e.preventDefault();
    } catch (error) {
      console.log(error);
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
