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
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.card_data.data.language);
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
        languageTexts: this.getLanguageTexts(nextProps.dataJSON.card_data.data.language)
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
          title: "भूजल का शोषण",
          decreaseInLevel: 'भूजल स्तर में कमी (cm में)',
          decadalChange: function (s) {
            switch(s) {
              case "No Change":
                return 'कोई परिवर्तन नहीं';
              default:
                return s;
            }
          },
          font: "'Sarala', sans-serif"
        }
        break;
      default:
        text_obj = {
          title: "Ground Water Exploitation",
          decreaseInLevel: 'Decrease in Ground Water Level(in cm)',
          decadalChange: function (s) {
            return s;
          },
          font: undefined
        }
        break;
    }

    return text_obj;
  }

  generateStars(score) {
    let stars = new Array(5).fill(1);
    return (
      <div>
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

  renderLaptop() {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.data;
      // debugger;
      return (
        <div id="protograph_div" className="protograph-laptop-mode" style={{fontFamily: this.state.languageTexts.font}}>
          <div className="protograph-card">

            <div className="ui grid no-margins">
              <div className="row protograph-header-container">
                <div className="twelve wide column">
                  <div className="protograph-header">
                    <p className="protograph-header-text">{`${data.district} में भूज़ल निकललना है`}</p>
                      <span className="protograph-water-exp-score">{this.getScoreText(data.water_exploitation_score)}
                        <span className="protograph-header-asterisk">*</span>
                      </span>
                  </div>
                </div>
                <div className="four wide column">
                  <img className="district-map" src={data.map} />
                </div>
              </div>

              <div className="row">
                <div className="eight wide column">
                  <ReactMarkdown
                    className="protograph-card-description"
                    source={data.description}
                  />
                </div>
                <div className="eight wide column">
                  <div className="protograh-table">
                    <div className="protograph-table-row">
                      <div className="protograph-table-cell">भूमि उपयोग / शहरीकरण</div>
                      <div className="protograph-table-cell">
                        {this.generateStars(data.concretisation_score)}
                      </div>
                    </div>

                    <div className="protograph-table-row">
                      <div className="protograph-table-cell">वार्षिक वर्षा</div>
                      <div className="protograph-table-cell">
                        {this.generateStars(data.yearly_rainfall_score)}
                      </div>
                    </div>

                    <div className="protograph-table-row">
                      <div className="protograph-table-cell">वन आवरण</div>
                      <div className="protograph-table-cell">
                        {this.generateStars(data.forest_cover_score)}
                      </div>
                    </div>

                    <div className="protograph-table-row">
                      <div className="protograph-table-cell">भूजल का शोषण</div>
                      <div className="protograph-table-cell">
                        {this.generateStars(data.water_score)}
                      </div>
                    </div>
                  </div>
                  <p className="protograph-rating-guide">
                    नोट: 5 स्टार का मतलब सबसे अच्छा, 1 स्टार सबेसे बुरा। हर ज़िले की स्टार रेटिंग्स उत्तर प्रदेश के बाक़ी जिलों की तुलना में हैं।
                  </p>
                </div>
              </div>
              <div className="row protograph-bottom-note">
                <div className="sixteen wide column">
                  <p>
                    * 'कठिन' क्षेत्रों में ज़मीन से पानी खींचने के लिए मोटर की ज़रूरत होती है, जबकी 'आसान' क्षेत्रों में मोटर की ज़रूरत नहीं होती। थिंक-टैंक PRS के अनुसार 10 मीटर नीचे से पानी खींचने के लिए मोटर की ज़रूरत होती है।
                  </p>
                </div>
              </div>
            </div>

            <div className="proto-col col-12">
            </div>
            <div className="proto-col col-4">
            </div>

            <div className="proto-col col-8 left-col"></div>
            <div className="proto-col col-8 left-col"></div>
            <div className="proto-col col-16 left-col">
            </div>
          </div>
        </div>
      )
    }
  }

  renderMobile()  {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      return (<div>Under construction</div>)
      // const data = this.state.dataJSON.card_data.data;
      // let blocks=data.blocks;
      // return (
      //   <div id="protograph_div" className="protograph-mobile-mode" style={{fontFamily: this.state.languageTexts.font}}>
      //     <div className="protograph-card">
      //       <p className="protograph-card-title">{this.state.languageTexts.title}</p>
      //       <div className="protograph-annual">
      //         {this.generateStars(data.decadal_decrease_score)}
      //         <p>पसंद जिम्मे विज्ञान शारिरिक सीमित औषधिक करता सहायता सुस्पश्ट लाभान्वित एछित विकास परस्पर विश्वव्यापि सक्षम तकनीकी पहोचाना निरपेक्ष देते भाषा माध्यम गटकउसि मुख्यतह समजते अधिक हमारी असक्षम संस्थान उपलब्धता</p>
      //         {/* <p className="protograph-annual-average protograph-ratio">0{data.decadal_decrease_score}<span className="protograph-ratio-total">/05</span></p> */}
      //         <div className="protograph-annual-rainfall-value protograph-house-color">{this.state.languageTexts.decreaseInLevel}</div>
      //       </div>
      //       <div className="protograph-toWaterExploitation-beakers">
      //         <div className="protograph-vals protograph-vals-mobile">
      //           <div className="protograph-toWaterExploitation-beakers-container" style={{width:110*blocks.length}}>
      //           {
      //             blocks.map((block,i)=>{
      //               return(
      //                 <div key={i} className="protograph-toWaterExploitation-beaker">
      //                   <div className="protograph-toWaterExploitation-beaker-name" style={{fontsize:12}}>{block.name}</div>
      //                   <div className="protograph-toWaterExploitation-beaker-img-container">
      //                     <img src={block.decadal_change === "No Change" ? `${this.props.baseURL}/images/water_normal.png` : `${this.props.baseURL}/images/water_low.png`} style={{width:"100%"}}></img>
      //                   </div>
      //                   <div>{this.state.languageTexts.decadalChange(block.decadal_change)}</div>
      //                 </div>
      //               );
      //             })
      //           }
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // )
    }
  }

  renderScreenshot() {
    if (this.state.schemaJSON === undefined ){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.card_data.data;
      let styles = {
        fontFamily: this.state.languageTexts.font
      }//Custom style object for screenshot mode
      let blocks=data.blocks;
      return (
        <div id="ProtoScreenshot" style={styles}>
          <div className="protograph-card">
            <p className="protograph-card-title">{this.state.languageTexts.title}</p>
            <div className="protograph-annual">
              {this.generateStars(data.decadal_decrease_score)}
              <p>पसंद जिम्मे विज्ञान शारिरिक सीमित औषधिक करता सहायता सुस्पश्ट लाभान्वित एछित विकास परस्पर विश्वव्यापि सक्षम तकनीकी पहोचाना निरपेक्ष देते भाषा माध्यम गटकउसि मुख्यतह समजते अधिक हमारी असक्षम संस्थान उपलब्धता</p>
              {/* <p className="protograph-annual-average protograph-ratio">0{data.decadal_decrease_score}<span className="protograph-ratio-total">/05</span></p> */}
              <div className="protograph-toWaterExploitation-sub-heading protograph-house-color">
                {this.state.languageTexts.decreaseInLevel}
              </div>
            </div>
            <div className="protograph-toWaterExploitation-beakers">
              <div className="protograph-vals protograph-vals-mobile">
                <div className="protograph-toWaterExploitation-beakers-container" style={{width:110*blocks.length}}>
                {
                  blocks.map((block,i)=>{
                    return(
                      <div key={i} className="protograph-toWaterExploitation-beaker" style={{width:110}}>
                        <div className="protograph-toWaterExploitation-beaker-name">{block.name}</div>
                        <div className="protograph-toWaterExploitation-beaker-img-container">
                          <img src={block.decadal_change === "No Change" ? `${this.props.baseURL}/images/water_normal.png` : `${this.props.baseURL}/images/water_low.png`} style={{width:"100%"}}></img>
                        </div>
                        <div>{this.state.languageTexts.decadalChange(block.decadal_change)}</div>
                      </div>
                    );
                  })
                }
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    switch(this.props.mode) {
      case 'laptop_col7' :
        return this.renderLaptop();
        break;
      case 'mobile' :
        return this.renderMobile();
        break;
      case 'screenshot' :
        return this.renderScreenshot();
        break;
    }
  }
}