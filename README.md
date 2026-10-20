# 209_ServiceCRUD

A REST API service for managing biodata (student data) using Express.js and PostgreSQL.

## Features

- CRUD operations for student biodata
- PostgreSQL database integration
- Input validation
- Error handling middleware

## API Endpoints

- `GET /` - Retrieve all biodata
- `POST /biodata` - Create new biodata
- `PUT /biodata/:id` - Update biodata by ID
- `DELETE /biodata/:id` - Delete biodata by ID

## Setup

```bash
npm install
node index.js
```

## Configuration

Set the following environment variables:
- `DB_USER`: PostgreSQL username (default: postgres)
- `DB_HOST`: Database host (default: localhost)
- `DB_NAME`: Database name (default: mahasiswa)
- `DB_PASSWORD`: Database password
- `DB_PORT`: Database port (default: 5432)
- `PORT`: Server port (default: 3000)

## Database Schema

```sql
CREATE TABLE biodata (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nim VARCHAR(20) NOT NULL,
    kelas VARCHAR(50) NOT NULL
);
```

## License

ISC
