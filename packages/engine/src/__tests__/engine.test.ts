import { describe, it, expect } from 'vitest';
import {
  calculateTotalEws,
  calculateEwsRatio,
  calculateRos,
  recompute,
} from '../index';
import type { WindSlope, RateOfSpread } from '@firevector/schema';

describe('calculateTotalEws', () => {
  it('sums midflame wind speed and slope contribution', () => {
    expect(
      calculateTotalEws({
        eye_level_ws: 10,
        midflame_ws: 5,
        slope_contribution: 3,
        total_ews: null,
      }),
    ).toBe(8);
  });

  it('returns null when midflame_ws is null', () => {
    expect(
      calculateTotalEws({
        eye_level_ws: 10,
        midflame_ws: null,
        slope_contribution: 3,
        total_ews: null,
      }),
    ).toBeNull();
  });

  it('returns null when slope_contribution is null', () => {
    expect(
      calculateTotalEws({
        eye_level_ws: 10,
        midflame_ws: 5,
        slope_contribution: null,
        total_ews: null,
      }),
    ).toBeNull();
  });

  it('handles zero values correctly', () => {
    expect(
      calculateTotalEws({
        eye_level_ws: 0,
        midflame_ws: 0,
        slope_contribution: 0,
        total_ews: null,
      }),
    ).toBe(0);
  });
});

describe('calculateEwsRatio', () => {
  it('returns big/small when both are positive', () => {
    expect(calculateEwsRatio(10, 5)).toBe(2);
  });

  it('returns same ratio regardless of argument order', () => {
    expect(calculateEwsRatio(5, 10)).toBe(2);
  });

  it('returns 1 when values are equal', () => {
    expect(calculateEwsRatio(7, 7)).toBe(1);
  });

  it('returns null when observed is null', () => {
    expect(calculateEwsRatio(null, 5)).toBeNull();
  });

  it('returns null when predicted is null', () => {
    expect(calculateEwsRatio(10, null)).toBeNull();
  });

  it('returns null when smaller value is zero (division by zero)', () => {
    expect(calculateEwsRatio(10, 0)).toBeNull();
  });
});

describe('calculateRos', () => {
  it('multiplies observed ROS by ratio when faster', () => {
    expect(calculateRos(10, 2, 'faster')).toBe(20);
  });

  it('divides observed ROS by ratio when slower', () => {
    expect(calculateRos(10, 2, 'slower')).toBe(5);
  });

  it('returns null when observed ROS is null', () => {
    expect(calculateRos(null, 2, 'faster')).toBeNull();
  });

  it('returns null when ratio is null', () => {
    expect(calculateRos(10, null, 'faster')).toBeNull();
  });

  it('returns null when direction is null', () => {
    expect(calculateRos(10, 2, null)).toBeNull();
  });

  it('returns null when ratio is zero', () => {
    expect(calculateRos(10, 0, 'faster')).toBeNull();
  });
});

describe('recompute', () => {
  it('computes all derived fields end-to-end', () => {
    const windSlope: WindSlope = {
      observed: {
        eye_level_ws: 15,
        midflame_ws: 8,
        slope_contribution: 2,
        total_ews: null,
      },
      predicted: {
        eye_level_ws: 20,
        midflame_ws: 12,
        slope_contribution: 3,
        total_ews: null,
      },
      ews_ratio: null,
    };

    const ros: RateOfSpread = {
      observed_ros: 10,
      ros_direction: 'faster',
      calculated_ros: null,
    };

    const result = recompute(windSlope, ros);

    // observed: 8 + 2 = 10, predicted: 12 + 3 = 15
    expect(result.windSlope.observed.total_ews).toBe(10);
    expect(result.windSlope.predicted.total_ews).toBe(15);
    // ratio: 15 / 10 = 1.5
    expect(result.windSlope.ews_ratio).toBe(1.5);
    // faster: 10 * 1.5 = 15
    expect(result.ros.calculated_ros).toBe(15);
  });

  it('handles partial null inputs gracefully', () => {
    const windSlope: WindSlope = {
      observed: {
        eye_level_ws: 15,
        midflame_ws: 8,
        slope_contribution: 2,
        total_ews: null,
      },
      predicted: {
        eye_level_ws: null,
        midflame_ws: null,
        slope_contribution: null,
        total_ews: null,
      },
      ews_ratio: null,
    };

    const ros: RateOfSpread = {
      observed_ros: 10,
      ros_direction: 'faster',
      calculated_ros: null,
    };

    const result = recompute(windSlope, ros);

    expect(result.windSlope.observed.total_ews).toBe(10);
    expect(result.windSlope.predicted.total_ews).toBeNull();
    expect(result.windSlope.ews_ratio).toBeNull();
    expect(result.ros.calculated_ros).toBeNull();
  });
});
