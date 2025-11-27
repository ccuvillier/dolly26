import React, { Fragment, useState } from 'react';
import { SketchPicker } from 'react-color'; //https://casesandberg.github.io/react-color/
import './App.scss';
import FilleNue from './components/filleNue';

class App extends React.PureComponent {

  state = {
    colorPeau: "#FFE4D9"
  };

  

  showColorWheel = () => {
    document.getElementById('colorWheelId').style.display = 'block';
  };

  hideColorWheel = (e) => {
    document.getElementById('colorWheelId').style.display = 'none';
  }

  //changer la couleur
  handleChangeColorPeau = (color) => {
    this.setState({ colorPeau: color.hex });
  };


  render() {
      return (

          <div className="App">
            <h1>Ma meilleure copine</h1>

            <div id="poupee">
              <FilleNue peau={this.state.colorPeau} showColorWheel={this.showColorWheel} />

              <div id="colorWheelId" className="colorWheel" style={{display: 'none'}}> 
                <button onClick={this.hideColorWheel}>close</button>
                <SketchPicker 
                  color={ this.state.colorPeau }
                  onChangeComplete={ this.handleChangeColorPeau }
                />
              </div>
            </div> 
          </div>

      )
  }
}



export default App;
