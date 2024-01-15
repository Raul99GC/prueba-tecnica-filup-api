# Pokémon API

## Rutas y Verbos

### `/api/v1/pokemon`

- **GET**
  - Descripción: Obtiene la lista de todos los Pokémon.
  - Ruta: `/api/v1/pokemon`
  - Controlador: `getAll`

- **POST**
  - Descripción: Genera un archivo PDF con información sobre el Pokémon y lo almacena en la base de datos.
  - Ruta: `/api/v1/pokemon`
  - Controlador: `generatePdf`

- **GET**
  - Descripción: Obtiene información de un Pokémon por su ID o nombre.
  - Ruta: `/api/v1/pokemon/:id`
  - Controlador: `getByIdOrName`