import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { } from './index';


describe('routes', function() {


  it('save', function() {
    // First subdomain (if case), straight line code, first error case

    const req = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: 1086}});
    const res = httpMocks.createResponse();
    save(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(), 'required argument "name" was missing');

    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {named: "good"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');

    // Second subdomain (else case), straight line code

    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: "good", content: "happy"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {saved: true});

    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: "bad", content: "sad"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {saved: true});
  });
});
