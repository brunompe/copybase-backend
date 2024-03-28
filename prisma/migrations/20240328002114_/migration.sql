/*
  Warnings:

  - The primary key for the `vw_monthly_metrics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subscriber_id` on the `vw_monthly_metrics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vw_monthly_metrics" DROP CONSTRAINT "vw_monthly_metrics_pkey",
DROP COLUMN "subscriber_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "vw_monthly_metrics_pkey" PRIMARY KEY ("id");
