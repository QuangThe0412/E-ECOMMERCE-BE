export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
}

export interface CreateOrderDTO {
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateOrderStatusDTO {
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}
