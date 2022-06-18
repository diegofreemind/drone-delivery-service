import { Drone } from '../src/index';

describe('Should handle Drones', () => {
  test('Should create a new Drone when input information is provided', () => {
    const drone = new Drone(300, 'drone one');

    expect(drone).toBeDefined();
    expect(drone.getMaxWeight).toBe(300);
    expect(drone.getName).toBe('drone one');
  });
  test('Should throw an exception when input information is not provided', () => {});
});
