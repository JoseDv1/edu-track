// Archivo principal para ejecutar la aplicación EduTrack
// Construye el frontend, verifica la DB y ejecuta el backend
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execPromise = promisify(exec);

// Rutas importantes
const ROOT_DIR = path.resolve(__dirname);
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const DB_PATH = path.join(BACKEND_DIR, 'db', 'dev.db');

// Colores para la consola
const COLORS = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m'
};

async function runCommand(command: string, cwd: string = ROOT_DIR): Promise<string> {
	try {
		console.log(`${COLORS.yellow}Ejecutando: ${command}${COLORS.reset}`);
		const { stdout, stderr } = await execPromise(command, { cwd });
		if (stderr) {
			console.error(`${COLORS.yellow}Advertencia: ${stderr}${COLORS.reset}`);
		}
		return stdout;
	} catch (error) {
		console.error(`${COLORS.red}Error ejecutando comando: ${command}${COLORS.reset}`);
		console.error(error);
		throw error;
	}
}

async function checkDependencies() {
	console.log(`\n${COLORS.cyan}=== Verificando dependencias ====${COLORS.reset}`);

	try {
		// Verificar si Bun está instalado
		await runCommand('bun --version');
		console.log(`${COLORS.green}✓ Bun instalado correctamente${COLORS.reset}`);
	} catch (error) {
		console.error(`${COLORS.red}✗ Bun no está instalado. Por favor, instala Bun antes de continuar:${COLORS.reset}`);
		console.error(`${COLORS.yellow}curl -fsSL https://bun.sh/install | bash${COLORS.reset}`);
		process.exit(1);
	}

	// Instalar dependencias si es necesario
	if (!fs.existsSync(path.join(ROOT_DIR, 'node_modules'))) {
		console.log(`${COLORS.yellow}Instalando dependencias del proyecto...${COLORS.reset}`);
		await runCommand('bun install');
	}
}

async function buildFrontend() {
	console.log(`\n${COLORS.cyan}=== Construyendo Frontend ====${COLORS.reset}`);

	// Verificar si hay dependencias del frontend instaladas
	if (!fs.existsSync(path.join(FRONTEND_DIR, 'node_modules'))) {
		console.log(`${COLORS.yellow}Instalando dependencias del frontend...${COLORS.reset}`);
		await runCommand('bun install', FRONTEND_DIR);
	}

	// Construir el frontend
	console.log(`${COLORS.yellow}Construyendo el frontend...${COLORS.reset}`);
	await runCommand('bun run build', FRONTEND_DIR);
	console.log(`${COLORS.green}✓ Frontend construido exitosamente${COLORS.reset}`);
}

async function checkDatabase() {
	console.log(`\n${COLORS.cyan}=== Verificando Base de Datos ====${COLORS.reset}`);

	// Verificar si existe el archivo de la base de datos
	if (!fs.existsSync(DB_PATH)) {
		console.log(`${COLORS.yellow}Base de datos no encontrada. Creando y migrando base de datos...${COLORS.reset}`);

		// Verificar si existe el directorio db, si no, crearlo
		if (!fs.existsSync(path.join(BACKEND_DIR, 'db'))) {
			fs.mkdirSync(path.join(BACKEND_DIR, 'db'), { recursive: true });
		}

		// Ejecutar la migración de Prisma
		try {
			await runCommand('bunx prisma migrate dev --name init', BACKEND_DIR);
			console.log(`${COLORS.green}✓ Base de datos creada y migrada exitosamente${COLORS.reset}`);
		} catch (error) {
			console.error(`${COLORS.red}✗ Error durante la migración de la base de datos${COLORS.reset}`);
			throw error;
		}
	} else {
		console.log(`${COLORS.green}✓ Base de datos encontrada${COLORS.reset}`);
	}

	// Generar cliente de Prisma
	console.log(`${COLORS.yellow}Generando cliente de Prisma...${COLORS.reset}`);
	await runCommand('bunx prisma generate', BACKEND_DIR);
	console.log(`${COLORS.green}✓ Cliente de Prisma generado${COLORS.reset}`);
}

async function buildAndRunBackend() {
	console.log(`\n${COLORS.cyan}=== Construyendo y ejecutando Backend ====${COLORS.reset}`);

	// Verificar si hay dependencias del backend instaladas
	if (!fs.existsSync(path.join(BACKEND_DIR, 'node_modules'))) {
		console.log(`${COLORS.yellow}Instalando dependencias del backend...${COLORS.reset}`);
		await runCommand('bun install', BACKEND_DIR);
	}

	// Ejecutar backend con Bun
	console.log(`${COLORS.green}Iniciando servidor backend...${COLORS.reset}`);
	console.log(`${COLORS.blue}Presiona Ctrl+C para detener el servidor${COLORS.reset}`);

	// Usamos exec normal (no promisify) para mantener el proceso en ejecución
	const backendProcess = exec('bun src/index.ts', { cwd: BACKEND_DIR });

	backendProcess.stdout?.on('data', (data) => {
		console.log(data.toString().trim());
	});

	backendProcess.stderr?.on('data', (data) => {
		console.error(`${COLORS.red}${data.toString().trim()}${COLORS.reset}`);
	});

	backendProcess.on('exit', (code) => {
		if (code !== 0) {
			console.error(`${COLORS.red}El servidor backend ha terminado con código de error: ${code}${COLORS.reset}`);
		}
	});
}

async function main() {
	console.log(`\n${COLORS.cyan}========================================${COLORS.reset}`);
	console.log(`${COLORS.cyan}   EduTrack - Iniciando aplicación   ${COLORS.reset}`);
	console.log(`${COLORS.cyan}========================================${COLORS.reset}\n`);

	try {
		await checkDependencies();
		await buildFrontend();
		await checkDatabase();
		await buildAndRunBackend();
	} catch (error) {
		console.error(`${COLORS.red}Error al iniciar la aplicación:${COLORS.reset}`, error);
		process.exit(1);
	}
}

// Ejecutar la función principal
main().catch(err => {
	console.error(`${COLORS.red}Error fatal:${COLORS.reset}`, err);
	process.exit(1);
});
