import type {
  WindSlopeColumn,
  WindSlope,
  RateOfSpread,
  RosDirection,
} from '@firevector/schema';

/**
 * Calculate Total Effective Wind Speed for a single column.
 * EWS = midflame wind speed + slope contribution
 */
export function calculateTotalEws(column: WindSlopeColumn): number | null {
  if (column.midflame_ws == null || column.slope_contribution == null) {
    return null;
  }
  return column.midflame_ws + column.slope_contribution;
}

/**
 * Calculate the EWS Ratio between observed and predicted.
 * Ratio = max(obs, pred) / min(obs, pred)
 */
export function calculateEwsRatio(
  observedTotalEws: number | null,
  predictedTotalEws: number | null,
): number | null {
  if (observedTotalEws == null || predictedTotalEws == null) return null;
  const big = Math.max(observedTotalEws, predictedTotalEws);
  const small = Math.min(observedTotalEws, predictedTotalEws);
  if (small === 0) return null;
  return big / small;
}

/**
 * Calculate projected Rate of Spread.
 * If faster: observed_ros * ews_ratio
 * If slower: observed_ros / ews_ratio
 */
export function calculateRos(
  observedRos: number | null,
  ewsRatio: number | null,
  direction: RosDirection | null,
): number | null {
  if (observedRos == null || ewsRatio == null || direction == null) return null;
  if (ewsRatio === 0) return null;
  return direction === 'faster'
    ? observedRos * ewsRatio
    : observedRos / ewsRatio;
}

/**
 * Recompute all derived fields from current inputs.
 * Returns updated windSlope and ros with calculated values.
 */
export function recompute(
  windSlope: WindSlope,
  ros: RateOfSpread,
): { windSlope: WindSlope; ros: RateOfSpread } {
  const observedTotalEws = calculateTotalEws(windSlope.observed);
  const predictedTotalEws = calculateTotalEws(windSlope.predicted);
  const ewsRatio = calculateEwsRatio(observedTotalEws, predictedTotalEws);
  const calculatedRos = calculateRos(
    ros.observed_ros,
    ewsRatio,
    ros.ros_direction,
  );

  return {
    windSlope: {
      observed: { ...windSlope.observed, total_ews: observedTotalEws },
      predicted: { ...windSlope.predicted, total_ews: predictedTotalEws },
      ews_ratio: ewsRatio,
    },
    ros: { ...ros, calculated_ros: calculatedRos },
  };
}
