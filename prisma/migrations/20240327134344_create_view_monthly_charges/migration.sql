-- CreateTable
CREATE TABLE "vw_monthly_charges" (
    "subscriber_id" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "totalCharge" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "vw_monthly_charges_pkey" PRIMARY KEY ("subscriber_id")
);
