import {
  CouponRule,
  ValidationContext,
  ValidationResult,
} from './coupon-rule.interface';

export class SingleUseRule implements CouponRule {
  validate(context: ValidationContext): ValidationResult {
    const alreadyUsed = context.previousUsages.some(
      ({ userId }) => userId === context.userId,
    );

    if (alreadyUsed) {
      return {
        valid: false,
        reason: 'Cupom já utilizado por este usuário',
      };
    }

    return { valid: true };
  }
}
