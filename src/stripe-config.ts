export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}

export const products: Product[] = [
  {
    id: 'prod_Sswrxuwf4gNlSq',
    priceId: 'price_1RxAxqHmyLOxvZDKcfsIRPvo',
    name: 'UGC',
    description: 'User Generated Content services',
    mode: 'subscription',
    price: 1000.00,
    currency: 'BGN'
  },
  {
    id: 'prod_SsaLk8oKYnXota',
    priceId: 'price_1RwpAyHmyLOxvZDK2FVFhOBS',
    name: 'Дизайн лого',
    description: 'Professional logo design service',
    mode: 'payment',
    price: 100.00,
    currency: 'BGN'
  },
  {
    id: 'prod_SpYKIEmme0Ufri',
    priceId: 'price_1RttDYHmyLOxvZDKFCtXJ144',
    name: 'All-in-one (Годишин план)',
    description: 'Complete annual design package',
    mode: 'subscription',
    price: 22000.00,
    currency: 'BGN'
  },
  {
    id: 'prod_SfdJ0GpehOC3OP',
    priceId: 'price_1RkI3FHmyLOxvZDKjBHMprRK',
    name: 'All in one',
    description: 'Complete design package',
    mode: 'subscription',
    price: 1899.00,
    currency: 'BGN'
  },
  {
    id: 'prod_SfdH4MxVN3Y9oc',
    priceId: 'price_1RkI0yHmyLOxvZDKvA3VMJrr',
    name: 'Web Design',
    description: 'Professional web design services',
    mode: 'subscription',
    price: 1099.00,
    currency: 'BGN'
  },
  {
    id: 'prod_Q5jyuQ3Kqedgtj',
    priceId: 'price_1PFYUZHmyLOxvZDKfU08a04c',
    name: 'Graphic Design',
    description: 'Professional graphic design services',
    mode: 'subscription',
    price: 999.00,
    currency: 'BGN'
  }
];

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};