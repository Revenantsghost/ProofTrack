const request = require('supertest');
const app = require('../index.js');


describe('API Endpoints', () => {
    let user_id;
    let user = "Tony"
    let project_name = "Test Project"

    test('POST /register - Create new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({ user_name: user });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user_id');
        user_id = response.body.user_id;
        expect(response.body.user_id).toBe(1);
    });

    test('GET /fetchProfile - Return Profile', async () => {
        const response = await request(app)
            .get(`/fetchProfile?user_id=${user_id}`)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user_name', user);
        expect(response.body).toHaveProperty('num_of_projects', 0);
    });

    test('POST /uploadProject - Upload Project', async () => {
        const response = await request(app)
            .post('/uploadProject')
            .send({"user_id": user_id, "project_name": project_name});

        expect(response.status).toBe(201);
        expect(response.body.proj_id).toBe(1);
    });

    test('PUT /updateProfile - Update Profile', async () => {
        const response = await request(app)
            .put('/updateProfile')
            .send({"user_id": user_id, "user_name": "???"});
        expect(response.status).toBe(200);
    });

    test('get /fetchProjects - Update Profile', async () => {
        const response = await request(app)
            .get(`/fetchProjects?user_id=${1}`)
        expect(response.status).toBe(200);
        console.log(response.body)
        //console.log(response)
        expect(response.body[0]).toHaveProperty('proj_id', 1);
        expect(response.body[0]).toHaveProperty('project_name', "name1");
        expect(response.body[1]).toHaveProperty('proj_id', 2);
        expect(response.body[1]).toHaveProperty('project_name', "name2");

    });
});
