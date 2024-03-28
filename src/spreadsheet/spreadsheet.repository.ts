import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';

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
    }
  }

  async createMonthlyMetrics(month, activeSubscribersCount, mrr, churnRate) {
    return await this.prisma.vw_monthly_metrics.create({
      data: {
        month,
        activeSubscribersCount,
        mrr,
        churnRate,
      },
    });
  }

  async getDistinctMonths() {
    return await this.prisma.$queryRaw`
      SELECT DISTINCT month
      FROM vw_monthly_metrics
      ORDER BY month ASC;
    `;
  }

  async getActiveSubscribersCount(month) {
    return await this.prisma.vw_monthly_metrics.count({
      where: {
        month,
      },
    });
  }

  async getMrrData(month) {
    return await this.prisma.fct_charge.aggregate({
      where: {
        initialDate: {
          lte: dayjs(month).endOf('month').format('YYYY-MM-DD HH:mm'),
        },
      },
      _sum: {
        value: true,
      },
    });
  }
  async getChurnedSubscribers(month) {
    return await this.prisma.dim_status.findMany({
      where: {
        status: 'Cancelada',
        statusDate: {
          gte: dayjs(month).startOf('month').format('YYYY-MM-DD HH:mm'),
          lte: dayjs(month).endOf('month').format('YYYY-MM-DD HH:mm'),
        },
      },
    });
  }
}
