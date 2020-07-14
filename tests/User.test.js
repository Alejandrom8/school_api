const User = require('../models/storeData/User'),
      Session = require('../models/consultData/TokenSession');

//prueba 1
const alex = new User({
    name: 'alex',
    email: 'alex@gmail.com',
    password: 'a1l2e3x4'
})

describe('User iteractions', () => {

    let sign_UP_OUT_token;

    function testResponse(res){
        expect(res).not.toBeNull();
        expect(typeof res).toBe('object');
        expect(res.success).toBeTruthy();
    }

    it('should register the user', async () => {
        let result = await alex.signUp();
        sign_UP_OUT_token = result.data.token;

        testResponse(result);
        expect(result.data).toHaveProperty('name');
        expect(result.data).toHaveProperty('email');
        expect(result.data).not.toHaveProperty('password');
        expect(result.data).toHaveProperty('token');
        expect(result.data.token).toHaveLength(36);
    });

    it('should sign out', async () => {
        let result = await alex.signOut(sign_UP_OUT_token);
        let user = await Session.getUser(sign_UP_OUT_token);

        expect(result).not.toBeNull();
        expect(result).toBeTruthy();
        expect(user).toBeNull();
    });

    it('should sign in', async () => {
        expect(alex).not.toHaveProperty('password');

        alex.password = 'a1l2e3x4';
        let result = await alex.signIn();
        let user = await Session.getUser(result.data.token);

        testResponse(result);
        expect(result.data).toHaveProperty('token');
        expect(result.data.token).toHaveLength(36);
        expect(user).not.toBeNull();
        expect(user.email).toEqual(alex.email);
    });

    it('should delete the user', async () => {
        let result = await alex.delete();
        testResponse(result);
        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('rows');
        expect(result.data.rows).toEqual(1);
    });
});