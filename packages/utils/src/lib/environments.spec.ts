import { isDevelopment, isProduction } from './environments';

describe('environments', () => {
  it('isDevelopment', () => {
    expect(isDevelopment()).toBeFalsy();
  });
  it('isProduction', () => {
    expect(isProduction()).toBeFalsy();
  });
});
