| Nº  | Módulo       | Requerimiento                                                                  | Tipo         | Prioridad |
| --- | ------------ | ------------------------------------------------------------------------------ | ------------ | --------- |
| 1   | Grupos       | Ver grupos y subgrupos como árbol jerárquico                                   | Frontend     | Alta      |
| 2   | Grupos       | Crear grupo o subgrupo (con relación padre-hijo)                               | Backend + UI | Alta      |
| 3   | Grupos       | Editar nombre de grupo/subgrupo                                                | Backend + UI | Media     |
| 4   | Grupos       | Eliminar grupo o subgrupo                                                      | Backend      | Media     |
| 5   | Cursos       | Ver cursos asociados a un grupo                                                | Backend + UI | Alta      |
| 6   | Cursos       | Crear curso con nombre, fecha, temas[] y grupoId                               | Backend + UI | Alta      |
| 7   | Cursos       | Editar curso existente                                                         | Backend + UI | Media     |
| 8   | Cursos       | Eliminar curso                                                                 | Backend      | Media     |
| 9   | Clases       | Ver clases asociadas a un curso                                                | Backend + UI | Alta      |
| 10  | Clases       | Registrar clase con fecha, preparación, tema, guion, reflexión, duración, etc. | Backend + UI | Alta      |
| 11  | Clases       | Editar clase registrada                                                        | Backend + UI | Media     |
| 12  | Clases       | Eliminar clase                                                                 | Backend      | Baja      |
| 13  | Navegación   | Implementar un aside con navegación a Grupos, Cursos, Nueva Clase              | Frontend     | Alta      |
| 14  | Estilo       | Aplicar diseño con variables CSS y paleta definida                             | Frontend     | Media     |
| 15  | Persistencia | Guardar todos los datos en un archivo SQLite `.db` usando Prisma               | Backend      | Alta      |
