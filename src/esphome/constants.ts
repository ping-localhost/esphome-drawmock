export enum Color  {
    WHITE = "white",
    BLACK = "black"
}

export enum TextAlign {
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center",
}

export class Bitmap {
    public img = new Image;

    constructor(src: string) {
        this.img.src = src;
    }
}

/* glue code */
export type Font = string;
export const COLOR_OFF: Color = Color.WHITE;
export const COLOR_ON: Color = Color.BLACK;
