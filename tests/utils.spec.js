import * as Utils from '../src/utils';

describe('Utils test suite', () => {
  describe('safeAccess method.', () => {
    it('Should access the properties of the object.', () => {
      const myObj = { a: { b: { c: 10 }}};
      const value = Utils.safeAccess(myObj, 'a.b.c');
      expect(value).toBe(10);
    });

    it('Should return undefined for non-existent properties of an object.', () => {
      const myObj = { a: 10 };
      ['a.b.c', 'a()'].forEach(path => {
        const value = Utils.safeAccess(myObj, path);
        expect(value).toBe(undefined);
      })
    });

    it('Should call the method with the given arguments.', () => {
      const myObj = { foo: (val) => val };
      const spy = jest.spyOn(myObj, 'foo');
      const value = Utils.safeAccess(myObj, 'foo()', 10);
      expect(spy).toHaveBeenCalledWith(10);
      expect(value).toBe(10);
    });
  });

  describe('flattenArray method.', () => {
    it('Should flatten the given array.', () => {
      const testCases = [
        { input: [1, [2, [3]]], output: [1, 2, 3] },
        {
          input: [1, [{ prop: 1 }], [{ prop: 2}, [{ prop: 3 }]]],
          output: [1, { prop: 1}, { prop: 2}, { prop: 3}]
        },
      ];

      testCases.forEach(testCase => {
        const result = Utils.flattenArray(testCase.input);
        expect(result).toEqual(testCase.output);
      })
    });
  });

  describe('getClassesFromObject method.', () => {
    it('Should flatten the given array.', () => {
      const testCases = [
        {
          input: {
            myClass1: true,
            myClass2: true,
            willNotShow: false,
          },
          output: 'myClass1 myClass2',
        },
      ];

      testCases.forEach(testCase => {
        const result = Utils.getClassesFromObject(testCase.input);
        expect(result).toEqual(testCase.output);
      })
    });
  });

  describe('generateId method.', () => {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    it('Should generate an id terminating in 4 digits.', () => {
      const nonUniqueName = 'myName';
      const result = Utils.generateId(nonUniqueName);

      expect(result.substr(0, nonUniqueName.length)).toEqual(nonUniqueName.toLowerCase());
      result.substr(-4).split('').forEach(d => {
        expect(digits.find(digit => digit === +d)).toBeDefined();
      });
    });

    it('Should generate an id terminating in 2 digits.', () => {
      const nonUniqueName = 'myName';
      const result = Utils.generateId(nonUniqueName, 2);

      expect(result.substr(0, nonUniqueName.length)).toEqual(nonUniqueName.toLowerCase());
      result.substr(-2).split('').forEach(d => {
        expect(digits.find(digit => digit === +d)).toBeDefined();
      });
    });

    it('Should replace all spaces with dashes.', () => {
      const nonUniqueName = 'my name';
      const result = Utils.generateId(nonUniqueName);
      expect(result.substr(0, nonUniqueName.length)).toEqual('my-name');
    });
  });

  describe('flattenObject method', () => {
    it('Should flatten an object without keeping the old path.', () => {
      const myObj = { a: { prop1: 'depth2' }, b: { prop2: 'depth2' } };
      const flattened = Utils.flattenObject(myObj);
      expect(flattened).toEqual({ prop1: 'depth2', prop2: 'depth2' })
    });

    it('Should flatten an object and keep the old path.', () => {
      const myObj = { a: { prop1: 'depth2' }, b: { prop2: 'depth2' } };
      const flattened = Utils.flattenObject(myObj, true);
      expect(flattened).toEqual({ 'a.prop1': 'depth2', 'b.prop2': 'depth2' })
    });
  });

  describe('deepClone method', () => {
    it('Should clone an object without keeping the old reference.', () => {
      const myObj = { nested: { arr: [1, 2, 3] } };
      const newObj = Utils.deepCopy(myObj);
      expect(newObj.nested).toEqual(myObj.nested);
      expect(newObj.nested).not.toBe(myObj.nested);
    });
  });
});
