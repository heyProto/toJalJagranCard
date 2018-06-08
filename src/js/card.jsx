import React from 'react';
import { render } from 'react-dom';
import { all as axiosAll, get as axiosGet, spread as axiosSpread } from 'axios';
import ReactMarkdown from 'react-markdown'

export default class WaterExploitationCard extends React.Component {
  constructor(props) {
    super(props)

    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      optionalConfigJSON: {},
      languageTexts: undefined
    };
    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }
    if (this.props.siteConfigs) {
      stateVar.siteConfigs = this.props.siteConfigs;
    }
    this.state = stateVar;
  }

  exportData() {
    return document.getElementById('protograph_div').getBoundingClientRect();
  }

  componentDidMount() {
    // get sample json data based on type i.e string or object
    if (this.state.fetchingData){
      let items_to_fetch = [
        axiosGet(this.props.dataURL)
      ];
      if (this.props.siteConfigURL) {
        items_to_fetch.push(axiosGet(this.props.siteConfigURL));
      }
      axiosAll(items_to_fetch)
        .then(axiosSpread((card, site_configs) => {
          let stateVar = {
            fetchingData: false,
            dataJSON: card.data,
            siteConfigs: site_configs ? site_configs.data : this.state.siteConfigs,
            languageTexts: this.getLanguageTexts(card.data.data.language)
          };
          this.setState(stateVar);
        }));
    } else {
      this.componentDidUpdate();
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

  renderStyle() {
    return (`
      .proto-description strong {
        color: ${this.state.optionalConfigJSON.house_colour} !important;
      }
    `)
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
    if (this.state.fetchingData){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.data;
      return (
        <div id="protograph_div" className="proto-col-col-7 proto-modal" style={{ fontFamily: this.state.languageTexts.font }}>
          <style dangerouslySetInnerHTML={{ __html: this.renderStyle() }} />
          <div className="proto-modal-header">
            <div className="proto-col proto-modal-title">
              <div className="proto-title-pretext">{`${data.district} में भूजल निकालना है`}</div>
              {data.water_score} <span className="proto-small">&#42;</span>
            </div>
            <div className="proto-col proto-modal-image">
              <img src={data.map} />
            </div>
          </div>
          <div className="proto-modal-content">
            <div className="proto-col proto-content-left">
              <ReactMarkdown
                className="proto-description"
                source={data.description}
              />
              {/* <p>ज़मीन की पानी सोख लेनी की क्षमता, बारिश की मात्रा, वन आवरण ओर कोंक्रेटआईज़ेशन ऐसे कुछ कारण हैं जिनसे एक ज़िले की भूज़ल मात्रा प्रभावित है।</p> */}
            </div>
            <div className="proto-content-right">
              <div className="proto-list-area">
                <div className="proto-single-parameter">
                  <div className="proto-parameter-name">कोंक्रेटआईज़ेशन</div>
                  <div className="proto-parameter-value">{this.generateStars(data.concretisation_score)}</div>
                </div>
                <div className="proto-single-parameter">
                  <div className="proto-parameter-name">वार्षिक वर्षा</div>
                  <div className="proto-parameter-value">{this.generateStars(data.rainfall_deficit_score)}</div>
                </div>
                <div className="proto-single-parameter">
                  <div className="proto-parameter-name">वन आवरण</div>
                  <div className="proto-parameter-value">{this.generateStars(data.forest_cover_score)}</div>
                </div>
                <div className="proto-single-parameter">
                  <div className="proto-parameter-name">जनसंख्या</div>
                  <div className="proto-parameter-value">{this.generateStars(data.population_score)}</div>
                </div>
              </div>
              <div className="proto-hint-text">
                नोट: 5 स्टार का मतलब सबसे अच्छा, 1 स्टार सबेसे बुरा। हर ज़िले की स्टार रेटिंग्स उत्तर प्रदेश के बाक़ी जिलों की तुलना में हैं।
              </div>
            </div>
          </div>
          <div className="proto-modal-footer">
              &#42; 'कठिन' क्षेत्रों में ज़मीन से पानी खींचने के लिए मोटर की ज़रूरत होती है, जबकी 'आसान' क्षेत्रों में मोटर की ज़रूरत नहीं होती। थिंक-टैंक PRS के अनुसार 10 मीटर नीचे से पानी खींचने के लिए मोटर की ज़रूरत होती है।
          </div>
        </div>
      )
    }
  }

  renderCol4()  {
    if (this.state.fetchingData){
      return(<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.data;
      return (
        <div id="protograph_div" className="proto-col-col-4 proto-modal proto-modal-mobile" style={{ fontFamily: this.state.languageTexts.font }}>
          <style dangerouslySetInnerHTML={{ __html: this.renderStyle() }} />
          <div className="proto-modal-header">
            <div className="proto-col proto-modal-title">
              <div className="proto-title-pretext">{`${data.district} में भूजल निकालना है`}</div>
              {data.water_score} <span className="proto-small">&#42;</span>
            </div>
            <div className="proto-col proto-modal-image">
              <img src={data.map} />
            </div>
          </div>
          <div className="proto-modal-content">
            <div className="proto-col proto-content-left">
              <ReactMarkdown
                className="proto-description"
                source={data.description}
              />
              {/* <p>ज़मीन की पानी सोख लेनी की क्षमता, बारिश की मात्रा, वन आवरण ओर कोंक्रेटआईज़ेशन ऐसे कुछ कारण हैं जिनसे एक ज़िले की भूज़ल मात्रा प्रभावित है।</p> */}
            </div>
            <div className="proto-content-right">
              <div className="proto-list-area">
                <div className="proto-single-parameter">
                  <div className="proto-parameter-name">कोंक्रेटआईज़ेशन</div>
                  <div className="proto-parameter-value">{this.generateStars(data.concretisation_score)}</div>
                </div>
                <div className="proto-single-parameter">
                  <div className="proto-parameter-name">वार्षिक वर्षा</div>
                  <div className="proto-parameter-value">{this.generateStars(data.rainfall_deficit_score)}</div>
                </div>
                <div className="proto-single-parameter">
                  <div className="proto-parameter-name">वन आवरण</div>
                  <div className="proto-parameter-value">{this.generateStars(data.forest_cover_score)}</div>
                </div>
                <div className="proto-single-parameter">
                  <div className="proto-parameter-name">जनसंख्या</div>
                  <div className="proto-parameter-value">{this.generateStars(data.population_score)}</div>
                </div>
              </div>
              <div className="proto-hint-text">
                नोट: 5 स्टार का मतलब सबसे अच्छा, 1 स्टार सबेसे बुरा। हर ज़िले की स्टार रेटिंग्स उत्तर प्रदेश के बाक़ी जिलों की तुलना में हैं।
              </div>
            </div>
          </div>
          <div className="proto-modal-footer">
            &#42; 'कठिन' क्षेत्रों में ज़मीन से पानी खींचने के लिए मोटर की ज़रूरत होती है, जबकी 'आसान' क्षेत्रों में मोटर की ज़रूरत नहीं होती। थिंक-टैंक PRS के अनुसार 10 मीटर नीचे से पानी खींचने के लिए मोटर की ज़रूरत होती है।
          </div>
        </div>
      )
    }
  }


  renderGrid() {
    if (this.state.fetchingData) {
      return (<div>Loading</div>)
    } else {
      const data = this.state.dataJSON.data;
      return (
        <div id="protograph_div" className="col-2-grid-card">
          <style dangerouslySetInnerHTML={{ __html: this.renderStyle() }} />
          <div className="col-2-bgimage">
            <img className="col-2-image" src={data.map} />
          </div>
          <div className="col-2-name">
            {data.district}
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
      case 'grid':
        return this.renderGrid();
        break;
    }
  }
}