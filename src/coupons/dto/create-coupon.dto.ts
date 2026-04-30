import {
  IsArray,
  IsEnum,
  IsIn,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DiscountType } from 'src/generated/prisma/client';
import { ruleRegistry } from '../rules/rule-registry';
import type { RuleType } from '../rules/rule-registry';

class CreateCouponRuleDto {
  @IsIn(Object.keys(ruleRegistry), {
    message: `O tipo de regra deve ser um dos valores: ${Object.keys(ruleRegistry).join(', ')}.`,
  })
  type: RuleType;

  @IsObject({ message: 'A configuração da regra deve ser um objeto.' })
  config: Record<string, unknown>;
}

export class CreateCouponDto {
  @IsString({ message: 'O código do cupom deve ser uma string.' })
  code: string;

  @IsEnum(DiscountType, {
    message: `O tipo de desconto deve ser um dos valores: ${Object.values(DiscountType).join(', ')}.`,
  })
  discountType: DiscountType;

  @IsNumber({}, { message: 'O valor do desconto deve ser um número.' })
  @IsPositive({ message: 'O valor do desconto deve ser maior que zero.' })
  discountValue: number;

  @IsArray({ message: 'As regras devem ser uma lista.' })
  @ValidateNested({ each: true })
  @Type(() => CreateCouponRuleDto)
  rules: CreateCouponRuleDto[];
}
