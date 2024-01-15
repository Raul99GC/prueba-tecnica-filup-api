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


## Instalación

1. Clona el repositorio en tu máquina local.

2. Navega hasta el directorio del proyecto.

3. Instala las dependencias del proyecto con el comando `npm install`.

  

## Scripts

 
El proyecto incluye los siguientes scripts que puedes ejecutar con `npm run <script>`:

-  `dev`: Ejecuta el proyecto en modo de desarrollo con nodemon.

-  `start`: Ejecuta el proyecto en modo de producción.

  

```bash

npm  run  dev

npm  run  
```

### `Archivos de configuracion: variables de entorno (.env)`
- Hay un example.env de muestra.