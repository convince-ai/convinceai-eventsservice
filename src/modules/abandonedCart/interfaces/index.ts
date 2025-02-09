export type HotmartBuyer = {
  phone: string;
  email: string;
  name: string;
};

export type HotmartProduct = {
  id: string;
  name: string;
};

export type AbandonedEventsByRegion = {
  abandonedCarts: number;
  state: string;
  ddd: string;
};

export type AbandonedProducts = {
  name: string;
  value: number;
};
