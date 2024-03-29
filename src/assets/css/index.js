export function getCSS(themeColor, height, width) {
  return `
/* Modal Content/Box */
.spritz_close {
    float: right;
    animation: 1s spritz_fadeIn;
    animation-fill-mode: forwards;
    visibility: hidden;
    transition: 0.5s;
    position: absolute;
    right: -5px;
    width: 35px;
    margin-top: -15px;
    height: 35px;
    font-weight: bold;
    z-index: 1;
    background: white;
    color: #${themeColor};
    border-radius: 50%;
}

@keyframes spritz_fadeIn {
  0% {
    opacity: 0;
  }
  50% {
   visibility: hidden;
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
}

.spritz_close:hover,
.spritz_close:focus {
  color: white;
  background: #${themeColor};
  text-decoration: none;
  cursor: pointer;
}

.spritz_modal {
  display: block;
  width: ${width};
  max-width: 500px;
  height: ${height};
  max-height: 100%;
  position: fixed;
  z-index: 100;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: none;
  border-radius: 2%;
  margin: 0px auto;
  display: block;
}

.spritz_closed {
  display: none;
}

#spritzWidgetFrame {
    min-height: ${height}; 
    position: absolute; 
    border: none; 
    border-radius: 2%; 
    margin: 0px auto; 
    display: block;
}

.spritz_modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;  
  background: rgba(0, 0, 0, 0.6);
}

.spritz_modal-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
}

.spritz_modal .close-button {
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 20px;
  background: black;
  color: white;
  padding: 5px 10px;
  font-size: 1.3rem;
}

.spritz_spritzContainer {
    height: 100%;
    width:100%;
}

#spritzWidget{
    margin-left: 10px;
    margin-right: 10px;
}


@media all and (max-width: ${width}) {
  .spritz_modal {
    height: 100%;
    max-height:${height};
    top: 53%;
  }
}

@media all and (max-height: ${height}) and (max-width: ${width}) {
    #spritzOnOffRampWidget {
      padding-bottom: 15px;
    }
}
`;
}
