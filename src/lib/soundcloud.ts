import type {SoundcloudWidget, SoundcloudWidgetFactory} from "@/types/soundcloud";

export function createPlayerIframe(id: number, url: string): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.name = String(id);
  iframe.id = "soundcloud" + id;
  iframe.allow = "autoplay";
  iframe.height = "0";
  iframe.src = "https://w.soundcloud.com/player/?url=" + url + "&cache=" + id;
  return iframe;
}

export function getWidget(iframe: HTMLIFrameElement): SoundcloudWidget {
  return window.SC!.Widget(iframe);
}

export function widgetEvents(): SoundcloudWidgetFactory["Events"] {
  return window.SC!.Widget.Events;
}
