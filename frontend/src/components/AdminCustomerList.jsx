import React from "react";
import { formatPrice } from "../utils/formatPrice";

const AdminCustomerList = ({ orders }) => {
  // Extract unique customers from orders
  const customersMap = orders.reduce((acc, order) => {
    // We use phone number as a unique identifier for customers here
    const phone = order.phoneNumber;
    if (!phone) return acc;

    if (!acc[phone]) {
      acc[phone] = {
        phone: phone,
        name: order.shippingAddress?.street || "Unknown",
        orderCount: 0,
        totalSpent: 0,
        lastOrderDate: order.createdAt,
      };
    }
    acc[phone].orderCount += 1;
    if (order.paymentStatus === "completed" || order.status !== "cancelled") {
      acc[phone].totalSpent += order.totalAmount;
    }
    // Update last order date if this order is more recent
    if (new Date(order.createdAt) > new Date(acc[phone].lastOrderDate)) {
      acc[phone].lastOrderDate = order.createdAt;
    }

    return acc;
  }, {});

  const customers = Object.values(customersMap).sort(
    (a, b) => b.totalSpent - a.totalSpent // Sort by highest spenders
  );

  return (
    <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Top Customers ({customers.length})</h2>
      </div>
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs sticky top-0 shadow-sm">
            <tr>
              <th className="px-6 py-4">Customer Details</th>
              <th className="px-6 py-4 text-center">Orders</th>
              <th className="px-6 py-4">Total Spent</th>
              <th className="px-6 py-4">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.length > 0 ? (
              customers.map((customer, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-xs text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold">
                      {customer.orderCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    {formatPrice(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(customer.lastOrderDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No customers found yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminCustomerList;
