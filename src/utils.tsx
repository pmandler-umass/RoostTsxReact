
export interface Size {
    width: number;
    height: number;
}

export interface Coordinate {
    x: number;
    y: number;
};

export type Box = Coordinate & Size;
