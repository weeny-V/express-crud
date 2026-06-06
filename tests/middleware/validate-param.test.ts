import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateNumericParam } from '../../common/middleware/validate-param.ts';

type JsonBody = {
    message: string;
    errors: Array<{
        property: string;
        constraints: string[];
    }>;
};

const runMiddleware = (value: string | undefined) => {
    let statusCode: number | undefined;
    let jsonBody: JsonBody | undefined;
    let nextCalled = false;

    const req = {
        params: {
            id: value,
        },
    };
    const res = {
        status(code: number) {
            statusCode = code;
            return this;
        },
        json(body: JsonBody) {
            jsonBody = body;
            return this;
        },
    };
    const next = () => {
        nextCalled = true;
    };

    validateNumericParam('id')(req as never, res as never, next);

    return {
        statusCode,
        jsonBody,
        nextCalled,
    };
};

describe('validateNumericParam', () => {
    it('allows positive integer params', () => {
        const result = runMiddleware('42');

        assert.equal(result.nextCalled, true);
        assert.equal(result.statusCode, undefined);
    });

    it('rejects zero and non-numeric params', () => {
        const zeroResult = runMiddleware('0');
        const textResult = runMiddleware('abc');

        assert.equal(zeroResult.nextCalled, false);
        assert.equal(zeroResult.statusCode, 400);
        assert.equal(zeroResult.jsonBody?.errors[0]?.property, 'id');

        assert.equal(textResult.nextCalled, false);
        assert.equal(textResult.statusCode, 400);
    });
});
