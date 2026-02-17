import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import NoData from '../Components/NoData'
import { useGlobalContext } from '../Proveider/GlobalProvider'



const Myorders = () => {
  const { fetchOrder } = useGlobalContext()
  const order = useSelector(state => state.orders.order)

  useEffect(() => {
    fetchOrder()
  }, [])

  console.log("order item", order)
  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4">

      {/* Header */}
      <div className="bg-white shadow-sm rounded-md p-3 sm:p-4 mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg sm:text-xl">My Orders</h2>
      </div>

      {/* No Orders */}
      {!order?.length && (
        <div className="mt-10">
          <NoData />
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {order.map((item, index) => (
          <div
            key={item._id + index}
            className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm"
          >
            {/* Order Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <p className="text-sm text-gray-600">
                Order No: <span className="font-medium text-gray-800">{item.orderId}</span>
              </p>
              <p className="text-sm font-semibold text-green-600">
                ₹{item.totalAmt}
              </p>
            </div>

            {/* Product */}
            <div className="flex items-center gap-3">
              <img
                src={item.product_details.image}
                alt={item.product_details.name}
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded border"
              />

              <div>
                <p className="font-medium text-sm sm:text-base">
                  {item.product_details.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Payment: {item.payment_status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Myorders