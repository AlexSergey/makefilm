import { isDevelopment, isProduction } from './environments';

describe('environments', () => {
  it('isDevelopment', () => {
    expect(isDevelopment()).toBeTruthy();
  });
  it('isProduction', () => {
    expect(isProduction()).toBeFalsy();
  });
});
