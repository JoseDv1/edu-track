/*
  Warnings:

  - You are about to drop the column `fecha` on the `cursos` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cursos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "temas" JSONB NOT NULL DEFAULT [],
    "grupoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cursos_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "grupos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cursos" ("createdAt", "grupoId", "id", "nombre", "temas", "updatedAt") SELECT "createdAt", "grupoId", "id", "nombre", "temas", "updatedAt" FROM "cursos";
DROP TABLE "cursos";
ALTER TABLE "new_cursos" RENAME TO "cursos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
