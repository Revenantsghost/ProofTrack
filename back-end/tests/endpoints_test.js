const request = require('supertest');
const app = require('../index.js');


describe('API Endpoints', () => {
    let user_name = "Tony"
    let password = "pass"
    let new_password = "password"
    let proj_name = "Test Project"
    let new_name = "New_name"
    let proj_id;

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

    test('POST /uploadProject - Upload Project', async () => {
        const response = await request(app)
            .post('/uploadProject')
            .send({"user_name": user_name, "proj_name": proj_name});

        expect(response.status).toBe(201);
        proj_id = response.body.proj_id
        expect(response.body.proj_id).toBe(1);
    });

    test('get /fetchProject - fetch Project', async () => {
        const response = await request(app)
            .get(`/fetchProject?user_name=${user_name}&proj_id=${proj_id}`)
        expect(response.status).toBe(200);
        //console.log(response)
        expect(response.body).toHaveProperty('proj_name', proj_name);
    });

    test('get /fetchProjects - fetch Projects', async () => {
        const response = await request(app)
            .get(`/fetchProjects?user_name=${user_name}`)
        expect(response.status).toBe(200);
        //console.log(response)
        expect(response.body[0]).toHaveProperty('proj_id', 1);
        expect(response.body[0]).toHaveProperty('proj_name', proj_name);
    });

    test('put /updateProject - Update a project', async () => {
        const response = await request(app)
            .put(`/updateProject`)
            .send({"user_name": user_name, "proj_id": proj_id, "proj_name": new_name});
        expect(response.status).toBe(200);
    });
    
    // Delete everything from a user in both user table and project table
    // Used to reset table to original condition.
    test('delete /hardDELETEUSER - Delete everything from user', async () => {
        const response = await request(app)
            .delete(`/hardDELETEUSER`)
            .send({"user_name": user_name});
        expect(response.status).toBe(200);
    });
});
