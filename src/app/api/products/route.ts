import { NextResponse } from 'next/server';

export type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  photo: string;
};

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  for (let i = 1; i <= 50; i++) {
    products.push({
      id: i,
      name: `Title ${i}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: Math.floor(Math.random() * 100) + 20,
      photo: `https://picsum.photos/200?random=${i}`,
    });
  }
  return products;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = (searchParams.get('search') || '').toLowerCase();

  const allProducts = generateProducts();
  const filtered = allProducts.filter(product =>
    product.name.toLowerCase().includes(search)
  );

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    products: paginated,
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit),
  });
}
