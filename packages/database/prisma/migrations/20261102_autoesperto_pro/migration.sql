CREATE TABLE "ProSubscription" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'INACTIVE',
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT,
  "stripePriceId" TEXT,
  "periodStart" TIMESTAMP(3),
  "periodEnd" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "reportsUsed" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProSubscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProSubscription_userId_key" ON "ProSubscription"("userId");
CREATE UNIQUE INDEX "ProSubscription_stripeSubscriptionId_key" ON "ProSubscription"("stripeSubscriptionId");
CREATE INDEX "ProSubscription_status_periodEnd_idx" ON "ProSubscription"("status", "periodEnd");
ALTER TABLE "ProSubscription" ADD CONSTRAINT "ProSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ProReportUsage" (
  "id" TEXT NOT NULL,
  "subscriptionId" TEXT NOT NULL,
  "generatedReportId" TEXT NOT NULL,
  "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "periodStart" TIMESTAMP(3) NOT NULL,
  "periodEnd" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProReportUsage_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProReportUsage_generatedReportId_key" ON "ProReportUsage"("generatedReportId");
CREATE INDEX "ProReportUsage_subscriptionId_usedAt_idx" ON "ProReportUsage"("subscriptionId", "usedAt");
ALTER TABLE "ProReportUsage" ADD CONSTRAINT "ProReportUsage_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "ProSubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GeneratedReport" ADD COLUMN "shareTokenHash" TEXT;
ALTER TABLE "GeneratedReport" ADD COLUMN "shareExpiresAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "GeneratedReport_shareTokenHash_key" ON "GeneratedReport"("shareTokenHash");
