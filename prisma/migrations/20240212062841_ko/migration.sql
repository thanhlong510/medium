-- AlterTable
ALTER TABLE "Bio" ALTER COLUMN "avatarImage" DROP NOT NULL,
ALTER COLUMN "avatarImage" SET DEFAULT '',
ALTER COLUMN "avatarImage" SET DATA TYPE TEXT;