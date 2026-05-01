import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CouponValidationService } from './coupon-validation.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couponValidation: CouponValidationService,
  ) {}

  async create(dto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: {
        code: dto.code,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        rules: {
          create: dto.rules.map((rule) => ({
            type: rule.type,
            config: JSON.stringify(rule.config),
          })),
        },
      },
      include: { rules: true },
    });
  }

  async findAll() {
    return this.prisma.coupon.findMany({ include: { rules: true } });
  }

  async findByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
      include: { rules: true, usages: true },
    });

    if (!coupon) throw new NotFoundException('Cupom não encontrado');
    if (!coupon.isActive) throw new BadRequestException('Cupon inativo');

    return coupon;
  }

  async apply(code: string, cartTotal: number, userId: string) {
    const coupon = await this.findByCode(code);

    const result = this.couponValidation.validate(coupon.rules, {
      cartTotal,
      userId,
      currentDate: new Date(),
      previousUsages: coupon.usages,
    });

    if (!result.valid) {
      throw new BadRequestException(result.reason);
    }

    await this.prisma.couponUsage.create({
      data: { couponId: coupon.id, userId },
    });

    const discount =
      coupon.discountType === 'FIXED'
        ? coupon.discountValue
        : (cartTotal * coupon.discountValue) / 100;

    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      originalTotal: cartTotal,
      discount,
      finalTotal: cartTotal - discount,
    };
  }
}
