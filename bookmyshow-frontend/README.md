# BookMyShow Frontend (React + Vite)

## Run in VS Code
1. Start MySQL + the Spring Boot backend (port 8081).
2. In the VS Code terminal, inside this folder:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:5173

`/api` requests are proxied to `http://localhost:8081` (see `vite.config.js`), so no CORS setup is required.

## Required backend fix (2 lines)
`ShowController.show(...)` and `TheatreController.theatres(...)` have no `@GetMapping`, so `/api/v1/shows` returns 404.
Add `@GetMapping` above both methods (import `org.springframework.web.bind.annotation.GetMapping`).

## backend-fixes/
Drop-in replacements for the Spring Boot files (same names, same packages):
- `controller/ApiExcepption.java` - duplicate email/phone (`ProfileConfilt`) and `IllegalArgumentException` now return 409 with a message instead of 500
- `controller/ShowController.java`, `controller/TheatreController.java` - add the missing `@GetMapping`
- `config/CrosConfig.java` - adds `@Configuration`
