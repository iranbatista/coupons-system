import { ExpirationRule } from './expiration.rule';
import { MinimumValueRule } from './minimum-value.rule';
import { SingleUseRule } from './single-use.rule';

export const ruleRegistry = {
  MINIMUM_VALUE: MinimumValueRule,
  EXPIRATION: ExpirationRule,
  SINGLE_USE: SingleUseRule,
} as const;

export type RuleType = keyof typeof ruleRegistry;
