export interface Category {
  Id: number;
  Name: string;
  Description?: string | null;
  Image?: string | null;
  DisplayOrder?: number | null;
  IsActive?: boolean | null;
  CreatedAt?: Date | null;
  UpdatedAt?: Date | null;
  SubCategories?: SubCategory[];
}

export interface SubCategory {
  Id: number;
  Name: string;
  Description?: string | null;
  Image?: string | null;
  CategoryId: number;
  DisplayOrder?: number | null;
  IsActive?: boolean | null;
  CreatedAt?: Date | null;
  UpdatedAt?: Date | null;
  Category?: Category;
  Products?: Product[];
}

export interface Product {
  Id: number;
  Name: string;
  Description?: string | null;
  Image?: string | null;
  Price: number;
  OriginalPrice?: number | null;
  Stock: number;
  Rating?: number | null;
  Reviews?: number | null;
  Colors?: string | null;
  Sizes?: string | null;
  SubCategoryId: number;
  SubCategory?: SubCategory;
}

export interface CreateCategoryDTO {
  Name: string;
  Description?: string;
  Image?: string;
  DisplayOrder?: number;
}

export interface UpdateCategoryDTO {
  Name?: string;
  Description?: string;
  Image?: string;
  DisplayOrder?: number;
  IsActive?: boolean;
}

export interface CreateSubCategoryDTO {
  Name: string;
  CategoryId: number;
  Description?: string;
  Image?: string;
  DisplayOrder?: number;
}

export interface UpdateSubCategoryDTO {
  Name?: string;
  Description?: string;
  Image?: string;
  DisplayOrder?: number;
  IsActive?: boolean;
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
