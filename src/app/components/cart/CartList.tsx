'use client';
import React from 'react';
import CartItemCard from './CartItemCard';
import { CartItem } from './types';
interface Props {
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export default function CartList({ items, onUpdateQuantity, onRemove }: Props) {
  if (items.length === 0) {
    return <p className="text-center text-gray-500">No items found.</p>;
  }

  return (
    <>
      {items.map(item => (
        <CartItemCard key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />
      ))}
    </>
  );
}
