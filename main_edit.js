import React from 'react';
import ReactDOM from 'react-dom';
import EditWaterExploitation from './src/js/edit_card.jsx';

ProtoGraph.Card.toWaterExploitation.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toWaterExploitation.prototype.renderSEO = function (data) {
  this.renderMode = 'SEO';
  return this.containerInstance.renderSEO();
}

ProtoGraph.Card.toWaterExploitation.prototype.renderEdit = function (onPublishCallback) {
  this.mode = 'edit';
  this.onPublishCallback = onPublishCallback;
  ReactDOM.render(
    <EditWaterExploitation
      dataURL={this.options.data_url}
      schemaURL={this.options.schema_url}
      uiSchemaURL={this.options.ui_schema_url}
      optionalConfigURL={this.options.configuration_url}
      optionalConfigSchemaURL={this.options.configuration_schema_url}
      onPublishCallback={this.onPublishCallback}
      mode={this.mode}
      baseURL={this.options.base_url}
      ref={(e) => {
        this.containerInstance = this.containerInstance || e;
      }}/>,
    this.options.selector);
}