import React from 'react';
import Link from 'next/link';

const FooterNav: React.FC = () => {
  return (
    <div className="flex justify-around items-center py-4 border-t fixed bottom-0 w-full bg-white">
      <Link href="/" className="text-xl">
        🏠
      </Link>
      <Link href="/carts" className="text-xl">
        🛒
      </Link>
    </div>
  );
};

export default FooterNav;