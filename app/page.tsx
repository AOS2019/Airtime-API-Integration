// File: app/page.tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

const AirtimeForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('');
  const [amount, setAmount] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('https://iabconcept.com/api/airtimeapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': `Bearer ${process.env.AIRTIME_API_KEY}`,
          'secret-key': `Bearer ${process.env.AIRTIME_SECRET_KEY}`,
        },
        body: JSON.stringify({ phoneNumber, network, amount }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      return res.json();
    },
  });
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side validation.
    if (!phoneNumber || !network || !amount) {
      alert('Please fill in all fields');
      return;
    }
    // Proceed with form submission.
    mutation.mutate();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Airtime Purchase</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter phone number"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="network" className="block text-gray-700 mb-2">
            Network
          </label>
          <select
            id="network"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select network</option>
            <option value="MTN">MTN</option>
            <option value="Airtel">Airtel</option>
            <option value="Glo">Glo</option>
            <option value="9mobile">9mobile</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter amount"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {mutation.isLoading ? 'Processing...' : 'Purchase Airtime'}
        </button>
      </form>
      {mutation.isSuccess && (
        <p className="mt-4 text-green-500">
          Airtime purchase successful!
        </p>
      )}
      {mutation.isError && (
        <p className="mt-4 text-red-500">
          Error:{' '}
          {mutation.error instanceof Error
            ? mutation.error.message
            : 'An error occurred'}
        </p>
      )}
    </div>
  );
};

export default AirtimeForm;
