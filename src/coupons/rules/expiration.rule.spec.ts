import { ValidationContext } from './coupon-rule.interface';
import { ExpirationRule } from './expiration.rule';

const makeContext = (
  overrides?: Partial<ValidationContext>,
): ValidationContext => ({
  cartTotal: 100,
  userId: 'user-1',
  currentDate: new Date(),
  previousUsages: [],
  ...overrides,
});

describe('ExpirationRule', () => {
  it('should pass when current date is before expiration date', () => {
    const rule = new ExpirationRule({ expDate: '2030-12-25' });
    const result = rule.validate(
      makeContext({ currentDate: new Date(2026, 0, 1) }),
    );
    expect(result.valid).toBe(true);
  });

  it('should pass when current date is the same as expiration date', () => {
    const rule = new ExpirationRule({ expDate: '2026-01-01' });
    const result = rule.validate(
      makeContext({ currentDate: new Date(2026, 0, 1) }),
    );
    expect(result.valid).toBe(true);
  });

  it('should fail when current date is after expiration date', () => {
    const rule = new ExpirationRule({ expDate: '2020-01-01' });
    const result = rule.validate(
      makeContext({ currentDate: new Date(2026, 0, 1) }),
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toBeDefined();
  });
});
