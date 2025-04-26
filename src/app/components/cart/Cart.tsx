'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { CartItem } from './types';
import CartSummary from './CartSummary';
import CartList from './CartList';

export default function Cart() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedData = Cookies.get('basket');
    if (storedData) {
      setCartItems(JSON.parse(storedData));
    }
  }, []);

  const updateCartInCookies = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    Cookies.set('basket', JSON.stringify(updatedCart), { expires: 7 });
  };

  const updateQuantity = (id: number, delta: number) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
    );
    updateCartInCookies(updated);
  };

  const removeItem = (id: number) => {
    const filtered = cartItems.filter(item => item.id !== id);
    updateCartInCookies(filtered);
  };

  const clearCart = () => {
    updateCartInCookies([]);
    Cookies.remove('basket');
  };

  const filteredItems = cartItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery)
  );

  const totalAmount = filteredItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = filteredItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="p-4 max-w-md mx-auto">
      {searchQuery && (
        <p className="mb-4 text-gray-600">
          Showing results for “<span className="italic">{searchQuery}</span>”
        </p>
      )}
      <CartList items={filteredItems} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
      {filteredItems.length > 0 && (
        <CartSummary totalItems={totalItems} totalAmount={totalAmount} onClear={clearCart} />
      )}
    </div>
  );
}
