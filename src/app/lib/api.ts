import axios from 'axios';

export type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  photo: string;
};

export const fetchProducts = async (
  page: number,
  limit: number,
  searchQuery: string = ''
): Promise<Product[]> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
    const response = await axios.get(`${baseURL}/products`, {
      params: {
        page,
        limit,
        search: searchQuery,
      },
    });

    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};