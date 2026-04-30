import { ValidationContext } from './coupon-rule.interface';
import { SingleUseRule } from './single-use.rule';

const makeContext = (
  overrides?: Partial<ValidationContext>,
): ValidationContext => ({
  cartTotal: 100,
  userId: 'user-1',
  currentDate: new Date(),
  previousUsages: [],
  ...overrides,
});

describe('SingleUseRule', () => {
  it('should pass when there is no previous usage for the user', () => {
    const rule = new SingleUseRule();
    const result = rule.validate(
      makeContext({ userId: 'user-1', previousUsages: [] }),
    );
    expect(result.valid).toBe(true);
  });

  it('should fail when there is a previous usage for the user', () => {
    const rule = new SingleUseRule();
    const result = rule.validate(
      makeContext({ userId: 'user-1', previousUsages: [{ userId: 'user-1' }] }),
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it('should pass when previous usage is from a different user', () => {
    const rule = new SingleUseRule();
    const result = rule.validate(
      makeContext({ userId: 'user-1', previousUsages: [{ userId: 'user-2' }] }),
    );
    expect(result.valid).toBe(true);
  });
});
