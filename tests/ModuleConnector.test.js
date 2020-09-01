const ModuleConnector = require('../src/models/connectors/Module.connector');

describe('testing the module connector', () => {

    function testResponse(res) {
        expect(res).not.toBeNull();
        expect(typeof res).toBe('object');
        expect(res.success).toBeTruthy();
        expect(res.success).toBe(true);
    }

    it('get the info of a module', async () => {
        let moduleID = '74FFA8C';
        let result = await ModuleConnector.getModule(moduleID);

        testResponse(result);
        expect(result.data).not.toBeNull();
    });

    it('get various modules by ID', async () => {
        let modules = ['74FFA8C', 'A2ED5B3', '3779FE2', '1DECB05'];
        let result = await ModuleConnector.getModules(modules);

        testResponse(result);
        expect(result.data).toBeTruthy();
        expect(typeof result.data).toBe('object');
        expect(result.data).toHaveLength(modules.length);
    });

    it('get all the modules for the given subject ID', async () => {
        let subjectID = '9439FFA';
        let result = await ModuleConnector.getSubjectModules(subjectID);

        testResponse(result);
        expect(result.data).toBeTruthy();
        expect(typeof result.data).toBe('object');
    });
});