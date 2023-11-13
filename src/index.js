import events from "events";
import queryStringLib from "query-string";
import { config, errors, EVENTS } from "./constants";
import { closeSVGIcon } from "./assets/svg";
import { getCSS } from "./assets/css";
import { version } from "../package.json";

const ALL_EVENTS = "*";
const ERROR = "spritz_ERROR";

function generateConfig(options) {
  let environment = options.environment ?? "STAGING",
    width = options.width ?? "100%",
    height = options.height ?? "100%";

  if (!options.integrationKey) throw errors.ENTER_API_KEY;

  const envConfig = config.ENVIRONMENT[environment];

  const queryString = queryStringLib.stringify(
    { integrationKey: options.integrationKey, widgetVersion: version },
    {
      arrayFormat: "comma",
    }
  );

  if (options.widgetWidth) width = options.widgetWidth;
  if (options.widgetHeight) height = options.widgetHeight;

  return {
    width,
    height,
    url: `${envConfig.url}?${queryString}`,
  };
}

function setStyle(themeColor, width, height) {
  let style = document.createElement("style");
  style.innerHTML = getCSS(themeColor, height, width);
  let modal = document.getElementById("spritzWidget");
  if (modal) modal.appendChild(style);
}

class SpritzSDK {
  constructor(options, provider) {
    console.log("Initializing spritzSDK", options);
    this.options = options;
    this.provider = options.prover || provider;
    this.eventEmitter = new events.EventEmitter();
  }

  on(type, cb) {
    if (type === ALL_EVENTS) {
      for (let eventName in EVENTS) {
        this.eventEmitter.on(EVENTS[eventName], cb);
      }
    }
    if (EVENTS[type]) this.eventEmitter.on(type, cb);
    if (type === ERROR) this.eventEmitter.on(ERROR, cb);
  }

  init() {
    try {
      this.buildModal();
      this.attachListener();
      this.eventEmitter.emit(EVENTS.SPRITZ_WIDGET_INITIALISED, {
        status: true,
        eventName: EVENTS.SPRITZ_WIDGET_INITIALISED,
      });
    } catch (e) {
      throw e;
    }
  }

  buildModal() {
    let { url, width, height } = generateConfig(this.options);
    let wrapper = document.createElement("div");
    wrapper.id = "spritzWidget";
    wrapper.innerHTML = `
            <div class="spritz_modal-overlay" id="spritz_modal-overlay"></div>
            <div class="spritz_modal" id="spritz_modal">
                <div class="spritz_modal-content">
                  <span class="spritz_close">${closeSVGIcon}</span>
                  <div class="spritzContainer">
                      <iframe id="spritzWidgetFrame" allow="camera;microphone;fullscreen;payment" scrolling="no" allowFullScreen src="${url}" style="width: ${width}; height: ${height}"></iframe>
                  </div>
                </div>
              </div>`;
    let container = document.getElementsByTagName("body");
    if (!container) container = document.getElementsByTagName("html");
    if (!container) container = document.getElementsByTagName("div");
    container[0].appendChild(wrapper);
    setStyle(this.options.themeColor, width, height);
    let modal = document.getElementById("spritzWidget");
    let span = document.getElementsByClassName("spritz_close")[0];

    //Prevent background scrolling when overlay appears
    document.documentElement.style.overflow = "hidden";
    document.body.scroll = "no";

    if (modal && modal.style) modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = () => {
      return this.close();
    };
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
      if (event.target === document.getElementById("spritz_modal-overlay"))
        this.close();
    };
  }

  attachListener() {
    if (window.addEventListener) {
      window.addEventListener("message", this.handleMessage.bind(this));
    } else {
      window.attachEvent("onmessage", this.handleMessage.bind(this));
    }
  }

  close() {
    let modal = document.getElementById("spritzWidget");
    if (modal && modal.style) {
      modal.style.display = "none";
      modal.innerHTML = "";
      modal.remove();
    }
  }

  handleClose() {
    //enable background scrolling when overlay appears
    document.documentElement.style.overflow = "scroll";
    document.body.scroll = "yes";
    let modal = document.getElementById("spritzWidget");
    if (modal && modal.style) {
      modal.style.display = "none";
      modal.innerHTML = "";
      modal.remove();
    }
  }

  handleMessage(event) {
    const environment = Object.values(config.ENVIRONMENT).find(
      (env) => env.url === event.origin
    );

    if (!environment) return;
    if (!event.data) return;

    console.log("[spritzWidget] handleMessage", event);

    if (event.data && event.data.jsonrpc === "2.0" && this.provider) {
      const iframeElement = document.getElementById("spritzWidgetFrame");
      if (!iframeElement.contentWindow) return;

      this.provider.sendAsync(event.data, (error, result) => {
        console.log("[spritzWidget] response", { error, result });

        if (error) {
          iframeElement.contentWindow.postMessage(
            {
              ...result,
              error,
            },
            event.origin
          );
        } else {
          iframeElement.contentWindow.postMessage(result, event.origin);
        }
      });
    }

    switch (event.data.event_id) {
      case EVENTS.SPRITZ_WIDGET_CLOSE: {
        this.eventEmitter.emit(EVENTS.SPRITZ_WIDGET_CLOSE, {
          status: true,
          eventName: EVENTS.SPRITZ_WIDGET_CLOSE,
        });
        this.handleClose();
        break;
      }
      case EVENTS.SPRITZ_WIDGET_OPEN: {
        this.eventEmitter.emit(EVENTS.SPRITZ_WIDGET_OPEN, {
          status: true,
          eventName: EVENTS.SPRITZ_WIDGET_OPEN,
        });
        break;
      }
      default: {
      }
    }
  }
}

export default SpritzSDK;
