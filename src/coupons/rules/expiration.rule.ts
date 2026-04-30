import { format, isAfter } from 'date-fns';
import {
  CouponRule,
  ValidationContext,
  ValidationResult,
} from './coupon-rule.interface';
import { parseLocalDate } from 'src/utils/parse-local-date';

interface ExpirationRuleConfig {
  expDate: string;
}

export class ExpirationRule implements CouponRule {
  constructor(private readonly config: ExpirationRuleConfig) {}

  validate(context: ValidationContext): ValidationResult {
    const expDate = parseLocalDate(this.config.expDate);

    if (isAfter(context.currentDate, expDate)) {
      return {
        valid: false,
        reason: `Cupom expirado em ${format(expDate, 'dd/MM/yyyy')}`,
      };
    }

    return { valid: true };
  }
}
