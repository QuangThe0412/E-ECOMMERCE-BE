export interface Product {
  Id: number;
  Name: string;
  Description?: string | null;
  Image?: string | null;
  Price: number;
  OriginalPrice?: number | null;
  Stock: number;
  Colors?: string | null;
  Sizes?: string | null;
  SubCategoryId: number;
  SubCategory?: any;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface CreateProductDTO {
  Name: string;
  Description?: string;
  Image?: string;
  Price: number;
  OriginalPrice?: number;
  Stock: number;
  SubCategoryId: number;
  Colors?: string;
  Sizes?: string;
}

export interface UpdateProductDTO {
  Name?: string;
  Description?: string;
  Image?: string;
  Price?: number;
  OriginalPrice?: number;
  Stock?: number;
  SubCategoryId?: number;
  Colors?: string;
  Sizes?: string;
}
