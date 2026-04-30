import { CouponRuleFactory } from './coupon-rule.factory';
import { CouponValidationService } from './coupon-validation.service';
import { ValidationContext } from './rules/coupon-rule.interface';

describe('CouponValidationService', () => {
  let service: CouponValidationService;

  beforeEach(() => {
    service = new CouponValidationService(new CouponRuleFactory());
  });

  const makeRules = (overrides?: { type: string; config: string }) => [
    { type: 'MINIMUM_VALUE', config: JSON.stringify({ minValue: 100 }) },
    { type: 'EXPIRATION', config: JSON.stringify({ expDate: '2030-12-31' }) },
    { type: 'SINGLE_USE', config: JSON.stringify({}) },
    ...(overrides ? [overrides] : []),
  ];

  const makeContext = (
    overrides?: Partial<ValidationContext>,
  ): ValidationContext => ({
    cartTotal: 100,
    userId: 'user-1',
    currentDate: new Date(),
    previousUsages: [],
    ...overrides,
  });

  it('should pass when all rules are satisfied', () => {
    const result = service.validate(makeRules(), makeContext());
    expect(result.valid).toBe(true);
  });

  it('should fail when cart total is below minimum value', () => {
    const result = service.validate(
      makeRules(),
      makeContext({ cartTotal: 50 }),
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it('should fail when coupon is expired', () => {
    const rules = [
      { type: 'EXPIRATION', config: JSON.stringify({ expDate: '2020-01-01' }) },
    ];
    const result = service.validate(rules, makeContext());
    expect(result.valid).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it('should fail when user has already used the coupon', () => {
    const result = service.validate(
      makeRules(),
      makeContext({ previousUsages: [{ userId: 'user-1' }] }),
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it('should fail on first invalid rule and not continue', () => {
    const result = service.validate(
      makeRules(),
      makeContext({ cartTotal: 50, previousUsages: [{ userId: 'user-1' }] }),
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('mínimo');
  });
});
