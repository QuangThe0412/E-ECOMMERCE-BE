export interface ValidationError {
  field: string;
  message: string;
}

export class Validator {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isRequired(value: any): boolean {
    return value !== undefined && value !== null && value !== '';
  }

  static minLength(value: string, min: number): boolean {
    return value.length >= min;
  }

  static maxLength(value: string, max: number): boolean {
    return value.length <= max;
  }

  static isNumber(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  static isPositive(value: number): boolean {
    return value > 0;
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static isValidStatus(status: string, validStatuses: string[]): boolean {
    return validStatuses.includes(status);
  }
}

export class UserValidator {
  static validateCreateUser(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!Validator.isRequired(data.email)) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!Validator.isEmail(data.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (!Validator.isRequired(data.name)) {
      errors.push({ field: 'name', message: 'Name is required' });
    } else if (!Validator.minLength(data.name, 2)) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
    }

    if (!Validator.isRequired(data.password)) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else if (!Validator.minLength(data.password, 6)) {
      errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    }

    return errors;
  }

  static validateUpdateUser(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (data.email && !Validator.isEmail(data.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (data.name && !Validator.minLength(data.name, 2)) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
    }

    return errors;
  }
}

export class ProductValidator {
  static validateCreateProduct(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!Validator.isRequired(data.name)) {
      errors.push({ field: 'name', message: 'Product name is required' });
    }

    if (!Validator.isRequired(data.price)) {
      errors.push({ field: 'price', message: 'Price is required' });
    } else if (!Validator.isNumber(data.price)) {
      errors.push({ field: 'price', message: 'Price must be a number' });
    } else if (!Validator.isPositive(data.price)) {
      errors.push({ field: 'price', message: 'Price must be positive' });
    }

    if (!Validator.isRequired(data.stock)) {
      errors.push({ field: 'stock', message: 'Stock is required' });
    } else if (!Validator.isNumber(data.stock)) {
      errors.push({ field: 'stock', message: 'Stock must be a number' });
    } else if (data.stock < 0) {
      errors.push({ field: 'stock', message: 'Stock cannot be negative' });
    }

    return errors;
  }

  static validateUpdateProduct(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (data.price !== undefined) {
      if (!Validator.isNumber(data.price)) {
        errors.push({ field: 'price', message: 'Price must be a number' });
      } else if (!Validator.isPositive(data.price)) {
        errors.push({ field: 'price', message: 'Price must be positive' });
      }
    }

    if (data.stock !== undefined) {
      if (!Validator.isNumber(data.stock)) {
        errors.push({ field: 'stock', message: 'Stock must be a number' });
      } else if (data.stock < 0) {
        errors.push({ field: 'stock', message: 'Stock cannot be negative' });
      }
    }

    return errors;
  }
}

export class OrderValidator {
  static validateCreateOrder(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!Validator.isRequired(data.userId)) {
      errors.push({ field: 'userId', message: 'User ID is required' });
    }

    if (!Validator.isRequired(data.totalAmount)) {
      errors.push({ field: 'totalAmount', message: 'Total amount is required' });
    } else if (!Validator.isNumber(data.totalAmount)) {
      errors.push({ field: 'totalAmount', message: 'Total amount must be a number' });
    } else if (!Validator.isPositive(data.totalAmount)) {
      errors.push({ field: 'totalAmount', message: 'Total amount must be positive' });
    }

    return errors;
  }

  static validateUpdateOrderStatus(status: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];

    if (!Validator.isRequired(status)) {
      errors.push({ field: 'status', message: 'Status is required' });
    } else if (!Validator.isValidStatus(status, validStatuses)) {
      errors.push({ 
        field: 'status', 
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }

    return errors;
  }
}
