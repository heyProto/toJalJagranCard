import React from 'react';
import ReactDOM from 'react-dom';
import WaterExploitation from './src/js/card_name.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};


ProtoGraph.Card.toWaterExploitation = function () {
  this.cardType = 'toWaterExploitation';
}

ProtoGraph.Card.toWaterExploitation.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toWaterExploitation.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toWaterExploitation.prototype.renderLaptopCol7 = function (data) {
  this.mode = 'laptop_col7';
  this.render();
}

ProtoGraph.Card.toWaterExploitation.prototype.renderMobile = function (data) {
  this.mode = 'mobile';
  this.render();
}

ProtoGraph.Card.toWaterExploitation.prototype.renderScreenshot = function (data) {
  this.mode = 'screenshot';
  this.render();
}

ProtoGraph.Card.toWaterExploitation.prototype.render = function () {
  ReactDOM.render(
    <WaterExploitation
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      mode={this.mode}
      baseURL={this.options.base_url}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}
