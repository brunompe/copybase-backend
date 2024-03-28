import { Injectable } from '@nestjs/common';
import * as Xlsx from 'xlsx';
import * as dayjs from 'dayjs';
import { SpreadsheetRepository } from './spreadsheet.repository';

@Injectable()
export class SpreadsheetService {
  constructor(private readonly spreadsheetRepository: SpreadsheetRepository) {}

  async create(file) {
    const data = await this.fileToJson(file);
    const correctData = await this.processData(data);
    const activeSubscribers = await this.activeSubscribers(correctData);
    const churnRate = await this.calculateChurnRate(correctData);
    return { activeSubscribers, churnRate };
  }

  async fileToJson(file) {
    const wb = Xlsx.read(file.buffer);
    const worksheet = wb.Sheets['Sheet1'];
    const jsonData = Xlsx.utils.sheet_to_json(worksheet);
    return jsonData;
  }

  async processData(jsonData) {
    const chargeData = [];
    const statusData = [];
    const cicleData = [];

    jsonData?.map((o) => {
      const initialDate = dayjs(o['data início']).format('YYYY-MM-DD HH:mm');
      const status = o.status;
      const statusDate = dayjs(o['data status']).format('YYYY-MM-DD HH:mm');
      const value = !isNaN(parseFloat(o.valor)) ? parseFloat(o.valor) : null;
      const chargedAtXDays = o['cobrada a cada X dias'];
      const nextCicle = dayjs(o['próximo ciclo']).format('YYYY-MM-DD HH:mm');
      const cancelDate =
        status === 'Cancelada'
          ? dayjs(o['data cancelamento']).format('YYYY-MM-DD HH:mm')
          : null;
      const subscriberId = parseFloat(o['ID assinante'].match(/\d+/g));

      const formattedData = {
        fct_charge: {
          value,
          initialDate,
          subscriberId,
        },
        dim_status: { status, statusDate, subscriberId },
        dim_cicle: {
          chargedAtXDays,
          nextCicle,
          cancelDate,
          subscriberId,
        },
      };

      chargeData.push(formattedData.fct_charge);
      cicleData.push(formattedData.dim_cicle);
      statusData.push(formattedData.dim_status);
    });

    await this.spreadsheetRepository.create(chargeData, statusData, cicleData);
    await this.calculateMonthlyMetrics();

    return { chargeData, cicleData, statusData };
  }

  async calculateMonthlyMetrics() {
    const months = await this.spreadsheetRepository.getDistinctMonths();

    months.map(async (month) => {
      const activeSubscribersCount =
        await this.spreadsheetRepository.getActiveSubscribersCount(month);
      const mrrData = await this.spreadsheetRepository.getMrrData(month);
      const churnRate = await this.calculateChurnRate(month);

      await this.spreadsheetRepository.createMonthlyMetrics(
        month,
        activeSubscribersCount,
        mrrData._sum.value,
        churnRate,
      );
    });
  }

  async calculateChurnRate(month) {
    const previousMonth = dayjs(month).subtract(1, 'month').format('YYYY-MM');
    const churnedSubscribers =
      await this.spreadsheetRepository.getChurnedSubscribers(previousMonth);
    const activeSubscribers =
      await this.spreadsheetRepository.getActiveSubscribersCount(previousMonth);

    return (
      churnedSubscribers.length /
        (activeSubscribers + churnedSubscribers.length) || 0
    );
  }

  async activeSubscribers({ statusData }) {
    const currentMonth = dayjs().format('YYYY-MM');

    const activeSubcribers = statusData.filter((e) => e.status === 'Ativa');
    const activeSubscriberIds = activeSubcribers.map(
      (subscriber) => subscriber.subscriberId,
    );

    const mrrData = await this.spreadsheetRepository.getMrrData(currentMonth);
    return {
      activeSubscriberCount: activeSubcribers.length,
      mrr: mrrData._sum.value || 0,
    };
  }
}
