import { hc, type InferResponseType } from "hono/client"
import type { RPC } from "@/../../backend/src/index"

export const API_URL = "http://localhost:3000"

const apiTypes = hc<RPC>("/")
const $grupos = apiTypes.api.groups.$get
const $clases = apiTypes.api.classes.$get
const $cursos = apiTypes.api.courses.$get
type Grupo = InferResponseType<typeof $grupos>[0]
type Clase = InferResponseType<typeof $clases>[0]
type Curso = InferResponseType<typeof $cursos>[0]

export type { Grupo, Curso, Clase }
