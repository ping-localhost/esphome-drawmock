import {sprintf} from 'printj';
import {Bitmap, Color, COLOR_ON, Font, TextAlign} from "./constants.ts";
import {strftime} from "./modules/strftime.ts";

export class Gfx {
    private ctx: CanvasRenderingContext2D;
    private readonly width: number;
    private readonly height: number;

    constructor(canvas: HTMLCanvasElement, width = 296, height = 128) {
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;

        canvas.height = this.height;
        canvas.width = this.width;
        canvas.style.height = this.height + "px";
        canvas.style.width = this.width + "px";

        this.ctx.textBaseline = "top";
    }

    private getFontSizeToFit(text: string, fontFace: string, maxWidth: number) {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = `1px ${fontFace}`;
        return maxWidth / ctx.measureText(text).width;
    }

    public print(x: number, y: number, font: Font, align: TextAlign, text: string) {
        this.ctx.save()

        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);

        this.ctx.restore()
    }

    public printf(x: number, y: number, font: Font, text: string, ...args: any[]) {
        this.print(x, y, font, TextAlign.LEFT, sprintf(text, ...args))
    }

    public strftime(x: number, y: number, font: Font, text: string, date?: Date) {
        this.print(x, y, font, TextAlign.LEFT, strftime.parse(text, date))
    }

    public fill(color: Color) {
        this.ctx.save()

        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.restore()
    }

    public clear() {
        this.ctx.save()

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.restore()
    }

    public draw_pixel_at(x: number, y: number, color: Color) {
        this.ctx.save()

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, 1, 1);

        this.ctx.restore()
    }

    public rectangle(x1: number, y1: number, width: number, height: number, color: Color) {
        this.ctx.save()

        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x1, y1, width, height);

        this.ctx.restore()
    }

    public filled_rectangle(x1: number, y1: number, width: number, height: number, color: Color) {
        this.ctx.save()

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x1, y1, width, height);

        this.ctx.restore()
    }

    public image(x: number, y: number, image: Bitmap) {
        this.ctx.drawImage(image.img, x, y);
    }

    public line(x1: number, y1: number, x2: number, y2: number, color: Color) {
        this.ctx.save()

        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        this.ctx.restore()
    }

    public horizontal_line(x: number, y: number, width: number, color: Color = COLOR_ON) {
        this.line(x, y, x + width, y, color)
    }

    public verical_line(x: number, y: number, height: number, color: Color = COLOR_ON) {
        this.line(x, y, x, y + height, color)
    }

    public circle(centerX: number, centerY: number, radius: number, color: Color = COLOR_ON) {
        this.ctx.save()

        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.ctx.strokeStyle = color;
        this.ctx.stroke()

        this.ctx.restore()
    }

    public filled_circle(centerX: number, centerY: number, radius: number, color: Color = COLOR_ON) {
        this.ctx.save()

        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        this.ctx.restore()
    }

    public get_width(): number {
        return this.width
    }

    public get_height(): number {
        return this.height
    }

}

export function id<T>(el: T): T {
    return el;
}
