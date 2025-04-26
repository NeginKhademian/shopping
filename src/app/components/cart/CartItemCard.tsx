'use client';
import React from 'react';
import { CartItem } from './types';

interface Props {
  item: CartItem;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove }: Props) {
  return (
    <div className="mb-4 border rounded p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold">{item.name}</div>
          <div>Unit Price: ${item.price}</div>
          <div>Total: ${item.price * item.quantity}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-2 bg-gray-200 rounded hover:bg-gray-300">➖</button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-2 bg-gray-200 rounded hover:bg-gray-300">➕</button>
          <button onClick={() => onRemove(item.id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">🗑️</button>
        </div>
      </div>
    </div>
  );
}
