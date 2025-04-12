-- CreateTable
CREATE TABLE "grupos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "padreId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "grupos_padreId_fkey" FOREIGN KEY ("padreId") REFERENCES "grupos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "temas" JSONB NOT NULL DEFAULT [],
    "grupoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "cursos_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "grupos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "clases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preparacion" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "guion" TEXT NOT NULL,
    "reflexion" TEXT,
    "duracion" INTEGER,
    "asistentes" INTEGER,
    "cursoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "clases_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
