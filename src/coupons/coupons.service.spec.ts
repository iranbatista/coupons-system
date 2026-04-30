import { PrismaService } from 'src/prisma/prisma.service';
import { CouponsService } from './coupons.service';
import { TestingModule, Test } from '@nestjs/testing';
import { CouponValidationService } from './coupon-validation.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockCoupon = {
  id: 'coupon-1',
  code: 'DESCONTO20',
  discountType: 'PERCENTAGE',
  discountValue: 20,
  isActive: true,
  rules: [{ type: 'MINIMUM_VALUE', config: JSON.stringify({ minValue: 100 }) }],
  useges: [],
};

const mockPrisma = {
  coupon: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  couponUsage: {
    create: jest.fn(),
  },
};

const mockValidationService = {
  validate: jest.fn(),
};

describe('CouponsService', () => {
  let service: CouponsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CouponValidationService, useValue: mockValidationService },
      ],
    }).compile();

    service = module.get<CouponsService>(CouponsService);

    jest.clearAllMocks();
  });

  describe('findByCode', () => {
    it('should return coupon when it exists and is active', async () => {
      mockPrisma.coupon.findUnique.mockResolvedValue(mockCoupon);
      const result = await service.findByCode('DESCONTO20');
      expect(result).toEqual(mockCoupon);
    });

    it('should throw NotFoundException when coupon does not exist', async () => {
      mockPrisma.coupon.findUnique.mockResolvedValue(null);
      await expect(service.findByCode('INVALIDO')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when coupon is inactive', async () => {
      mockPrisma.coupon.findUnique.mockResolvedValue({
        ...mockCoupon,
        isActive: false,
      });
      await expect(service.findByCode('DESCONTO20')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('apply', () => {
    it('should apply percentage discount correctly', async () => {
      mockPrisma.coupon.findUnique.mockResolvedValue(mockCoupon);
      mockValidationService.validate.mockReturnValue({ valid: true });
      mockPrisma.couponUsage.create.mockResolvedValue({});

      const result = await service.apply('DESCONTO20', 200, 'user-1');

      expect(result.discount).toBe(40);
      expect(result.finalTotal).toBe(160);
    });

    it('should apply fixed discount correctly', async () => {
      mockPrisma.coupon.findUnique.mockResolvedValue({
        ...mockCoupon,
        discountType: 'FIXED',
        discountValue: 30,
      });
      mockValidationService.validate.mockReturnValue({ valid: true });
      mockPrisma.couponUsage.create.mockResolvedValue({});

      const result = await service.apply('DESCONTO20', 200, 'user-1');

      expect(result.discount).toBe(30);
      expect(result.finalTotal).toBe(170);
    });

    it('should throw BadRequestException when validation fails', async () => {
      mockPrisma.coupon.findUnique.mockResolvedValue(mockCoupon);
      mockValidationService.validate.mockReturnValue({
        valid: false,
        reason: 'Cupom expirado',
      });

      await expect(service.apply('DESCONTO20', 200, 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should register usage after successful apply', async () => {
      mockPrisma.coupon.findUnique.mockResolvedValue(mockCoupon);
      mockValidationService.validate.mockReturnValue({ valid: true });
      mockPrisma.couponUsage.create.mockResolvedValue({});

      await service.apply('DESCONTO20', 200, 'user-1');

      expect(mockPrisma.couponUsage.create).toHaveBeenCalledWith({
        data: { couponId: 'coupon-1', userId: 'user-1' },
      });
    });
  });
});
