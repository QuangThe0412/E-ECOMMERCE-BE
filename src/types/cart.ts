export interface Cart {
  Id: string;
  UserId: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface CartItem {
  Id: number;
  CartId: string;
  ProductId: number;
  Quantity: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface CartItemWithProduct extends CartItem {
  Products: {
    Id: number;
    Name: string;
    Description?: string;
    Image?: string;
    Category?: string;
    Price: number;
    OriginalPrice?: number;
    Stock: number;
    Rating?: number;
    Reviews?: number;
    Colors?: string;
    Sizes?: string;
  };
}

export interface CartWithItems extends Cart {
  CartItems: CartItemWithProduct[];
  total: number;
  itemCount: number;
}

export interface AddToCartDTO {
  ProductId: number;
  Quantity: number;
}

export interface UpdateCartItemDTO {
  Quantity: number;
}
