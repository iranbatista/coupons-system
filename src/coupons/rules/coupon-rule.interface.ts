export interface ValidationContext {
  cartTotal: number;
  userId: string;
  currentDate: Date;
  previousUsages: { userId: string }[];
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export interface CouponRule {
  validate(context: ValidationContext): ValidationResult;
}
