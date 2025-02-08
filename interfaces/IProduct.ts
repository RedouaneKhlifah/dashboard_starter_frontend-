interface IProduct {
    id: number;
    name: string;
    sku: string;
    unit: string;
    sale_price: number;
    cost_price: number;
    description: string;
    tax: number;
    image: string;
    stock: number;
    reorder_point: number;
  }
  
  export type { IProduct };
  