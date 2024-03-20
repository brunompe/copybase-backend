-- CreateTable
CREATE TABLE "fct_charge" (
    "id" SERIAL NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "initial_date" TEXT NOT NULL,
    "subscriber_id" INTEGER NOT NULL,

    CONSTRAINT "fct_charge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dim_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "status_date" TEXT NOT NULL,

    CONSTRAINT "dim_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dim_cicle" (
    "id" SERIAL NOT NULL,
    "charged_at_x_days" INTEGER NOT NULL,
    "next_cicle" TEXT NOT NULL,
    "cancel_date" TEXT NOT NULL,

    CONSTRAINT "dim_cicle_pkey" PRIMARY KEY ("id")
);
