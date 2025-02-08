export const LogExecutionTime = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = function (...args: any[]): any {
      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const end = performance.now();
      // eslint-disable-next-line no-console
      console.log(`${propertyKey} execution time: ${end - start}ms`);

      return result;
    };
  };
};
