import { Injectable } from '@nestjs/common';
import { CouponRuleFactory } from './coupon-rule.factory';
import { ValidationContext } from './rules/coupon-rule.interface';

@Injectable()
export class CouponValidationService {
  constructor(private readonly ruleFactory: CouponRuleFactory) {}

  validate(
    rules: { type: string; config: string }[],
    context: ValidationContext,
  ) {
    const instances = this.ruleFactory.build(rules);

    for (const rule of instances) {
      const result = rule.validate(context);

      if (!result.valid) {
        return result;
      }
    }

    return { valid: true };
  }
}
