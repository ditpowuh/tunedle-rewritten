export type SoundcloudSound = {
  policy: string;
  artwork_url: string | null;
  duration: number;
  genre: string;
  release_date: string;
};

export type SoundcloudProgressEvent = {
  currentPosition: number;
};

export type SoundcloudWidget = {
  bind: (event: string, handler: (event?: SoundcloudProgressEvent) => void) => void;
  getCurrentSound: (callback: (sound: SoundcloudSound) => void) => void;
  seekTo: (ms: number) => void;
  play: () => void;
  pause: () => void;
};

export type SoundcloudWidgetFactory = ((element: string | HTMLIFrameElement) => SoundcloudWidget) & {
  Events: {
    READY: string;
    PLAY: string;
    PAUSE: string;
    PLAY_PROGRESS: string;
  };
};
