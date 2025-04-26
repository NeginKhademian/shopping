'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { fetchProducts, Product } from 'app/lib/api';
import ProductCard from './ProductCard';
const PAGE_LIMIT = 10;

export default function ProductsList({
    initialProducts,
    initialBasket,
    searchQuery,
}: {
    initialProducts: Product[];
    initialBasket: Product[];
    searchQuery: string;
}) {
    const queryClient = useQueryClient();
    const basketRef = useRef(initialBasket || []);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['products', searchQuery],
        queryFn: async ({ pageParam = 1 }) =>
            fetchProducts(pageParam, PAGE_LIMIT, searchQuery),
        initialPageParam: 2,
        initialData: {
            pages: [initialProducts],
            pageParams: [1],
        },
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === PAGE_LIMIT ? allPages.length + 1 : undefined,
    });

    const products = data?.pages.flat() || [];

    const addToBasket = useCallback((product: Product) => {
        const existingProduct = basketRef.current.find((item) => item.id === product.id);

        if (existingProduct) {
            basketRef.current = basketRef.current.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            basketRef.current = [...basketRef.current, { ...product, quantity: 1 }];
        }

        Cookies.set('basket', JSON.stringify(basketRef.current));

        queryClient.setQueryData(['products', searchQuery], (oldData: { pages: Product[][] }) => {
            if (!oldData) return oldData;

            const updatedPages = oldData.pages.map((page) =>
                page.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
            );

            return {
                ...oldData,
                pages: updatedPages,
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const removeFromBasket = useCallback((product: Product) => {
        basketRef.current = basketRef.current.filter((item) => item.id !== product.id);
        Cookies.set('basket', JSON.stringify(basketRef.current));

        queryClient.setQueryData(['products', searchQuery], (oldData: { pages: Product[][] }) => {
            if (!oldData) return oldData;

            const updatedPages = oldData.pages.map((page) =>
                page.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );

            return {
                ...oldData,
                pages: updatedPages,
            };
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100
        ) {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasNextPage, isFetchingNextPage]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => {
                const inBasket = basketRef.current.some((item) => item.id === product.id);

                return (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToBasket={() => {
                            addToBasket(product);
                        }}
                        onRemoveFromBasket={() => removeFromBasket(product)}
                        inBasket={inBasket}
                    />
                );
            })}
            {isFetchingNextPage && <p>Loading more products...</p>}
        </div>
    );
}
