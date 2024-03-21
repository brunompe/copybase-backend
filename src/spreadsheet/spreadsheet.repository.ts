import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SpreadsheetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(chargeData, statusData, cicleData) {
    try {
      await this.prisma.fct_charge.createMany({ data: chargeData });
      await this.prisma.dim_status.createMany({ data: statusData });
      await this.prisma.dim_cicle.createMany({ data: cicleData });
    } catch (error) {
      throw new Error(error);
      // Throw the error or handle it appropriately
    }
  }
}
