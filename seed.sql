-- Script para inicializar la base de datos de pruebas (MVP)

-- 1. Crear el negocio principal
INSERT INTO businesses (name, description) 
VALUES ('Cafetería Lynat', 'La mejor cafetería de la ciudad');

-- 2. Crear el programa de fidelidad vinculado al negocio
INSERT INTO loyalty_programs (business_id, name, required_stamps, reward_description)
SELECT id, 'Club de Café Lynat', 7, '¡Un café gratis al completar tu tarjeta!'
FROM businesses
LIMIT 1;

-- 3. Crear una recompensa canjeable (Premio) vinculado al programa en la tabla de promociones
INSERT INTO promotions (business_id, title, description, required_stamps, status)
SELECT id, 'Café Gratis', 'Válido por cualquier bebida tamaño mediano.', 7, 'ACTIVE'
FROM businesses
LIMIT 1;
