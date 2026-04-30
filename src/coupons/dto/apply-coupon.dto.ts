import { IsNumber, IsPositive, IsString } from 'class-validator';

export class ApplyCouponDto {
  @IsString({ message: 'O código do cupom deve ser uma string.' })
  code: string;

  @IsNumber({}, { message: 'O total do carrinho deve ser um número.' })
  @IsPositive({ message: 'O total do carrinho deve ser maior que zero.' })
  cartTotal: number;
}
