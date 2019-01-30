import * as chai from 'chai';

import SearchFrame from './esi'

const expect = chai.expect;
describe('readQs', () => {

    it('readQs should return empty dict when parameter given was empty string', () => {
        const s = SearchFrame.readQs('');
        expect(s).to.deep.equal({});
    });

    it('readQs should parse query string', () => {
        const s = SearchFrame.readQs('a=b&c=d');
        expect(s).to.deep.equal({a: 'b', c: 'd'});
    });

    it('readQs should parse query string 2', () => {
        const s = SearchFrame.readQs('foo=bar&baz=zaz&ipsum');
        expect(s).to.deep.equal({foo: 'bar', baz: 'zaz', ipsum: ''});
    });

    it('serialize should convert object to string', () => {
        const s = SearchFrame.serialize({foo: 'bar', baz: 'faz'});
        expect(s).to.equal('foo=bar&baz=faz');
    });
});
