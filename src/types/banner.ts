export interface Banner {
  Id: number;
  Title: string;
  Subtitle?: string;
  Description?: string;
  Image: string;
  ButtonText?: string;
  ButtonLink?: string;
  BackgroundColor?: string;
  IsActive?: boolean;
  DisplayOrder?: number;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface CreateBannerDTO {
  Title: string;
  Subtitle?: string;
  Description?: string;
  Image: string;
  ButtonText?: string;
  ButtonLink?: string;
  BackgroundColor?: string;
  DisplayOrder?: number;
}

export interface UpdateBannerDTO {
  Title?: string;
  Subtitle?: string;
  Description?: string;
  Image?: string;
  ButtonText?: string;
  ButtonLink?: string;
  BackgroundColor?: string;
  IsActive?: boolean;
  DisplayOrder?: number;
}
