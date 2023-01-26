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

export interface Defaults {
  bands: DefaultsBand[];
  filledAreasStyle: FilledAreasStyle;
  graphics: DefaultsGraphics;
  inputs: Inputs;
  styles: DefaultsStyles;
}

export interface DefaultsBand {
  color: string;
  linestyle: number;
  linewidth: number;
  value: null;
  visible: boolean;
}

export interface FilledAreasStyle {
  fill_0: Fill;
  fill_1: Fill;
  fill_2: Fill;
  fill_3: Fill;
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
  plot_0: TartuGecko;
  plot_1: TartuGecko;
  plot_10: TartuGecko;
  plot_12: TartuGecko;
  plot_14: TartuGecko;
  plot_15: TartuGecko;
  plot_16: PurplePlot1;
  plot_17: PurplePlot1;
  plot_18: TartuGecko;
  plot_19: TartuGecko;
  plot_20: TartuGecko;
  plot_21: TartuGecko;
  plot_22: TartuGecko;
  plot_24: TartuGecko;
  plot_25: TartuGecko;
  plot_26: TartuGecko;
  plot_28: TartuGecko;
  plot_4: TartuGecko;
  plot_6: TartuGecko;
  plot_7: TartuGecko;
  plot_8: TartuGecko;
  plot_9: TartuGecko;
}

export interface TartuGecko {
  color: string;
  display: number;
  linestyle: number;
  linewidth: number;
  plottype: number;
  trackPrice: boolean;
  transparency: number;
}

export interface PurplePlot1 {
  color: string;
  display: number;
  location: string;
  plottype: string;
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
}

export enum PlotType {
  Alertcondition = "alertcondition",
  Colorer = "colorer",
  Line = "line",
  Shapes = "shapes",
}

export interface MetaInfoStyles {
  plot_0: LivingstoneSouthernWhiteFacedOwl;
  plot_1: LivingstoneSouthernWhiteFacedOwl;
  plot_10: LivingstoneSouthernWhiteFacedOwl;
  plot_12: LivingstoneSouthernWhiteFacedOwl;
  plot_14: LivingstoneSouthernWhiteFacedOwl;
  plot_15: LivingstoneSouthernWhiteFacedOwl;
  plot_16: FluffyPlot1;
  plot_17: FluffyPlot1;
  plot_18: LivingstoneSouthernWhiteFacedOwl;
  plot_19: LivingstoneSouthernWhiteFacedOwl;
  plot_20: LivingstoneSouthernWhiteFacedOwl;
  plot_21: LivingstoneSouthernWhiteFacedOwl;
  plot_22: LivingstoneSouthernWhiteFacedOwl;
  plot_24: LivingstoneSouthernWhiteFacedOwl;
  plot_25: LivingstoneSouthernWhiteFacedOwl;
  plot_26: LivingstoneSouthernWhiteFacedOwl;
  plot_28: LivingstoneSouthernWhiteFacedOwl;
  plot_33: Plot3;
  plot_34: Plot3;
  plot_35: Plot3;
  plot_36: Plot3;
  plot_37: Plot3;
  plot_38: Plot3;
  plot_39: Plot3;
  plot_4: LivingstoneSouthernWhiteFacedOwl;
  plot_6: LivingstoneSouthernWhiteFacedOwl;
  plot_7: LivingstoneSouthernWhiteFacedOwl;
  plot_8: LivingstoneSouthernWhiteFacedOwl;
  plot_9: LivingstoneSouthernWhiteFacedOwl;
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
