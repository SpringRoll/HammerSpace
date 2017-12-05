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

 /**
   * if a proper random id is set and client is also setup a dispatch event will
   * be set to client and the proper data will be passed along
   * @protected
   * @method _onMessage
   * @param e object that contains the info of a postMessage event from rebound
   */
  protected _onMessage(e: MessageEvent) {
    // TODO: This function will fail if it receives a connect event, write a unit test and check for a connect event.

    // TODO: Messages from Springroll Container come as JSON, but not as an event object but as a string.
    // I'm using a shorthand statement for readability however if data is not a string then this line will fail.
    let data;
    // There's two possible outcomes of this function, this variable
    // simple reduces the complexity of the if statement at the end.
    // Here I'm instantiating the variable for later use.
    let sendData;

    if (typeof e === 'object' && e.data === 'connected') {
      data = {event: 'connected', data: 'connected'};
    } else if (typeof e === 'object' && typeof e.data !== 'undefined' && e.data !== 'connected') {
      //Springroll always sends a string as the payload.
      data = JSON.parse(e.data);
    }

    // TODO: This also has to be changed, moved to a function elsewhere to tell
    // Hammerspace that it's not communicating with Hammerspace
    if (data.id === 'undefined') {
      this._isHammerClient = false;
    }

    // TODO: Return statement should not be here, it should be the first line of code in the function
    if ( (this._isHammerClient) && (typeof data.id === 'undefined' || typeof this._client === 'undefined') ) {
      return;
    }

    if (typeof this._randId === 'undefined' && data.event === 'connected') {
      this._randId = data.id;
    }

    if (data.id === this._randId && this._isHammerClient) {
      sendData = data;
    } else if (data.event !== 'connected') {
      // Sanitizing the send object to Hammerspace convention, Springroll Container sends different keys.
      sendData = { event: data.type, value: data.data };
    } else if (data.event === 'connected') {
      sendData = data;
    }

    this._client.dispatch(sendData.event, sendData.value, true);
  }
}
