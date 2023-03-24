import { FunctionComponent, useEffect, useRef, useState } from 'react';

export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;
export const CIRCLE_RADIUS = 48;

// Drag Snap
interface DraggableState {
  isDown: boolean;
  posX: number;
  posY: number;
  screenX: number;
  screenY: number;
}

export interface DraggableProps {
    initX: number;
    initY: number;
    color: string;
}

export const DraggableCircle: FunctionComponent<DraggableProps> = (props:DraggableProps) => {
  const trackRef = useRef<HTMLInputElement>(null);
  const [dragState, setDragState] = useState<DraggableState>({
        isDown: false,
        posX: props.initX,
        posY: props.initY,
        screenX: 0,
        screenY: 0,
  });

  const onMouseDown = (e: MouseEvent) => {
    console.log(e);
    setDragState({
        ...dragState,
        isDown: true,
        screenX: e.screenX,
        screenY: e.screenY
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    console.log("onMouseMove");
    if (!dragState.isDown) {
      return;
    }
    console.log(e);
    const shiftX = e.screenX - dragState.screenX;
    const shiftY = e.screenY - dragState.screenY;
    setDragState({
      ...dragState,
      posX: dragState.posX + shiftX,
      posY: dragState.posY + shiftY,
      screenX: e.screenX,
      screenY: e.screenY,
    });
  };

  const onMouseUp = (e: MouseEvent) => {
    console.log(e);
    setDragState({ ...dragState, isDown: false, screenX: 0, screenY: 0 });
  };

  useEffect(() => {
    // initialize the canvas to the correct size
    // add a listener for mouse movements
    if (!trackRef.current) {
      return;
    }
    console.log("Init circle");
    const track_obj: HTMLInputElement = trackRef.current;
    track_obj.addEventListener('mousemove', onMouseMove);
    return () => {
      track_obj.removeEventListener('mousemove', onMouseMove);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div 
      ref={trackRef}
      onMouseMove={() => onMouseMove}
    >
      <circle
        cx={dragState.posX}
        cy={dragState.posY}
        r={CIRCLE_RADIUS}
        stroke={props.color}
        fill={'light' + props.color}
        strokeWidth='3'
        onMouseMove={() => onMouseMove}
        onMouseDown={() => onMouseDown}
        onMouseUp={() => onMouseUp}
      />
    </div>
  );
}

/*
const SVGDrag: React.StatelessComponent<React.Props<{}>> = () => (
  <div>
    <div>
      <svg style={{ width: CANVAS_WIDTH + 'px', height: CANVAS_HEIGHT + 'px', border: '1px solid silver' }}>
        <DraggableCircle({initX:{CANVAS_WIDTH * .25}, initY:{CANVAS_HEIGHT / 2}, color:'blue'}) />
        <DraggableCircle(initX={CANVAS_WIDTH * .5}, initY={CANVAS_HEIGHT / 2}, color='pink') />
        <DraggableCircle(initX={CANVAS_WIDTH * .75}, initY={CANVAS_HEIGHT / 2}, color='green') />
      </svg>
    </div>
  </div>
);

// render both components

ReactDOM.render(
  (<div>
    <h2>React SVG drag example</h2>
    <SVGDrag />
  </div>),
  document.querySelector('#root'));
  */
