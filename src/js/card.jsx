import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'

export default class WaterExploitationCard extends React.Component {
  constructor(props) {
    super(props)

    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      schemaJSON: undefined,
      optionalConfigJSON: {},
      optionalConfigSchemaJSON: undefined,
      languageTexts: undefined
    };
    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }

    if (this.props.schemaJSON) {
      stateVar.schemaJSON = this.props.schemaJSON;
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if (this.props.optionalConfigSchemaJSON) {
      stateVar.optionalConfigSchemaJSON = this.props.optionalConfigSchemaJSON;
    }
    this.state = stateVar;
  }

  exportData() {
    return document.getElementById('protograph_div').getBoundingClientRect();
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (this.state.fetchingData){
      axios.all([axios.get(this.props.dataURL), axios.get(this.props.schemaURL), axios.get(this.props.optionalConfigURL), axios.get(this.props.optionalConfigSchemaURL)])
        .then(axios.spread((card, schema, opt_config, opt_config_schema) => {
          this.setState({
            fetchingData: false,
            dataJSON: card.data,
            schemaJSON: schema.data,
            optionalConfigJSON: opt_config.data,
            optionalConfigSchemaJSON: opt_config_schema.data,
            languageTexts: this.getLanguageTexts(card.data.data.language)
          });
        }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON,
        languageTexts: this.getLanguageTexts(nextProps.dataJSON.data.language)
      });
    }
  }

  getScoreText(scoreInt) {
    let score = ["उपलब्ध नहीं", "खराब", "औसत से कम", "औसत", "औसत से ऊपर", "अच्छा"];
    return score[scoreInt];
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "hindi",
      text_obj;

    switch(language.toLowerCase()) {
      case "hindi":
        text_obj = {
          font: "'Sarala', sans-serif"
        }
        break;
      default:
        text_obj = {
          font: undefined
        }
        break;
    }

    return text_obj;
  }

  generateStars(score) {
    let stars = new Array(5).fill(1);
    return (
      <div className="protograph-score-stars">
        {
          stars.map((e, i) => {
            if (i < +score) {
              return <i key={i} className="star icon protograph-star-small protograph-active-star"></i>
            } else {
              return <i key={i} className="star icon protograph-star-small protograph-inactive-star"></i>
            }
          })
        }
      </div>
    )
  }

  renderCol7() {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.data;
      return (
        <div id="protograph_div" className="protograph-col7" style={{fontFamily: this.state.languageTexts.font}}>
          <div className="protograph-card">

            <div className="protograph-card-header">
              <div className="protograph-header-container">
                <div className="protograph-header">
                  <p className="protograph-header-text">{`${data.district} में भूज़ल निकललना है`}</p>
                  <span className="protograph-water-exp-score">{data.water_score}
                    <span className="protograph-header-asterisk">*</span>
                  </span>
                </div>
              </div>
              <div className="protograph-image-container">
                <img className="district-map" src={data.map} />
              </div>
            </div>
            <div className="protograph-card-content">
              <div className="protograph-left-content">
                <ReactMarkdown
                  className="protograph-card-description"
                  source={data.description}
                />
                <p className="protograph-card-description-help">ज़मीन की पानी सोख लेनी की क्षमता, बारिश की मात्रा, वन आवरण ओर कोंक्रेटआईज़ेशन ऐसे कुछ कारण हैं जिनसे एक ज़िले की भूज़ल मात्रा प्रभावित है।</p>
              </div>
              <div className="protograph-right-content">
                <div className="protograh-table">
                  <div className="protograph-table-row">
                    <div className="protograph-table-cell-heading">कोंक्रेटआईज़ेशन</div>
                    <div className="protograph-table-cell">
                      {this.generateStars(data.concretisation_score)}
                    </div>
                  </div>

                  <div className="protograph-table-row">
                    <div className="protograph-table-cell-heading">वार्षिक वर्षा</div>
                    <div className="protograph-table-cell">
                      {this.generateStars(data.rainfall_deficit_score)}
                    </div>
                  </div>

                  <div className="protograph-table-row">
                    <div className="protograph-table-cell-heading">वन आवरण</div>
                    <div className="protograph-table-cell">
                      {this.generateStars(data.forest_cover_score)}
                    </div>
                  </div>

                  <div className="protograph-table-row">
                    <div className="protograph-table-cell-heading">ज़मीन की पानी सोख लेनी की क्षमता</div>
                    <div className="protograph-table-cell">
                      {this.generateStars(data.water_exploitation_score)}
                    </div>
                  </div>
                </div>
                <p className="protograph-rating-guide">
                  नोट: 5 स्टार का मतलब सबसे अच्छा, 1 स्टार सबेसे बुरा। हर ज़िले की स्टार रेटिंग्स उत्तर प्रदेश के बाक़ी जिलों की तुलना में हैं।
                  </p>

              </div>
              <div className="clearfix"></div>
            </div>
            <div className="protograph-bottom-note">
              <p>
                * 'कठिन' क्षेत्रों में ज़मीन से पानी खींचने के लिए मोटर की ज़रूरत होती है, जबकी 'आसान' क्षेत्रों में मोटर की ज़रूरत नहीं होती। थिंक-टैंक PRS के अनुसार 10 मीटर नीचे से पानी खींचने के लिए मोटर की ज़रूरत होती है।
                </p>
            </div>
          </div>
        </div>
      )
    }
  }

  renderCol4()  {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.data;
      return (
        <div id="protograph_div" className="protograph-col4" style={{ fontFamily: this.state.languageTexts.font }}>
          <div className="protograph-card">
            <div className="protograph-card-header">
              <div className="protograph-header-container">
                <img className="district-map" src={data.map} />
                <p className="protograph-header-text">{`${data.district} में भूज़ल निकललना है`}</p>
                <span className="protograph-water-exp-score">{data.water_score}
                  <span className="protograph-header-asterisk">*</span>
                </span>
              </div>

            </div>
            <div className="protograph-card-content">
                <ReactMarkdown
                  className="protograph-card-description"
                  source={data.description}
                />
                <p className="protograph-card-description-help">ज़मीन की पानी सोख लेनी की क्षमता, बारिश की मात्रा, वन आवरण ओर कोंक्रेटआईज़ेशन ऐसे कुछ कारण हैं जिनसे एक ज़िले की भूज़ल मात्रा प्रभावित है।</p>
                <div className="protograh-table">
                  <div className="protograph-table-row">
                    <div className="protograph-table-cell-heading">कोंक्रेटआईज़ेशन</div>
                    <div className="protograph-table-cell">
                      {this.generateStars(data.concretisation_score)}
                    </div>
                  </div>

                  <div className="protograph-table-row">
                    <div className="protograph-table-cell-heading">वार्षिक वर्षा</div>
                    <div className="protograph-table-cell">
                      {this.generateStars(data.rainfall_deficit_score)}
                    </div>
                  </div>

                  <div className="protograph-table-row">
                    <div className="protograph-table-cell-heading">वन आवरण</div>
                    <div className="protograph-table-cell">
                      {this.generateStars(data.forest_cover_score)}
                    </div>
                  </div>

                  <div className="protograph-table-row">
                    <div className="protograph-table-cell-heading">ज़मीन की पानी सोख लेनी की क्षमता</div>
                    <div className="protograph-table-cell">
                      {this.generateStars(data.water_exploitation_score)}
                    </div>
                  </div>
                </div>
                <p className="protograph-rating-guide">
                  नोट: 5 स्टार का मतलब सबसे अच्छा, 1 स्टार सबेसे बुरा। हर ज़िले की स्टार रेटिंग्स उत्तर प्रदेश के बाक़ी जिलों की तुलना में हैं।
                  </p>

              <div className="clearfix"></div>
            </div>
            <div className="protograph-bottom-note">
              <p>
                * 'कठिन' क्षेत्रों में ज़मीन से पानी खींचने के लिए मोटर की ज़रूरत होती है, जबकी 'आसान' क्षेत्रों में मोटर की ज़रूरत नहीं होती। थिंक-टैंक PRS के अनुसार 10 मीटर नीचे से पानी खींचने के लिए मोटर की ज़रूरत होती है।
                </p>
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    switch(this.props.mode) {
      case 'col7' :
        return this.renderCol7();
        break;
      case 'col4' :
        return this.renderCol4();
        break;
    }
  }
}