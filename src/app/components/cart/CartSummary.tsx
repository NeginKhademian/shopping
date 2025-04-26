'use client';
import React from 'react';

interface Props {
  totalItems: number;
  totalAmount: number;
  onClear: () => void;
}

export default function CartSummary({ totalItems, totalAmount, onClear }: Props) {
  return (
    <div className="flex justify-between items-center mt-4">
      <div>
        <div>Total Items: {totalItems}</div>
        <div>Total Amount: ${totalAmount.toFixed(2)}</div>
      </div>
      <button onClick={onClear} className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100">
        Empty Cart
      </button>
    </div>
  );
}
