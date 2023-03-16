// Converts the input form selections to images/track info for ImageTrackViewer
import { BoundingBox } from "./utils";
import { TrackInfo, TrackType } from "./tracks";
import { DataIdInfo } from "./InputForm";

const basepath =
  "http://doppler.cs.umass.edu/roost/img/all_stations_v1/vr05/2010/10/02/KBUF/";

const imagefiles = [
  "KBUF20101002_104650_V03.png",
  "KBUF20101002_105634_V03.png",
  "KBUF20101002_110617_V03.png",
  "KBUF20101002_111600_V03.png",
  "KBUF20101002_112544_V03.png",
  "KBUF20101002_113527_V03.png",
  "KBUF20101002_114511_V03.png",
  "KBUF20101002_115455_V03.png",
  "KBUF20101002_120439_V03.png",
  "KBUF20101002_121422_V03.png",
  "KBUF20101002_122406_V03.png",
  "KBUF20101002_123350_V03.png",
];

const track_file_data = `49,KBUF20101002_114511_V03,32,0.334,13.66,356.411285,17.641350,-80.48,42.681343,8820.674896,20101002_074511
49,KBUF20101002_115455_V03,41,0.180,17.84,344.470322,33.339212,-80.46,42.735462,16669.606073,20101002_075455
49,KBUF20101002_120439_V03,51,0.224,32.12,337.144055,41.153357,-80.37,42.769709,20576.678554,20101002_080439
25,KBUF20101002_104650_V03,-27,0.300,20.24,410.855072,21.005432,-80.44,42.436964,10502.716064,20101002_064650
25,KBUF20101002_105634_V03,-17,0.104,17.24,426.475745,30.033605,-80.45,42.366398,15016.802413,20101002_065634
30,KBUF20101002_104650_V03,-27,0.115,24.16,240.119476,21.407997,-80.43,43.205564,10703.998566,20101002_064650
30,KBUF20101002_105634_V03,-17,0.542,45.66,241.766117,28.581963,-80.30,43.200035,14290.981391,20101002_065634
31,KBUF20101002_105634_V03,-17,0.240,128.52,302.917145,15.640345,-79.79,42.930661,7820.172310,20101002_065634
31,KBUF20101002_110617_V03,-7,0.196,136.29,302.102303,24.174877,-79.74,42.934755,12087.438433,20101002_070617
40,KBUF20101002_111600_V03,3,0.433,141.31,191.494781,6.761261,-79.72,43.432774,3380.630493,20101002_071600
40,KBUF20101002_112544_V03,12,0.184,142.61,181.747630,19.815807,-79.71,43.476704,9907.903685,20101002_072544
44,KBUF20101002_111600_V03,3,0.100,54.00,405.777130,15.034122,-80.23,42.462693,7517.060757,20101002_071600
44,KBUF20101002_112544_V03,12,-1.000,54.00,405.777130,29.344122,-80.23,42.462693,14672.060757,20101002_072544
44,KBUF20101002_113527_V03,22,0.118,45.99,440.336598,30.089811,-80.28,42.306520,15044.905723,20101002_073527
24,KBUF20101002_104650_V03,-27,0.468,26.70,200.117554,30.465595,-80.42,43.385773,15232.797623,20101002_064650
26,KBUF20101002_104650_V03,-27,0.268,379.35,389.726135,6.515816,-78.25,42.543735,3257.907867,20101002_064650
28,KBUF20101002_104650_V03,-27,0.190,21.31,169.181061,23.401266,-80.46,43.524466,11700.633049,20101002_064650
29,KBUF20101002_104650_V03,-27,0.131,130.46,461.256775,6.596132,-79.76,42.218144,3298.066139,20101002_064650
32,KBUF20101002_105634_V03,-17,0.199,119.18,415.661316,2.798462,-79.84,42.422721,1399.230957,20101002_065634
33,KBUF20101002_105634_V03,-17,0.118,113.62,416.005157,2.900951,-79.87,42.420842,1450.475693,20101002_065634
35,KBUF20101002_105634_V03,-17,0.102,183.39,394.337402,18.603722,-79.45,42.521793,9301.860809,20101002_065634
36,KBUF20101002_110617_V03,-7,0.546,231.23,277.442596,10.921501,-79.16,43.049358,5460.750580,20101002_070617
37,KBUF20101002_110617_V03,-7,0.521,375.46,275.701721,31.233337,-78.27,43.057034,15616.668701,20101002_070617
38,KBUF20101002_110617_V03,-7,0.146,211.40,465.704651,6.809130,-79.27,42.201494,3404.564857,20101002_070617
39,KBUF20101002_111600_V03,3,0.657,107.05,420.989075,6.774944,-79.91,42.398008,3387.472153,20101002_071600
45,KBUF20101002_113527_V03,22,0.378,220.18,79.855896,6.925827,-79.23,43.938277,3462.913513,20101002_073527
46,KBUF20101002_113527_V03,22,0.160,60.48,524.619141,16.131533,-80.18,41.928360,8065.766335,20101002_073527
50,KBUF20101002_115455_V03,41,0.843,311.25,93.130310,10.022629,-78.67,43.879589,5011.314392,20101002_075455
54,KBUF20101002_115455_V03,41,0.113,245.16,245.483551,6.967018,-79.07,43.193476,3483.509064,20101002_075455
55,KBUF20101002_120439_V03,51,0.292,412.82,241.381958,10.957870,-78.04,43.210332,5478.935242,20101002_080439
56,KBUF20101002_120439_V03,51,0.213,441.92,279.912903,11.199005,-77.87,43.035708,5599.502563,20101002_080439
57,KBUF20101002_120439_V03,51,0.152,136.81,294.378937,22.337875,-79.74,42.969541,11168.937683,20101002_080439
58,KBUF20101002_121422_V03,61,0.257,207.22,310.244476,11.119476,-79.30,42.901092,5559.738159,20101002_081422
59,KBUF20101002_121422_V03,61,0.164,12.90,198.658844,21.062386,-80.51,43.391056,10531.192780,20101002_081422
60,KBUF20101002_121422_V03,61,0.149,13.48,374.288849,14.913994,-80.48,42.600884,7456.996918,20101002_081422
61,KBUF20101002_121422_V03,61,0.130,140.41,334.041016,7.413513,-79.71,42.791235,3706.756592,20101002_081422`;

export function getImagePath(input: DataIdInfo) {
  console.log(input); // TODO will be used to choose data
  return basepath;
}

export function loadImages(image_path: string) {
  console.log(image_path); // TODO will be used to choose data
  return imagefiles;
}

export function loadTracks(input: DataIdInfo, image_names: string[]) {
  console.log(input); // will be used to choose data
  var track_data: TrackInfo[][] = [];
  // create an empty set of tracks for each image
  for (var i = 0; i <= image_names.length; i++) {
    var image_tracks: TrackInfo[] = [];
    track_data.push(image_tracks);
  }

  // create a TrackInfo for each line and add it to the corresponding image.
  // csv file format:
  // track_id,filename,from_sunrise,det_score,x,y,r,lon,lat,radius,local_time
  var track_lines: string[] = track_file_data.split("\n");
  for (var this_line of track_lines) {
    var tokens = this_line.split(",");
    // find index of image
    let filename = tokens[1] + ".png";
    let fileindex = image_names.indexOf(filename);
    if (fileindex < 0) {
      console.log("ERROR file not found: " + filename);
      continue;
    }
    // create TrackInfo
    let new_box: BoundingBox = {
      x: parseFloat(tokens[4]),
      y: parseFloat(tokens[5]),
      width: parseFloat(tokens[6]),
      height: parseFloat(tokens[6]),
    };
    let new_track: TrackInfo = {
      id: tokens[0],
      type: TrackType.SWALLOW,
      boundary: new_box,
    };
    track_data[fileindex].push(new_track);
  }
  return track_data;
}
