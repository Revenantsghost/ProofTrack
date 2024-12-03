const request = require('supertest');
const app = require('../index.js');


describe('API Endpoints', () => {

    // User Table Variables
    let user_name = "Tony"
    let password = "pass"
    let new_password = "password"

    // Project Table Variables
    let proj_name = "Test Project"
    let new_name = "New_name"
    let checkpointFrequency = "Daily"
    let duration = "12/31"
    let startDate = "1/1"

    let proj_id;

    // Test cases for User Table
    test('POST /register - Create new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({ user_name: user_name, password: password});
        expect(response.status).toBe(201);
    });

    test('GET /login - Login into account', async () => {
        const response = await request(app)
            .get(`/login?user_name=${user_name}&password=${password}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('login_success', true);
    });

    test('PUT /changePassword - Replace the password', async () => {
        const response = await request(app)
            .put('/changePassword')
            .send({"user_name": user_name, "new_password": new_password, "old_password": password});
        expect(response.status).toBe(200);
        password = new_password
    });

    test('GET /fetchProfile - Return Profile', async () => {
        const response = await request(app)
            .get(`/fetchProfile?user_name=${user_name}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('num_of_projects', 0);
    });


    // Test cases for Project Table
    test('POST /uploadProject - Upload Project', async () => {
        const response = await request(app)
            .post('/uploadProject')
            .send({"user_name": user_name, "proj_name": proj_name, "checkpointFrequency": checkpointFrequency,
                "duration": duration, "startDate": startDate});

        expect(response.status).toBe(201);
        proj_id = response.body.proj_id
        expect(response.body.proj_id).toBe(1);
    });

    test('get /fetchProject - fetch Project', async () => {
        const response = await request(app)
            .get(`/fetchProject?user_name=${user_name}&proj_id=${proj_id}`)
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('proj_name', proj_name);
        expect(response.body).toHaveProperty('checkpointFrequency', checkpointFrequency);
        expect(response.body).toHaveProperty('duration', duration);
        expect(response.body).toHaveProperty('startDate', startDate);
    });

    test('get /fetchProjects - fetch Projects', async () => {
        const response = await request(app)
            .get(`/fetchProjects?user_name=${user_name}`)
        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty('proj_id', 1);
        expect(response.body[0]).toHaveProperty('proj_name', proj_name);
    });

    test('put /updateProject - Update a project', async () => {
        const response = await request(app)
            .put(`/updateProject`)
            .send({"user_name": user_name, "proj_id": proj_id, "proj_name": new_name});
        expect(response.status).toBe(200);
    });

    
    // Delete everything from a user in both the users table and projects table
    // Used to reset table to original condition.
    test('delete /hardDELETEUSER - Delete everything from user', async () => {
        const response = await request(app)
            .delete(`/hardDELETEUSER`)
            .send({"user_name": user_name});
        expect(response.status).toBe(200);
    });
});
