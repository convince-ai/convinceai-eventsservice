/**
 * hotmart-abandoned-cart-webhook-schema
 */
export interface HotmartAbandonedCartPayload {
  _id?: string;
  creation_date: number;
  data: Data;
  event: string;
  id: string;
  version: string;
  [property: string]: any;
}

export interface Data {
  affiliate: boolean;
  buyer: Buyer;
  buyer_ip: string;
  checkout_country: CheckoutCountry;
  offer: Offer;
  product: Product;
  [property: string]: any;
}

export interface Buyer {
  email: string;
  name: string;
  phone: string;
  [property: string]: any;
}

export interface CheckoutCountry {
  iso: string;
  name: string;
  [property: string]: any;
}

export interface Offer {
  code: string;
  [property: string]: any;
}

export interface Product {
  id: number;
  name: string;
  [property: string]: any;
}
