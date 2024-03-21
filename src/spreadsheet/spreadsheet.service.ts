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
    console.log(jsonData);
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
        dim_status: { status, statusDate },
        dim_cicle: {
          chargedAtXDays,
          nextCicle,
          cancelDate,
        },
      };

      chargeData.push(formattedData.fct_charge);
      cicleData.push(formattedData.dim_status);
    });
    const uniqueStatuses = [...new Set(jsonData.map((o) => o.status))];
    uniqueStatuses.forEach((status) => {
      statusData.push({ status });
    });
    return this.spreadsheetRepository.create(chargeData, statusData, cicleData);
  }
}
