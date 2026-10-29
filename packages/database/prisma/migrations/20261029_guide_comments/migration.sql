CREATE TABLE IF NOT EXISTS "GuideComment" (
  "id" TEXT NOT NULL,
  "guideSlug" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuideComment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "GuideComment_guideSlug_status_createdAt_idx" ON "GuideComment"("guideSlug", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "GuideComment_userId_createdAt_idx" ON "GuideComment"("userId", "createdAt");
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GuideComment_userId_fkey') THEN
    ALTER TABLE "GuideComment" ADD CONSTRAINT "GuideComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
