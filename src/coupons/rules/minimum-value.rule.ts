import {
  CouponRule,
  ValidationContext,
  ValidationResult,
} from './coupon-rule.interface';

interface MinimumValueConfig {
  minValue: number;
}

export class MinimumValueRule implements CouponRule {
  constructor(private readonly config: MinimumValueConfig) {}

  validate(context: ValidationContext): ValidationResult {
    if (context.cartTotal < this.config.minValue) {
      return {
        valid: false,
        reason: `Valor mínimo para este cupom é R$ ${this.config.minValue}`,
      };
    }

    return { valid: true };
  }
}
