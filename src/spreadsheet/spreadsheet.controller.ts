import { Controller } from '@nestjs/common';
import { SpreadsheetService } from './spreadsheet.service';

@Controller('spreadsheet')
export class SpreadsheetController {
  constructor(private readonly spreadsheetService: SpreadsheetService) {}
}
