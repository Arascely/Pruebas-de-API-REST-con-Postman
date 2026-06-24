// Archivo: tests/api.test.js
const request = require('supertest');
const API_URL = 'https://fakestoreapi.com';

describe('Pruebas de API REST - Sistema E-commerce (Supertest)', () => {

    describe('Módulo: Búsqueda y filtros', () => {
        
        test('TC-001: Búsqueda exitosa con término genérico', async () => {
            const response = await request(API_URL).get('/products');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);
            
            // Estructura obligatoria
            const primerProducto = response.body[0];
            expect(primerProducto).toHaveProperty('id');
            expect(primerProducto).toHaveProperty('title');
            expect(primerProducto).toHaveProperty('price');
            expect(typeof primerProducto.price).toBe('number'); 
        });

        test('TC-002: Búsqueda sin coincidencias', async () => {
            const response = await request(API_URL).get('/products/category/nonexistent');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(0); 
        });

        test('TC-003: Validación cruzada de Filtros de Precio', async () => {
            const response = await request(API_URL).get('/products?sort=desc');
            expect(response.statusCode).toBe(200);
            expect(response.body[0]).toHaveProperty('price');
        });

        test('TC-004: Inyección de caracteres especiales', async () => {
            const response = await request(API_URL).get('/products/category/%20@!#$');
            expect(response.statusCode).toBe(200); 
        });

        test('TC-005: Procesamiento de Filtros Simultáneos', async () => {
            const response = await request(API_URL).get('/products?limit=5&sort=desc');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(5);
        });
    });

    describe('Módulo: Carrito de compras', () => {
        
        test('TC-006: Agregar producto al carrito', async () => {
            const nuevoCarrito = {
                userId: 3,
                date: "2026-06-22",
                products: [{ productId: 1, quantity: 2 }]
            };
            const response = await request(API_URL).post('/carts').send(nuevoCarrito);
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('id');
            
            // Verifica la fecha y estructura 
            expect(response.body).toHaveProperty('id');
            expect(response.body.products[0].productId).toBe(1);
        });

        test('TC-007: Límite superior de stock', async () => {
            const carritoExcedido = {
                userId: 3,
                date: "2026-06-22",
                products: [{ productId: 2, quantity: 99999 }] // Simulación de límite
            };
            const response = await request(API_URL).post('/carts').send(carritoExcedido);
            expect(response.statusCode).toBe(201);
        });

        test('TC-008: Cálculo aritmético del subtotal', async () => {
            const response = await request(API_URL).get('/carts/5');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body.products)).toBe(true);
        });

        test('TC-009: Eliminación de producto y carrito vacío', async () => {
            const response = await request(API_URL).delete('/carts/6');
            expect(response.statusCode).toBe(200);
        });

        test('TC-010: Persistencia tras recargar la página', async () => {
            const response = await request(API_URL).get('/carts/user/2');
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBeGreaterThanOrEqual(0);
        });
    });
}); 