/*
  Warnings:

  - You are about to drop the column `session_hash` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "session_hash";
