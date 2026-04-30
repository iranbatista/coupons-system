import { ValidationContext } from './coupon-rule.interface';
import { MinimumValueRule } from './minimum-value.rule';

const makeContext = (
  overrides?: Partial<ValidationContext>,
): ValidationContext => ({
  cartTotal: 100,
  userId: 'user-1',
  currentDate: new Date(),
  previousUsages: [],
  ...overrides,
});

describe('MinimumValueRule', () => {
  it('should pass when cart total is equal to minimum value', () => {
    const rule = new MinimumValueRule({ minValue: 100 });
    const result = rule.validate(makeContext({ cartTotal: 100 }));
    expect(result.valid).toBe(true);
  });

  it('should pass when cart total is above minimum value', () => {
    const rule = new MinimumValueRule({ minValue: 100 });
    const result = rule.validate(makeContext({ cartTotal: 200 }));
    expect(result.valid).toBe(true);
  });

  it('should fail when cart total is below minimum value', () => {
    const rule = new MinimumValueRule({ minValue: 100 });
    const result = rule.validate(makeContext({ cartTotal: 50 }));
    expect(result.valid).toBe(false);
    expect(result.reason).toBeDefined();
  });
});
