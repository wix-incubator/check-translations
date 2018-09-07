const path = require('path');
const {expect} = require('chai');

const check = require('../index.js');

describe('check', () => {

  it('should pass if only english translation exists', () => {
    const result = checkTranslations('en-only', []);
    expect(result).to.have.lengthOf(0);
  });

  it('should notify about extraneous keys', () => {
    const result = checkTranslations('extraneous', []);
    expect(result).to.have.lengthOf(1);
    expect(result[0]).to.deep.equal({
      type: 'WARNING',
      code: 'EXTRANEOUS_TRANSLATION_FOUND',
      file: 'messages_pt.json',
      translation: {
        key: 'two'
      }
    });
  });

  it('should not fail if key is missing in translation', () => {
    const result = checkTranslations('missing', []);
    expect(result).to.have.lengthOf(0);
  });

  it('should notify about incorrect placeholder', () => {
    const result = checkTranslations('incorrect', []);
    expect(result).to.have.lengthOf(1);
    expect(result[0]).to.deep.equal({
      type: 'ERROR',
      code: 'CORRUPTED_TRANSLATION',
      file: 'messages_pt.json',
      translation: {
        key: 'one',
        params: "{{surname}}",
        baseLineParams: "{{name}}"
      }
    });
  });

});

function checkTranslations(name, ignoreKeys) {
  return check(path.join(__dirname, name), ignoreKeys);
}
