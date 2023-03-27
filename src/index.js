import events from "events";
import queryStringLib from "query-string";
import { config, errorsLang, EVENTS } from "./constants";
import { closeSVGIcon } from "./assets/svg";
import { getCSS } from "./assets/css";
import { version } from "../package.json";

const eventEmitter = new events.EventEmitter();

function spritzSDK(partnerData, provider) {
  this.sdkVersion = version;
  this.partnerData = partnerData;
  this.EVENTS = EVENTS;
  this.ALL_EVENTS = "*";
  this.ERROR = "spritz_ERROR";
  this.provider = provider;
}

spritzSDK.prototype.on = function (type, cb) {
  if (type === this.ALL_EVENTS) {
    for (let eventName in EVENTS) {
      eventEmitter.on(EVENTS[eventName], cb);
    }
  }
  if (EVENTS[type]) eventEmitter.on(type, cb);
  if (type === this.ERROR) eventEmitter.on(this.ERROR, cb);
};
spritzSDK.prototype.init = function () {
  this.modal(this);
};
spritzSDK.prototype.close = async function () {
  let modal = document.getElementById("spritzWidget");
  if (modal && modal.style) {
    modal.style.display = "none";
    modal.innerHTML = "";
    await modal.remove();
  }
};

spritzSDK.prototype.modal = async function () {
  try {
    if (this.partnerData) {
      let { url, width, height, partnerData } = await generateURL({
        ...this.partnerData,
        sdkVersion: this.sdkVersion,
      });
      let wrapper = document.createElement("div");
      wrapper.id = "spritzWidget";
      wrapper.innerHTML = `<div class="spritz_modal-overlay" id="spritz_modal-overlay"></div><div class="spritz_modal" id="spritz_modal"><div class="spritz_modal-content"><span class="spritz_close">${closeSVGIcon}</span><div class="spritzContainer"><iframe id="spritzWidgetFrame" allow="camera;microphone;fullscreen;payment" allowFullScreen src="${url}" style="width: ${width}; height: ${height}"></iframe></div></div></div>`;
      let container = document.getElementsByTagName("body");
      if (!container) container = document.getElementsByTagName("html");
      if (!container) container = document.getElementsByTagName("div");
      await container[0].appendChild(wrapper);
      await setStyle(this.partnerData.themeColor, width, height);
      let modal = document.getElementById("spritzWidget");
      let span = document.getElementsByClassName("spritz_close")[0];

      //Prevent background scrolling when overlay appears
      document.documentElement.style.overflow = "hidden";
      document.body.scroll = "no";

      if (modal && modal.style) modal.style.display = "block";
      this.isInitialised = true;
      eventEmitter.emit(EVENTS.SPRITZ_WIDGET_INITIALISED, {
        status: true,
        eventName: EVENTS.SPRITZ_WIDGET_INITIALISED,
      });
      // When the user clicks on <span> (x), close the modal
      span.onclick = () => {
        return this.close();
      };
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = (event) => {
        if (event.target === document.getElementById("spritz_modal-overlay"))
          this.close();
      };
      if (window.addEventListener)
        window.addEventListener("message", (e) => handleMessage(e, this));
      else window.attachEvent("onmessage", (e) => handleMessage(e, this));
    }
  } catch (e) {
    throw e;
  }
};

async function generateURL(configData) {
  let partnerData = {},
    environment = "development",
    queryString = "",
    width = "100%",
    height = "100%";

  if (configData) {
    if (configData.apiKey) {
      if (configData.environment) {
        if (config.ENVIRONMENT[configData.environment])
          environment = config.ENVIRONMENT[configData.environment].NAME;
      }
      try {
        environment = environment.toUpperCase();
        Object.keys(configData).map((key) => {
          if (configData[key] instanceof Object) {
            partnerData[key] = JSON.stringify(configData[key]);
          } else partnerData[key] = configData[key];
        });
        queryString = queryStringLib.stringify(partnerData, {
          arrayFormat: "comma",
        });
      } catch (e) {
        throw e;
      }
    } else throw errorsLang.ENTER_API_KEY;
    if (configData.widgetWidth) width = configData.widgetWidth;
    if (configData.widgetHeight) height = configData.widgetHeight;
  }
  return {
    width,
    height,
    partnerData,
    url: `${config.ENVIRONMENT[environment].FRONTEND}?${queryString}`,
  };
}

async function setStyle(themeColor, width, height) {
  let style = await document.createElement("style");
  style.innerHTML = getCSS(themeColor, height, width);
  let modal = document.getElementById("spritzWidget");
  if (modal) await modal.appendChild(style);
}

function handleClose() {
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

function handleMessage(event, spritz) {
  const environment = Object.values(config.ENVIRONMENT).find(
    (env) => env.FRONTEND === event.origin
  );

  if (!environment) return;
  if (!event.data) return;

  if (event.data && event.data.jsonrpc === "2.0") {
    const iframeElement = document.getElementById("spritzWidgetFrame");
    if (!iframeElement.contentWindow) return;
    spritz.provider.sendAsync(event.data, (error, result) => {
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
      eventEmitter.emit(EVENTS.SPRITZ_WIDGET_CLOSE, {
        status: true,
        eventName: EVENTS.SPRITZ_WIDGET_CLOSE,
      });
      handleClose();
      break;
    }
    case EVENTS.SPRITZ_WIDGET_OPEN: {
      eventEmitter.emit(EVENTS.SPRITZ_WIDGET_OPEN, {
        status: true,
        eventName: EVENTS.SPRITZ_WIDGET_OPEN,
      });
      break;
    }
    default: {
    }
  }
}

export default spritzSDK;
