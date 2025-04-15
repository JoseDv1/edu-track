# 🧭 Copilot Instructions - EduTrack

## 📘 Descripción del Proyecto

**EduTrack** es una aplicación local-first para que docentes registren y gestionen cursos, grupos y clases impartidas. Se basa en una arquitectura monorepo y usa una base de datos SQLite persistente a través de Prisma.

El enfoque principal está en la organización jerárquica de grupos, la planificación de cursos y el seguimiento detallado de clases. Todo se guarda localmente en un archivo `.db` para mantener la independencia del navegador o conexión a internet.

---

## 🧱 Estructura del Proyecto

```
edu-track/
├── frontend/        # Astro + Svelte (UI)
│   ├── src/
│   │   ├── components/       # Componentes Svelte reutilizables
│   │   ├── pages/            # Páginas Astro
│   │   └── lib/              # Funciones de ayuda / clientes API
│   └── public/               # Assets estáticos
│
├── backend/         # Bun + Hono + Prisma (API REST + persistencia)
│   ├── src/
│   │   ├── routes/           # Rutas API: /groups, /courses, /classes
│   │   ├── lib/              # Prisma client, helpers
│   │   └── index.ts          # Entry point del servidor
│   ├── prisma/
│   │   └── schema.prisma     # Modelo de datos Prisma
│   └── db/
│       └── dev.db            # Archivo SQLite persistente
│
├── tsconfig.json            # Configuración de TypeScript
└── README.md
```

---

## 🛠 Tecnologías Usadas

- **Bun**: runtime JavaScript ultrarrápido (backend)
- **Hono**: framework minimalista para APIs REST
- **Prisma**: ORM moderno con soporte para SQLite
- **SQLite**: base de datos embebida guardada en archivo `.db`
- **Astro**: framework para frontend con rendering híbrido
- **Svelte**: componentes reactivamente simples
- **TypeScript**: tipado estricto para todo el proyecto

---

## 🚀 Despliegue local

### 1. Clona el repo

```bash
git clone https://github.com/usuario/edu-track.git
cd edu-track
```

### 2. Instala dependencias (usando workspaces Bun)

```bash
bun install
```

### 3. Crea y migra la base de datos SQLite

```bash
cd backend
bunx prisma migrate dev --name init
```

### 4. Inicia el backend

```bash
bun src/index.ts
```

### 5. Inicia el frontend

```bash
cd ../frontend
bun dev
```

---

## 📦 Scripts comunes

```bash
# Migración DB
bunx prisma migrate dev --name nombre

# Generar cliente Prisma
dbunx prisma generate
```
