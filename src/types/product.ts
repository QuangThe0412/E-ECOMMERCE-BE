export interface Product {
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
}

export interface CreateProductDTO {
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
}

export interface UpdateProductDTO {
  Name?: string;
  Description?: string;
  Image?: string;
  Category?: string;
  Price?: number;
  OriginalPrice?: number;
  Stock?: number;
  Rating?: number;
  Reviews?: number;
  Colors?: string;
  Sizes?: string;
}
