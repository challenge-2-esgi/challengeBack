-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('CDI', 'CDD', 'FREELANCE', 'ALTERNANCE', 'STAGE');

-- CreateEnum
CREATE TYPE "Experience" AS ENUM ('YOUNG_GRADUATE', 'THREE_TO_FIVE_YEARS', 'SIX_TO_TEN_YEARS', 'MORE_THAN_TEN_YEARS');

-- CreateTable
CREATE TABLE "JobOffer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "experience" "Experience",
    "category" TEXT NOT NULL,
    "tasks" JSONB[],
    "skills" JSONB[],
    "contractType" "ContractType" NOT NULL,
    "remuneration" INTEGER,
    "remoteDays" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "duration" TEXT,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "JobOffer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobOffer" ADD CONSTRAINT "JobOffer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
