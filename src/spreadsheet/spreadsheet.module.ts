import { Module } from '@nestjs/common';
import { SpreadsheetService } from './spreadsheet.service';
import { SpreadsheetController } from './spreadsheet.controller';

@Module({
  controllers: [SpreadsheetController],
  providers: [SpreadsheetService],
})
export class SpreadsheetModule {}
