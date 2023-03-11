import { BoundingBox } from "./utils";

export enum TrackType {
  NONROOST = "nonroost",
  SWALLOW = "swallow-roost",
  WEATHER = "weather-roost",
  UNKNOwN = "unknown-noise-roost",
  AP = "AP-roost",
  DUPLICATE = "duplicate",
  BAD = "bad-track",
}

export interface TrackInfo {
  id: string;
  type: TrackType;
  boundary: BoundingBox;
}

// PAM maybe move drawTrack here?
