// this converts the input form selections to images/track info for ImageTrackViewer

import { ImageTrackViewer } from './imageTrackViewer';

const basepath = 'http://doppler.cs.umass.edu/roost/img/all_stations_v1/vr05/2010/10/02/KBUF/';
const imagefiles = [
    'KBUF20101002_104650_V03.png',
    'KBUF20101002_105634_V03.png',
    'KBUF20101002_110617_V03.png',
    'KBUF20101002_111600_V03.png',
    'KBUF20101002_112544_V03.png',
    'KBUF20101002_113527_V03.png',
    'KBUF20101002_114511_V03.png',
    'KBUF20101002_115455_V03.png',
    'KBUF20101002_120439_V03.png',
    'KBUF20101002_121422_V03.png',
    'KBUF20101002_122406_V03.png',
    'KBUF20101002_123350_V03.png', 
];


export function ImageDisplay() {
    // will take form input including data_set, radar_station, date 
    // and convert to basepath.  Load(?) names of files in that dir to send to ImageTrack.
    // find equiv track info, convert to TrackInfo type and send to ImageTrack.
    let side = 600;
    return ImageTrackViewer({ width: side, height: side}, basepath, imagefiles, []);
} 
