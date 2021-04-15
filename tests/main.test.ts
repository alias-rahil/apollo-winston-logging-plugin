import { expect } from 'chai';
import echo from '../src/index';

describe('echo(\'hi\')', () => {
    it('should return \'hi\'', () => {
        expect(echo('hi') === 'hi').to.be.true;
    });
});
