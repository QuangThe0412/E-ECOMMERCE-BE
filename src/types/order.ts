export interface Order {
  Id: number;
  CustomerId: number;
  CreatedAt: Date;
  Total: number;
  Status: string;
  PaymentMethod?: string;
  Notes?: string;
}

export interface OrderItem {
  Id: number;
  OrderId: number;
  ProductId: number;
  Quantity: number;
  Price: number;
}

export interface OrderWithItems extends Order {
  Items?: OrderItem[];
  CustomerName?: string;
}

export interface CreateOrderDTO {
  CustomerId: number;
  Total: number;
  Status?: string;
  PaymentMethod?: string;
  Notes?: string;
  Items: {
    ProductId: number;
    Quantity: number;
    Price: number;
  }[];
}

export interface UpdateOrderDTO {
  Status?: string;
  PaymentMethod?: string;
  Notes?: string;
}

export interface UpdateOrderStatusDTO {
  Status: 'pending' | 'processing' | 'completed' | 'cancelled';
}
