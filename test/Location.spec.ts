import DeliveryLocation from '../src/entities/Location';
import DeliveryPackage from '../src/entities/Package';

describe('Should handle Location instances', () => {
  test('Should instantiate a new Location', () => {
    const deliveryPackage = new DeliveryPackage(100);
    const deliveryLocation = new DeliveryLocation('LocationNameA', [
      deliveryPackage,
    ]);

    expect(deliveryPackage).toBeDefined();
    expect(deliveryLocation).toBeDefined();
    expect(deliveryLocation.getPackages).toBe(100);
    expect(deliveryLocation.getName).toBe('LocationNameA');
  });
});
