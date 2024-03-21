import { Module } from '@nestjs/common';
import { SpreadsheetService } from './spreadsheet.service';
import { SpreadsheetController } from './spreadsheet.controller';
import { SpreadsheetRepository } from './spreadsheet.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SpreadsheetController],
  providers: [SpreadsheetService, SpreadsheetRepository],
  exports: [SpreadsheetService],
})
export class SpreadsheetModule {}
