import Drone from '../src/Drone';

describe('Should handle Drone instances', () => {
  test('Should instantiate a new Drone', () => {
    const drone = new Drone(300, 'drone one');

    expect(drone).toBeDefined();
    expect(drone.getMaxWeight).toBe(300);
    expect(drone.getName).toBe('drone one');
  });
});
