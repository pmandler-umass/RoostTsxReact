// Display Radar image
import { BackgroundImage, Center, Text, SimpleGrid } from '@mantine/core';
import { useEffect, useState } from 'react';
  

const images = [
    'http://doppler.cs.umass.edu/roost/img/all_stations_v1/vr05/1997/07/02/KBUF/KBUF19970702_091359.png',
    'http://doppler.cs.umass.edu/roost/img/all_stations_v1/vr05/1997/07/02/KBUF/KBUF19970702_092541.png',
    'http://doppler.cs.umass.edu/roost/img/all_stations_v1/vr05/1997/07/02/KBUF/KBUF19970702_093132.png',
    'http://doppler.cs.umass.edu/roost/img/all_stations_v1/vr05/1997/07/02/KBUF/KBUF19970702_110527.png'
    ];


export function ImageDisplay() {
    const radar_px = 400
    // radar comes in 'vr' and 'dz' 
    const vr_image = images[0];
    const dx_image = vr_image.replace('/vr', '/dz');
    const [mousePosX, setMousePosX] = useState(0);
    const [mousePosY, setMousePosY] = useState(0);

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

    return (
        <SimpleGrid cols={2}>
            <div onMouseMove={()=>handleMouseMove}>
                <BackgroundImage
                    src={vr_image}
                    radius="sm"
                    miw={radar_px} 
                    mih={radar_px}
                >
                    <Center p="md">
                        <Text color="#fff">
                        Add rectangles
                        </Text>
                    </Center>
                </BackgroundImage>
            </div>

            <BackgroundImage
                src={dx_image}
                radius="sm"
                miw={radar_px} mih={radar_px}
            >
                <Center p="md">
                    <Text color="#fff">
                    Same rectangles
                    </Text>
                </Center>
            </BackgroundImage>
            <Text> Radar </Text>
            <Text> Doppler Radar </Text>
            <div>
               The mouse is at position
            </div>
            <div>
                {String(mousePosX)+' , '+String(mousePosY)}
            </div>
        </SimpleGrid>
    );
} 
