'use client';

import React, { useState } from 'react';
import { Product } from 'app/lib/api';
import Image from 'next/image';

const fallbackImage = '/globe.svg';

const ProductCard = React.memo(function ProductCard({
    product,
    onAddToBasket,
    onRemoveFromBasket,
    inBasket,
}: {
    product: Product;
    onAddToBasket: () => void;
    onRemoveFromBasket: () => void;
    inBasket: boolean;
}) {
    const [imgSrc, setImgSrc] = useState(product.photo);

    return (
        <div className="border rounded-lg shadow-md bg-white p-4 flex flex-col justify-between h-full">
            <Image
                src={imgSrc||fallbackImage}
                alt={product?.name || "fallback"}
                width={100}
                height={100}
                className="rounded-md object-cover w-full"
                loading="lazy"
                onError={() => setImgSrc(fallbackImage)}
            />

            <h2 className="text-lg font-bold mt-2">{product.name}</h2>
            <p className="text-gray-700">${product.price}</p>

            <div className="mt-4 flex items-center justify-between">
                <button
                    onClick={onAddToBasket}
                    className="p-2 rounded transition bg-blue-500 text-white hover:bg-blue-600"
                >
                    Add to Basket
                </button>

                {inBasket && (
                    <button
                        onClick={onRemoveFromBasket}
                        className="text-red-500 text-lg hover:text-red-600 transition"
                        title="Remove from basket"
                    >
                        🗑️
                    </button>
                )}
            </div>
        </div>
    );
});

export default ProductCard;
