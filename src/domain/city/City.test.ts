import { CityCategory } from './CityCategory.js';
import { City } from './City.js';

describe('City', () => {
  it('creates a city from validated content', () => {
    const result = City.fromContent({
      id: 'city_port_harbor',
      name: 'Port Harbor',
      regionId: 'region_default',
      category: CityCategory.MARKET_HUB,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value.getId().value).toBe('city_port_harbor');
      expect(result.value.getName()).toBe('Port Harbor');
      expect(result.value.getRegionId().value).toBe('region_default');
      expect(result.value.getCategory()).toBe(CityCategory.MARKET_HUB);
    }
  });

  it('rejects unsupported city categories', () => {
    const result = City.fromContent({
      id: 'city_invalid',
      name: 'Invalid City',
      regionId: 'region_default',
      category: 'UNKNOWN' as CityCategory,
    });

    expect(result.ok).toBe(false);
  });

  it('rejects invalid city ids', () => {
    const result = City.fromContent({
      id: '',
      name: 'Invalid City',
      regionId: 'region_default',
      category: CityCategory.INDUSTRIAL,
    });

    expect(result.ok).toBe(false);
  });
});
