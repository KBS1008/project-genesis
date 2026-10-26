/** CSS `object-fit: contain` visible content rectangle (presentation-only). */
export type ObjectFitContainContentRect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export function computeObjectFitContainContentRect(params: {
  readonly elementWidth: number;
  readonly elementHeight: number;
  readonly naturalWidth: number;
  readonly naturalHeight: number;
}): ObjectFitContainContentRect {
  const { elementWidth, elementHeight, naturalWidth, naturalHeight } = params;

  if (
    elementWidth <= 0 ||
    elementHeight <= 0 ||
    naturalWidth <= 0 ||
    naturalHeight <= 0
  ) {
    return Object.freeze({ x: 0, y: 0, width: 0, height: 0 });
  }

  const elementAspect = elementWidth / elementHeight;
  const imageAspect = naturalWidth / naturalHeight;

  if (imageAspect > elementAspect) {
    const width = elementWidth;
    const height = width / imageAspect;
    return Object.freeze({
      x: 0,
      y: (elementHeight - height) / 2,
      width,
      height,
    });
  }

  const height = elementHeight;
  const width = height * imageAspect;
  return Object.freeze({
    x: (elementWidth - width) / 2,
    y: 0,
    width,
    height,
  });
}
