import { CouponRuleFactory } from './coupon-rule.factory';
import { ExpirationRule } from './rules/expiration.rule';
import { MinimumValueRule } from './rules/minimum-value.rule';
import { SingleUseRule } from './rules/single-use.rule';

describe('CouponRuleFactory', () => {
  let factory: CouponRuleFactory;

  beforeEach(() => {
    factory = new CouponRuleFactory();
  });

  it('should build a MinimumValueRule', () => {
    const rules = factory.build([
      { type: 'MINIMUM_VALUE', config: JSON.stringify({ minValue: 100 }) },
    ]);
    expect(rules[0]).toBeInstanceOf(MinimumValueRule);
  });

  it('should build a ExpirationRule', () => {
    const rules = factory.build([
      { type: 'EXPIRATION', config: JSON.stringify({ expDate: '2030-12-31' }) },
    ]);
    expect(rules[0]).toBeInstanceOf(ExpirationRule);
  });

  it('should build a SingleUseRule', () => {
    const rules = factory.build([
      { type: 'SINGLE_USE', config: JSON.stringify({}) },
    ]);
    expect(rules[0]).toBeInstanceOf(SingleUseRule);
  });

  it('should build multiple rules', () => {
    const rules = factory.build([
      { type: 'MINIMUM_VALUE', config: JSON.stringify({ minValue: 100 }) },
      { type: 'EXPIRATION', config: JSON.stringify({ expDate: '2030-12-31' }) },
      { type: 'SINGLE_USE', config: JSON.stringify({}) },
    ]);
    expect(rules).toHaveLength(3);
  });

  it('should throw when rule type is unknown', () => {
    expect(() =>
      factory.build([{ type: 'UNKNOWN_RULE', config: JSON.stringify({}) }]),
    ).toThrow('Tipo de regra desconhecido: UNKNOWN_RULE');
  });
});
