-- AlterTable
ALTER TABLE "dim_cicle" ALTER COLUMN "charged_at_x_days" DROP NOT NULL,
ALTER COLUMN "next_cicle" DROP NOT NULL,
ALTER COLUMN "cancel_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dim_status" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "fct_charge" ADD COLUMN     "cicleId" INTEGER,
ADD COLUMN     "statusId" INTEGER,
ALTER COLUMN "value" DROP NOT NULL,
ALTER COLUMN "initial_date" DROP NOT NULL,
ALTER COLUMN "subscriber_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "fct_charge" ADD CONSTRAINT "fct_charge_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "dim_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fct_charge" ADD CONSTRAINT "fct_charge_cicleId_fkey" FOREIGN KEY ("cicleId") REFERENCES "dim_cicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
