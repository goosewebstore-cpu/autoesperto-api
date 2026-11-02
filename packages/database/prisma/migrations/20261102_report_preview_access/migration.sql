CREATE TABLE "GeneratedReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "accessTokenHash" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "vehicleJson" TEXT NOT NULL,
    "photoAnalysisJson" TEXT,
    "previewJson" TEXT NOT NULL,
    "reportJson" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PREVIEW',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "unlockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GeneratedReport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GeneratedReport_accessTokenHash_key" ON "GeneratedReport"("accessTokenHash");
CREATE INDEX "GeneratedReport_userId_createdAt_idx" ON "GeneratedReport"("userId", "createdAt");
CREATE INDEX "GeneratedReport_status_expiresAt_idx" ON "GeneratedReport"("status", "expiresAt");

ALTER TABLE "GeneratedReport"
ADD CONSTRAINT "GeneratedReport_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GeneratedReport" ALTER COLUMN "expiresAt" DROP NOT NULL;

ALTER TABLE "Purchase"
  ADD COLUMN "productType" TEXT NOT NULL DEFAULT 'SINGLE_ANALYSIS',
  ADD COLUMN "generatedReportId" TEXT,
  ADD COLUMN "creditsGranted" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "checkoutAttempt" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Purchase"
ADD CONSTRAINT "Purchase_generatedReportId_fkey"
FOREIGN KEY ("generatedReportId") REFERENCES "GeneratedReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Purchase_generatedReportId_key" ON "Purchase"("generatedReportId");
CREATE INDEX "Purchase_productType_status_idx" ON "Purchase"("productType", "status");

CREATE TABLE "ReportCredit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "generatedReportId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumedAt" TIMESTAMP(3),
    CONSTRAINT "ReportCredit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ReportCredit_generatedReportId_key" ON "ReportCredit"("generatedReportId");
CREATE UNIQUE INDEX "ReportCredit_purchaseId_sequence_key" ON "ReportCredit"("purchaseId", "sequence");
CREATE INDEX "ReportCredit_userId_status_createdAt_idx" ON "ReportCredit"("userId", "status", "createdAt");

ALTER TABLE "ReportCredit"
ADD CONSTRAINT "ReportCredit_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReportCredit"
ADD CONSTRAINT "ReportCredit_purchaseId_fkey"
FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReportCredit"
ADD CONSTRAINT "ReportCredit_generatedReportId_fkey"
FOREIGN KEY ("generatedReportId") REFERENCES "GeneratedReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
