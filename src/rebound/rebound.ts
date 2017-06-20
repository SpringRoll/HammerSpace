import { ReboundEvent } from './rebound.interface';
import { ClientType } from '../client/client.interface';

export class Rebound {
  private _iframeId: string;
  private _iframe: HTMLIFrameElement;
  private _reciever: Window;
  private _isChild: boolean;
  private _randId: string;
  private _client: ClientType;

  constructor() {
    this._isChild = !window.frames.length;
    if (this._isChild) {
      this._randId = 'Rebound_' + (Math.random()).toString();
      this._reciever = parent;
      this.dispatch({event: 'connected', id: this._randId});
    }
    window.addEventListener('message', this._onMessage.bind(this));
  }

  public setID(id: string) {
    if (!this._isChild) {
      this._iframeId = id;
      this._iframe = (<HTMLIFrameElement> document.getElementById(id));
      this._reciever = this._iframe.contentWindow;

      this._iframe.focus();
    }
  }

  public setClient(client: ClientType) {
    if (typeof client !== 'undefined' && typeof this._client === 'undefined') {
      this._client = client;
      client.setRebound(this);
    }
  }

  public dispatch(event: ReboundEvent) {
    if (typeof this._reciever === 'undefined') {
      return;
    }

    if (!this._isChild) {
      this._reciever.focus();
    }

    event.id = this._randId;

    this._reciever.postMessage(event, '*');
  }


  private _onMessage(e: MessageEvent) {
    if (typeof e.data.id === 'undefined' || typeof this._client === 'undefined') {
      return;
    }
    if (typeof this._randId === 'undefined' && e.data.event === 'connected') {
      this._randId = e.data.id;
    }
    if (e.data.id === this._randId) {
      this._client.dispatch(e.data.event, e.data.value, true);
    }
  }
}
