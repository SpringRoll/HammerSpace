import { ReboundEvent } from '../rebound/rebound.interface';
import { Rebound } from '../rebound/rebound';

export class SRRebound extends Rebound {
  constructor() {
    super();
  }

  protected _connect() {
    if (this._isChild) {
      // Springroll receives the connected event as a straight string
      this.dispatch({id: '', event: '', value: ''}, 'connected');
    }
    window.addEventListener('message', this._onMessage.bind(this));
  }
}