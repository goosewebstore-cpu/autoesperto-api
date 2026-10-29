CREATE TABLE "GuideComment" (
  "id" TEXT NOT NULL,
  "guideSlug" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuideComment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "GuideComment_guideSlug_status_createdAt_idx" ON "GuideComment"("guideSlug", "status", "createdAt");
CREATE INDEX "GuideComment_userId_createdAt_idx" ON "GuideComment"("userId", "createdAt");
ALTER TABLE "GuideComment" ADD CONSTRAINT "GuideComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
