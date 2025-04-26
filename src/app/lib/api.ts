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
    const response = await axios.get('http://localhost:3000/api/products', {
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