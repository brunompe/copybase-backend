/*
  Warnings:

  - You are about to drop the `vw_monthly_charges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "vw_monthly_charges";

-- CreateTable
CREATE TABLE "vw_monthly_metrics" (
    "subscriber_id" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "activeSubscribersCount" INTEGER NOT NULL,
    "mrr" DECIMAL(65,30) NOT NULL,
    "churnRate" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "vw_monthly_metrics_pkey" PRIMARY KEY ("subscriber_id")
);
