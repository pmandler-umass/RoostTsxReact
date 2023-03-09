// display image and track
import { BackgroundImage, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import TracksCanvas from './canvas';
import { TrackInfo } from './tracks';
import {Size} from './utils';
// import './styles.css';


// imageSeries string[], tracks = TrackInfo[], updateTrackInfo(), trackTypes)
// updateTrackInfo: (arg: string) => void
export function ImageTrackViewer(elementSize: Size, basepath: string, imageSeries: string[], tracks: TrackInfo[]) {
    const imagePath = basepath+imageSeries[0];
    const [mousePosX, setMousePosX] = useState(0);
    const [mousePosY, setMousePosY] = useState(0);
   //const canvasRef = useRef<HTMLCanvasElement>(null);
    console.log(tracks.length);

    const handleMouseMove = (event: MouseEvent) => {
        if (event.target !== null) {
            console.log(event.target);
        }
        setMousePosX(event.clientX - 0); //event.target.offsetLeft;);
        setMousePosY(event.clientY - 0); //event.target.offsetTop);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener(
                'mousemove',
                handleMouseMove
            );
        };
    }, []);

    // PAM when return to 2 radars, may want to use <SimpleGrid cols={2}> from Mantine
    return (
        <div>
            <div onMouseMove={()=>handleMouseMove}>
                <BackgroundImage
                    src={imagePath}
                    radius="xs"
                    miw={elementSize.width} 
                    mih={elementSize.height}
                >
                    {TracksCanvas(elementSize)}
                </BackgroundImage>
            </div>
            <Text> Radar </Text>
            <div>
                {'Mouse: '+String(mousePosX)+' , '+String(mousePosY)}
            </div>
        </div>
    );
} 
