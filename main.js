import React from 'react';
import ReactDOM from 'react-dom';
import WaterExploitation from './src/js/card.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};


ProtoGraph.Card.WaterExploitation = function () {
  this.cardType = 'WaterExploitation';
}

ProtoGraph.Card.WaterExploitation.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.WaterExploitation.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.WaterExploitation.prototype.renderCol7 = function (data) {
  this.mode = 'col7';
  this.render();
}

ProtoGraph.Card.WaterExploitation.prototype.renderCol4 = function (data) {
  this.mode = 'col4';
  this.render();
}

ProtoGraph.Card.WaterExploitation.prototype.renderGrid = function (data) {
  this.mode = 'grid';
  this.render();
}

ProtoGraph.Card.WaterExploitation.prototype.render = function () {
  ReactDOM.render(
    <WaterExploitation
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      siteConfigURL={this.options.site_config_url}
      siteConfigs={this.options.site_configs}
      mode={this.mode}
      baseURL={this.options.base_url}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}
