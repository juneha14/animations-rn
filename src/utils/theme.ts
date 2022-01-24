export const Palette = {
  White: `#FFFFFF`,
  Transparent: `#00000000`,
  Grey: {
    Primary: `#313335`,
  },
  Orange: {
    L2: `#FFC096`,
  },
  Yellow: {
    L1: `#FFC453`,
    Primary: `#CF9631`,
  },
  Red: {
    L2: `#F88AA2`,
    L1: `#FC766D`,
    Primary: `#DC1F58`,
  },
  Green: {
    L1: `#5BDE95`,
    Primary: `#21AF85`,
    D1: `#008060`,
    D2: `#29856E`,
  },
  Blue: {
    L1: `#4DB4F7`,
    Primary: `#38A5FF`,
    D1: `#2E72D2`,
    D2: `#2C6FCD`,
    D3: `#0870D9`,
  },
};

export const Colors = {
  SurfaceBackground: `#FAFAFA`,
  SurfaceBackgroundPressed: `#E7E8EA`,
  SurfaceForeground: Palette.White,
  SurfaceForegroundPressed: `#F5F5F5`,
  SurfaceNeutral: `#DBDDDF`,
  SurfaceWarning: `#FFD79E`,
  SurfaceCritical: `#FFD2D1`,
  SurfaceSuccess: `#AEE9D1`,
  SurfaceHighlight: `#A5E8F2`,

  Border: `#B4B9BE`,
  BorderSubdued: `#E4E5E7`,
  BorderWarning: Palette.Yellow.Primary,
  BorderCritical: `#D92800`,
  BorderSuccess: Palette.Green.D1,
  BorderPrimary: Palette.Blue.D2,

  ActionNeutral: `#EAEBEC`,
  ActionNeutralPressed: `#D9DBDE`,
  ActionWarning: `#C98700`,
  ActionCritical: `#D82C0D`,
  ActionCriticalPressed: `#AA200B`,
  ActionSuccess: Palette.Green.D1,
  ActionPrimary: Palette.Blue.D2,
  ActionPrimaryPressed: `#1A4889`,

  TextNeutral: `#202223`,
  TextSubdued: `#6C7075`,
  TextDisabled: `#8D9196`,
  TextWarning: `#916A00`,
  TextCritical: `#D92B0D`,
  TextSuccess: Palette.Green.D1,
  TextInteractive: Palette.Blue.D1,
  TextHighlight: `#007C86`,

  TextOnSurfacePrimary: Palette.White,
  TextOnSurfaceNeutral: `#323333`,
  TextOnSurfaceWarning: `#432F00`,
  TextOnSurfaceCritical: `#610001`,
  TextOnSurfaceSuccess: `#003B2A`,
  TextOnSurfaceHighlight: `#00393E`,

  IconOnPrimary: Palette.White,
  IconNeutral: `#5E5E63`,
  IconSubdued: `#8B9195`,
  IconDisabled: `#B8BFC4`,
  IconWarning: `#CF9900`,
  IconCritical: `#EB300F`,
  IconSuccess: `#009671`,
  IconInteractive: `#2D72D2`,
  IconHighlight: `#00A1AD`,

  SurfaceDecorativeYellow: `#FFEECC`,
  IconDecorativeYellow: `#D9A70E`,
  TextDecorativeYellow: `#A8810B`,
  SurfaceDecorativeRed: `#F5C7D4`,
  IconDecorativeRed: Palette.Red.Primary,
  TextDecorativeRed: Palette.Red.Primary,
  SurfaceDecorativeGreen: `#C0E7DD`,
  IconDecorativeGreen: Palette.Green.D2,
  TextDecorativeGreen: Palette.Green.D2,
  SurfaceDecorativeBlue: `#C1DDF5`,
  IconDecorativeBlue: Palette.Blue.D3,
  TextDecorativeBlue: Palette.Blue.D3,
  SurfaceDecorativeOrange: `#F7DBCF`,
  IconDecorativeOrange: `#C87700`,
  TextDecorativeOrange: `#B26A00`,

  Transparent: Palette.Transparent,

  SignaturePadPenColor: Palette.White,
  NumericKeyboardButtonBackground: Palette.White,
  NumericKeyboardImageButtonBackground: `#AEB3BE`,

  None: undefined,
};

type Space = 0.5 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 13 | 16;
const spacing = (space: Space): number => 8 * space;
export const Spacing = {
  defaultMargin: spacing(2),
  xl: spacing(3),
  l: spacing(2),
  m: spacing(1),
  s: spacing(0.5),
};
