const assert = require('assert');
const main = require('..');

describe('remote-video-recorder', () => {
  it('returns with placeholder', () => {
    assert.equal(main(), 'remote-video-recorder');
  });
});
