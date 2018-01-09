import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import WaterExploitation from './card.jsx';
import JSONSchemaForm from '../../lib/js/react-jsonschema-form';

export default class EditWaterExploitation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      dataJSON: {},
      mode: "col7",
      publishing: false,
      schemaJSON: undefined,
      uiSchemaJSON: {},
      errorOnFetchingData: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined
    }
    this.toggleMode = this.toggleMode.bind(this);
  }

  exportData() {
    let getDataObj = {
      dataJSON: this.state.dataJSON,
      schemaJSON: this.state.schemaJSON,
      optionalConfigJSON: this.state.optionalConfigJSON,
      optionalConfigSchemaJSON: this.state.optionalConfigSchemaJSON
    }

    getDataObj["name"] = getDataObj.dataJSON.data.district.substr(0,225); // Reduces the name to ensure the slug does not get too long, used for the title of the show page after publishing
    return getDataObj;
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (typeof this.props.dataURL === "string"){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL),axios.get(this.props.uiSchemaURL)
])
        .then(axios.spread((card, schema, opt_config, opt_config_schema,uiSchema) => {
          this.setState({
            dataJSON: card.data,
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data,
            uiSchemaJSON: uiSchema.data
          });
        }))
        .catch((error) => {
          this.setState({
            errorOnFetchingData: true
          })
        });
    }
  }

  onChangeHandler({formData}) {
    //Change the data of the form based on current step and previous data
    this.setState((prevStep, prop) => {
      let dataJSON = prevStep.dataJSON;
      dataJSON.data = formData
      return {
        dataJSON: dataJSON
      }
    })
  }

  onSubmitHandler({formData}) {
    //Logic to execute on submit of form based on the current step
    if (typeof this.props.onPublishCallback === "function") {
      this.setState({ publishing: true });
      let publishCallback = this.props.onPublishCallback();
      publishCallback.then((message) => {
        this.setState({ publishing: false });
      });
    }
  }

  renderSEO() {
    let seo_blockquote = `<blockquote><h3>${this.state.dataJSON.data.district}</h3></blockquote>`
    return seo_blockquote;
  }

  renderSchemaJSON() {
    return this.state.schemaJSON.properties.data;
  }

  renderFormData() {
    return this.state.dataJSON.data;
  }

  showButtonText() {
    return 'Publish';
  }

  toggleMode(e) {
    //Switch between moving laptop and mobile modes while editing
    let element = e.target.closest('a'),
      mode = element.getAttribute('data-mode');
    this.setState((prevState, props) => {
      let newMode;
      if (mode !== prevState.mode) {
        newMode = mode;
      } else {
        newMode = prevState.mode
      }

      return {
        mode: newMode
      }
    })
  }

  render() {
    if (this.state.schemaJSON === undefined) {
      return(
        <div className="protograph-loader-container">
          {
            !this.state.errorOnFetchingData ?
              "Loading"
            :
              <div className="ui basic message">
                <div className="header">
                  Failed to load resources
                </div>
                <p>Try clearing your browser cache and refresh the page.</p>
              </div>
          }
        </div>
      )
    } else {
      return (
        <div className="proto-container">
          <div className="ui grid form-layout">
            <div className="row">
              <div className="four wide column proto-card-form">
                <div>
                  <div className="section-title-text">Fill the form</div>
                  <div className="ui label proto-pull-right">
                    toWaterExploitation
                  </div>
                </div>
                <JSONSchemaForm schema={this.renderSchemaJSON()}
                  onSubmit={((e) => this.onSubmitHandler(e))}
                  onChange={((e) => this.onChangeHandler(e))}
                  uiSchema={this.state.uiSchemaJSON.data}
                  formData={this.renderFormData()}>
                  <button type="submit" className={`${this.state.publishing ? 'ui primary loading disabled button' : ''} default-button protograph-primary-button`}>{this.showButtonText()}</button>
                </JSONSchemaForm>
              </div>
              <div className="twelve wide column proto-card-preview proto-share-card-div">
                <div className="protograph-menu-container">
                  <div className="ui compact menu">
                    <a className={`item ${this.state.mode === 'col7' ? 'active' : ''}`}
                      data-mode='col7'
                      onClick={(e) => this.toggleMode(e)}
                    >
                      7c
                    </a>
                    <a className={`item ${this.state.mode === 'col4' ? 'active' : ''}`}
                      data-mode='col4'
                      onClick={(e) => this.toggleMode(e)}
                    >
                      4c
                    </a>
                    <a className={`item ${this.state.mode === 'grid' ? 'active' : ''}`}
                      data-mode='grid'
                      onClick={(e) => this.toggleMode(e)}
                    >
                      grid
                    </a>
                  </div>
                </div>
                <div className={`protograph-edit-${this.state.mode}`}>
                  <WaterExploitation
                    mode={this.state.mode}
                    dataJSON={this.state.dataJSON}
                    schemaJSON={this.state.schemaJSON}
                    optionalConfigJSON={this.state.optionalConfigJSON}
                    optionalConfigSchemaJSON={this.state.optionalConfigSchemaJSON}
                    baseURL={this.props.baseURL}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}