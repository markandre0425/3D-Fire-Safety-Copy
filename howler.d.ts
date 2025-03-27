declare module 'howler' {
  export class Howl {
    constructor(options: {
      src: string[];
      loop?: boolean;
      volume?: number;
      autoplay?: boolean;
      preload?: boolean;
      html5?: boolean;
      rate?: number;
    });
    
    play(): void;
    pause(): void;
    stop(): void;
    mute(muted: boolean): void;
    volume(volume: number): void;
    seek(position: number): void;
    loop(loop: boolean): void;
    state(): string;
    playing(): boolean;
    unload(): void;
  }
  
  export class Howler {
    static volume(volume: number): void;
    static mute(muted: boolean): void;
  }
}