import { Injectable } from '@nestjs/common';
import { CouponRule } from './rules/coupon-rule.interface';
import { ruleRegistry } from './rules/rule-registry';

type RuleConstructor = new (config?: unknown) => CouponRule;

@Injectable()
export class CouponRuleFactory {
  build(rules: { type: string; config: string }[]): CouponRule[] {
    return rules.map((rule) => {
      const Handler = ruleRegistry[rule.type] as RuleConstructor | undefined;

      if (!Handler) {
        throw new Error(`Tipo de regra desconhecido: ${rule.type}`);
      }

      return new Handler(JSON.parse(rule.config));
    });
  }
}
