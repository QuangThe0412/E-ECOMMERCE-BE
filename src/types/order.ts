export interface Order {
  Id: number;
  UserId: string; // UNIQUEIDENTIFIER
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
  UserName?: string;
}

export interface CreateOrderDTO {
  UserId: string; // UNIQUEIDENTIFIER
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
