import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { CouponRuleFactory } from './coupon-rule.factory';
import { CouponValidationService } from './coupon-validation.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CouponsService, CouponRuleFactory, CouponValidationService],
  controllers: [CouponsController],
})
export class CouponsModule {}
