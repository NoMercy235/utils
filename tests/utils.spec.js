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

  describe('GetClassesFromObject method.', () => {
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
});
