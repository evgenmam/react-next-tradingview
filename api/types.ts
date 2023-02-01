export interface TVTranslateResponse {
  success: boolean;
  reason2: Reason2;
  result: Result;
}

export interface Reason2 {
  warnings: Warning[];
}

export interface Warning {
  end: End;
  message: string;
  start: End;
}

export interface End {
  column: number;
  line: number;
}

export interface Result {
  IL: string;
  ilTemplate: string;
  metaInfo: MetaInfo;
}

export interface MetaPalette {
  addDefaultColor: boolean;
  colors: Record<number, { name: string }>;
  valToIndex: Record<number, number>;
}

export interface MetaInfo {
  TVScriptMetaInfoExprs: TVScriptMetaInfoExprs;
  _metainfoVersion: number;
  bands: MetaInfoBand[];
  defaults: Defaults;
  description: string;
  docs: string;
  filledAreas: FilledArea[];
  format: Format;
  graphics: MetaInfoGraphics;
  historyCalculationMayChange: boolean;
  id: string;
  inputs: Input[];
  isRGB: boolean;
  isTVScript: boolean;
  isTVScriptStub: boolean;
  is_hidden_study: boolean;
  is_price_study: boolean;
  palettes: Record<string, MetaPalette>;
  pine: Pine;
  plots: Plot[];
  scriptIdPart: string;
  shortDescription: string;
  styles: MetaInfoStyles;
  usesPrivateLib: boolean;
  warnings: string[];
}

export interface TVScriptMetaInfoExprs {
  patchMap: PatchMap;
  tree: string;
}

export interface PatchMap {
  "defaults.bands.0.value": string;
  "defaults.bands.1.value": string;
  "defaults.bands.2.value": string;
}

export interface MetaInfoBand {
  id: string;
  isHidden: boolean;
  name: string;
}

export type Palette = {
  colors: Record<
    number,
    {
      color: string;
      style: number;
      width: number;
    }
  >;
  valToIndex?: Record<number, number>;
};
export type Palettes = Record<string, Palette>;
export interface Defaults {
  bands: DefaultsBand[];
  filledAreasStyle: FilledAreasStyle;
  graphics: DefaultsGraphics;
  inputs: Inputs;
  styles: DefaultsStyles;
  palettes: Palettes;
}

export interface DefaultsBand {
  color: string;
  linestyle: number;
  linewidth: number;
  value: null;
  visible: boolean;
}

export interface FilledAreasStyle {
  [fill_0: string]: Fill;
}

export interface Fill {
  color: string;
  transparency: number;
  visible: boolean;
}

export interface DefaultsGraphics {
  dwglabels: PurpleDwglabels;
  dwglines: PurpleDwglines;
}

export interface PurpleDwglabels {
  labels: PurpleLabels;
}

export interface PurpleLabels {
  visible: boolean;
}

export interface PurpleDwglines {
  lines: PurpleLabels;
}

export interface Inputs {
  in_0: string;
  in_1: number;
  in_2: boolean;
  in_3: number;
  in_4: number;
  in_5: number;
  pineFeatures: string;
  pineId: string;
  pineVersion: string;
  text: string;
}

export interface DefaultsStyles {
  [plot: string]: TartuGecko;
}

type PlotTypesN = {
  0: "Line";
  1: "Histogram";
  3: "Cross";
  4: "Area";
  5: "Columns";
  6: "Circles";
  7: "LineWithBreaks";
  8: "AreaWithBreaks";
  9: "StepLine";
  10: "StepLineWithDiamonds";
};

export interface TartuGecko {
  linestyle: number;
  linewidth: number;
  plottype: keyof PlotTypesN;
  trackPrice: boolean;
  color: string;
  display: number;
  location: string;
  textColor: string;
  transparency: number;
}

export interface FilledArea {
  fillgaps: boolean;
  id: string;
  isHidden: boolean;
  objAId: string;
  objBId: string;
  title: string;
  type: string;
}

export interface Format {
  type: string;
}

export interface MetaInfoGraphics {
  dwglabels: FluffyDwglabels;
  dwglines: FluffyDwglines;
}

export interface FluffyDwglabels {
  labels: FluffyLabels;
}

export interface FluffyLabels {
  name: string;
  title: string;
}

export interface FluffyDwglines {
  lines: FluffyLabels;
}

export interface Input {
  defval: boolean | number | string;
  id: string;
  isHidden?: boolean;
  name: string;
  type: InputType;
  isFake?: boolean;
  group?: string;
  options?: string[];
  tooltip?: string;
  max?: number;
  min?: number;
}

export enum InputType {
  Bool = "bool",
  Integer = "integer",
  Text = "text",
}

export interface Pine {
  digest: string;
  version: string;
}

export interface Plot {
  id: string;
  type: PlotType;
  target?: string;
  palette?: string;
}

export enum PlotType {
  Alertcondition = "alertcondition",
  Colorer = "colorer",
  Line = "line",
  Shapes = "shapes",
  BarColorer = "bar_colorer",
}

export interface MetaInfoStyle {
  histogramBase: number;
  isHidden: boolean;
  joinPoints: boolean;
  size: string;
  text: string;
  title: string;
}

export interface MetaInfoStyles {
  [plot: string]: MetaInfoStyle;
}

export interface LivingstoneSouthernWhiteFacedOwl {
  histogramBase: number;
  isHidden: boolean;
  joinPoints: boolean;
  title: string;
}

export interface FluffyPlot1 {
  isHidden: boolean;
  size: string;
  text: string;
  title: string;
}

export interface Plot3 {
  text: string;
  title: string;
}

export type TVWSEvent = {
  p: any[];
  m:
    | "symbol_resolved"
    | "du"
    | "series_loading"
    | "critical_error"
    | "series_loading"
    | "timescale_update"
    | "series_completed";
};

export type Lbs = {
  bar_close_time: number;
};

export type NS = {
  d: string;
  indexes: any[];
};

export type TSOHLC = {
  i: number;
  v: [
    time: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number
  ];
};
export type TimescaleUpdate = {
  node: string;
  s: TSOHLC[];
  ns: NS;
  t: string;
  lbs: Lbs;
};

// Generated by https://quicktype.io

export type St = {
  i: number;
  v: number[];
};

export type StudyData = {
  node: string;
  st: St[];
  ns: NS;
  t: string;
};
