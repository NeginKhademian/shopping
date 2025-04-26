import { fetchProducts, Product } from 'app/lib/api';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import ProductsList from 'app/components/products/ProductList'
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const queryClient = new QueryClient();

  const searchQuery =  searchParams?.search || '';

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['products', searchQuery],
    queryFn: async ({ pageParam = 1 }) =>
      fetchProducts(pageParam, 10, searchQuery),
    initialPageParam: 1,
  });

  const dehydratedState = dehydrate(queryClient);

  const cookieStore = await cookies();
  const basketCookie = cookieStore.get('basket')?.value || '[]';
  const initialBasket = JSON.parse(basketCookie);

  const data = queryClient.getQueryData(['products', searchQuery]) as
    | { pages: { items: Product[] }[] }
    | undefined;
  const initialProducts = data?.pages?.[0]?.items || [];

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductsList
        initialProducts={initialProducts}
        initialBasket={initialBasket}
        searchQuery={searchQuery}
      />
    </HydrationBoundary>
  );
}
