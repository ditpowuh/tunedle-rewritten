import type {SoundcloudWidgetFactory} from "@/types/soundcloud";

declare global {
  interface Window {
    SC?: {
      Widget: SoundcloudWidgetFactory;
    };
  }
}
