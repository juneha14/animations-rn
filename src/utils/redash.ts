export const snapPoints = (
  offset: number,
  velocity: number,
  snapPoints: number[]
) => {
  "worklet";

  const comp = offset + velocity * 0.1;
  const deltas = snapPoints.map((p) => Math.abs(comp - p));
  const min = Math.min.apply(null, deltas);
  return snapPoints.filter((p) => Math.abs(comp - p) === min)[0];
};

export const clamp = (
  value: number,
  lowerBound: number,
  upperBound: number
) => {
  "worklet";
  return Math.min(Math.max(lowerBound, value), upperBound);
};
