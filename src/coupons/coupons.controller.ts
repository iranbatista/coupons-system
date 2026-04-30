import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import type { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Post('apply')
  @UseGuards(AuthGuard)
  apply(@Body() dto: ApplyCouponDto, @CurrentUser() user: AuthenticatedUser) {
    return this.couponsService.apply(dto.code, dto.cartTotal, user.id);
  }
}
