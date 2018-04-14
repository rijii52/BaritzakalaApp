import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight, StatusBar, Image } from 'react-native';

const RaceTimeQuant = 15;

function SecondsToTimeFormat(seconds) {
  if (seconds.isNull || seconds.isNaN)
    return "";

  var sMinutes = parseInt(seconds / 60, 10).toString();
  while (sMinutes.length < 2) {
    sMinutes = '0' + sMinutes;
  }

  var sSeconds = parseInt(seconds % 60, 10).toString();
  while (sSeconds.length < 2) {
    sSeconds = '0' + sSeconds;
  }

  return sMinutes + ":" + sSeconds;
}

class TopControlBlock extends Component {
  constructor(props) {
    super(props);

    this.onStartTaraining = this.onStartTaraining.bind(this);
    this.onFinishTaraining = this.onFinishTaraining.bind(this);
    this.onStoreTaraining = this.onStoreTaraining.bind(this);

    this.styles = StyleSheet.create({
      theblock: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#CFD8DC'
      },
      touch: {
        width: '50%'
      },
      button: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#455A64'
      },
      button_en: {
        borderColor: 'white',
      },
      button_dis: {
        borderColor: 'gray',
      },
      buttontext: {
        fontSize: 20,
      },
      buttontext_en: {
        color: 'white',
      },
      buttontext_dis: {
        color: 'gray',
      }
    });
  }

  onStartTaraining () {
    this.props.startTaraining();
  }

  onFinishTaraining () {
    this.props.finishTaraining();
  }

  onStoreTaraining () {
    this.props.storeTaraining();
  }

  getButton () {
    switch (this.props.status) {
      case "initial":
        return (
          <TouchableHighlight onPress={this.onStartTaraining} style={this.styles.touch} underlayColor={'transparent'}>
            <View style={[this.styles.button, this.styles.button_en]}>
              <Text style={[this.styles.buttontext, this.styles.buttontext_en]}>Start Training</Text>
            </View>
          </TouchableHighlight>
        );
        
      case "training":
        if (this.props.runningStatus === "walking") {
          return  (
            <TouchableHighlight onPress={this.onFinishTaraining} style={this.styles.touch} underlayColor={'transparent'}>
              <View style={[this.styles.button, this.styles.button_en]}>
                <Text style={[this.styles.buttontext, this.styles.buttontext_en]}>Finish Training</Text>
              </View>
            </TouchableHighlight>
            );
          }
        else {
          return  (
            <TouchableHighlight style={this.styles.touch} underlayColor={'transparent'}>
              <View style={[this.styles.button, this.styles.button_dis]}>
                <Text style={[this.styles.buttontext, this.styles.buttontext_dis]}>Finish Training</Text>
              </View>
            </TouchableHighlight>
          );
        }

      case "pending_store":
        return (
          <TouchableHighlight onPress={this.onStoreTaraining} style={this.styles.touch} underlayColor={'transparent'}>
            <View style={[this.styles.button, this.styles.button_en]}>
              <Text style={[this.styles.buttontext, this.styles.buttontext_en]}>Store Training</Text>
            </View>
          </TouchableHighlight>
        );

      default:
        break;
    }
  }

  render () {
    var Button = this.getButton ();

    return (
      <View style={this.styles.theblock}>
        {Button}
      </View>
    );
  }
}

class WelcomeBlock extends Component {

  constructor(props) {
    super(props);

    this.styles = StyleSheet.create({
      theblock: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center'
      },
      welcome: {
        fontSize: 24,
        color: 'white'
      },
      image: {
        marginTop: 30,
        marginBottom: 30
      },
      instruction: {
        fontSize: 18,
        lineHeight: 32,
        color: 'white',
        width: '80%',
        textAlign: 'center'
      }
    });
  }

  render () {
    return (
      <View style={this.styles.theblock}>
        <Text style={this.styles.welcome}>Welcome to Baritzakala!</Text>
        <Image source={require('./seniorjogger.png')} style={this.styles.image} />
        <Text style={this.styles.instruction}>Click the button "Start Training"{'\n'}to start training.{'\n'}Did you expect something else?</Text>
      </View>
    );
  }
}

class SpeedInput extends Component {

  constructor(props) {
    super(props);

    this.onUp = this.onUp.bind(this);
    this.onUpIn = this.onUpIn.bind(this);
    this.onUpOut = this.onUpOut.bind(this);
    this.onDown = this.onDown.bind(this);
    this.onDownIn = this.onDownIn.bind(this);
    this.onDownOut = this.onDownOut.bind(this);
  }

  valueUp () {
    var newValue = Math.round((this.props.value + this.props.step) * 10) / 10;
    this.props.onValueChanged(newValue);
  }

  onUp () {
    this.valueUp();
  }

  onUpIn () {
    this.upTickCounter = 0;
    this.upTimer = setInterval(
      () => this.upTick(),
      100
    );
  }

  onUpOut () {
    clearInterval(this.upTimer);
  }

  upTick() {
    this.upTickCounter++;
    if (this.upTickCounter > 3 && (this.upTickCounter % 3 == 0)) {
      this.valueUp();
    }
  }

  valueDown () {
    var newValue = Math.round((this.props.value - this.props.step) * 10) / 10;
    this.props.onValueChanged(newValue);
  }
  
  onDown () {
    this.valueDown();
  }
 
  onDownIn () {
    this.downTickCounter = 0;
    this.downTimer = setInterval(
      () => this.downTick(),
      100
    );
  }

  onDownOut () {
    clearInterval(this.downTimer);
  }

  downTick() {
    this.downTickCounter++;
    if (this.downTickCounter > 3 && (this.downTickCounter % 3 == 0)) {
      this.valueDown();
    }
  }
  
  render () {
      var inputStyles = StyleSheet.create({
        theinput: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderStyle: 'solid',
          borderWidth: 1,
          padding: 0
        },
        touch: {
          width: 30
        },
        button: {
          textAlign: 'center',
          backgroundColor: '#455A64',
          fontSize: 20
        },
        value: {
          textAlign: 'center',
          fontSize: 20,
          color: 'white',
          marginLeft: 5,
          marginRight: 5
        }   
      });

      var enColors = StyleSheet.create({
        theinput: {
          borderColor: 'white'
        },
        button: {
          color: 'white'
        }
      });
    
      var disColors = StyleSheet.create({
        theinput: {
          borderColor: 'gray'
        },
        button: {
          color: 'gray'
        }            
      });

      if (this.props.disabled) {
        return (
          <View style={[inputStyles.theinput, disColors.theinput]}>
            <TouchableHighlight style={inputStyles.touch}>
              <Text style={[inputStyles.button, disColors.button]}>-</Text>
            </TouchableHighlight>
            <Text style={inputStyles.value}>{this.props.value.toFixed(1)}</Text>
            <TouchableHighlight style={inputStyles.touch}>
            <Text style={[inputStyles.button, disColors.button]}>+</Text>
            </TouchableHighlight>
          </View>
        );
      }
      else {
        return (
          <View style={[inputStyles.theinput, enColors.theinput]}>
            <TouchableHighlight style={inputStyles.touch} onPress={this.onDown} onPressIn={this.onDownIn} onPressOut={this.onDownOut}>
              <Text style={[inputStyles.button, enColors.button]}>-</Text>
            </TouchableHighlight>
            <Text style={inputStyles.value}>{this.props.value.toFixed(1)}</Text>
            <TouchableHighlight style={inputStyles.touch} onPress={this.onUp}  onPressIn={this.onUpIn} onPressOut={this.onUpOut}>
              <Text style={[inputStyles.button, enColors.button]}>+</Text>
            </TouchableHighlight>
          </View>
        );    
      }
  }
}

class ActiveTraining extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      speed: 8.6,
      distance: 0
    };

    this.startRace = this.startRace.bind(this);
    this.stopRace = this.stopRace.bind(this);
    this.onSpeedChanged = this.onSpeedChanged.bind(this);

    this.styles = StyleSheet.create({
      theblock: {
        flex: 6,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
      },
      labels_row: {
        flexDirection: 'row',
        justifyContent: 'center'
      },
      label: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        marginTop: 24,
        marginBottom: 5,
        color: 'white'
      },
      ctrls_row: {
        flexDirection: 'row',
        justifyContent: 'center'
      },
      ctrl_elem: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        color: 'white'
      },
      button_row: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40
      },
      touch: {
        width: '50%'
      },
      button: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        padding: 30,
        backgroundColor: '#455A64'
      },
      buttontext: {
        fontSize: 20,
        color: 'white',
      },
      racelist: {
        width: '100%'
      },
      racelist_row: {
        flexDirection: 'row',
        justifyContent: 'center'        
      },
      racelist_hd: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        color: 'white',
        marginBottom: 6
      },
      raceslist_td: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        color: 'white',
        marginBottom: 4
      },
      noracesyet: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        color: 'lightgray',
        marginTop: 20
      }
    });
  }

  startRace () {
    let startRaceTime = 0;
    while (startRaceTime <= this.props.trainingTime) {
      startRaceTime += RaceTimeQuant;
    }
    let timeAhead = startRaceTime - this.props.trainingTime;

    this.props.updateRunningStatus("starting");

    this.setState({
      start: startRaceTime,
      time: timeAhead,
      distance: 0
    });

    this.timeID = setInterval(
      () => this.raceTick(),
      1000
    );    
  }

  stopRace () {
    clearInterval(this.timeID);

    // if race was actually started then store the race, otherwise cancel it
    if (this.props.runningStatus === "running") {
      var stoptime = this.state.start + this.state.time;
      var distance = parseInt(this.state.speed * 1000 / 3600 * this.state.time, 10);
      
      this.props.addRace({
        start: this.state.start,
        stop: stoptime,
        time: this.state.time,
        speed: this.state.speed,
        distance: distance
      });
    }

    this.props.updateRunningStatus("walking");
  
    this.setState({
      time: 0,
      distance: 0
    });
  }

  raceTick () {
    if (this.props.runningStatus === "starting") {
      this.setState((prevState, props) => ({
        time: prevState.time - 1
      }));
    }
    else {
      var distance = parseInt(this.state.speed * 1000 / 3600 * (this.state.time + 1), 10);
      this.setState((prevState, props) => ({
        time: prevState.time + 1,
        distance: distance
      }));
    }

    if (this.state.time === 0) {
      this.props.updateRunningStatus("running");
    }
  }

  getRaceDataRow () {
    var raceTimeColor = {
      color: 'lightgray'
    }
    var raceDistanceColor = {
      color: 'lightgray'
    }

    if (this.props.runningStatus === "starting")
      raceTimeColor.color = "red";
    else if (this.props.runningStatus === "running") {
      raceTimeColor.color = "lime";
      raceDistanceColor.color = "white";
    }

    return (
      <View style={this.styles.ctrls_row}>
        <Text style={[this.styles.ctrl_elem, raceTimeColor]}>{SecondsToTimeFormat(this.state.time)}</Text>
        <View style={[this.styles.ctrl_elem, {alignItems:'center'}]}>
          <SpeedInput value={this.state.speed} step={0.1} onValueChanged={this.onSpeedChanged} disabled={this.props.runningStatus === "walking" ? false : true} />
        </View>
        <Text style={[this.styles.ctrl_elem, raceDistanceColor]}>{this.state.distance}</Text>
      </View>
    );
  }

  onSpeedChanged (value) {
    this.setState({
      speed: value
    });    
  }

  getButtonRow () {
    if (this.props.runningStatus === "walking") {
      return (
        <View style={this.styles.button_row}>
          <TouchableHighlight style={this.styles.touch} onPress={this.startRace}>
            <View style={this.styles.button}>
              <Text style={this.styles.buttontext}>Start Race</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }
    else {
      return (
        <View style={this.styles.button_row}>
          <TouchableHighlight style={this.styles.touch} onPress={this.stopRace}>
            <View style={this.styles.button}>
              <Text style={this.styles.buttontext}>Stop Race</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }
  }

  getRacesList() {
    var lisContent = this.getRacesListContent();
    
    return (
      <View style={this.styles.racelist}>
        <View style={this.styles.racelist_row}>
          <Text style={this.styles.racelist_hd}>Start</Text>
          <Text style={this.styles.racelist_hd}>Stop</Text>
          <Text style={this.styles.racelist_hd}>Time</Text>
          <Text style={this.styles.racelist_hd}>Speed</Text>
          <Text style={this.styles.racelist_hd}>Distance</Text>
        </View>
        {lisContent}
      </View>
    );
  }

  getRacesListContent () {
    if (this.props.races.length > 0) {

      const racesList = this.props.races.map((element) =>
        <View style={this.styles.racelist_row}>
          <Text style={this.styles.raceslist_td}>{SecondsToTimeFormat(element.start)}</Text>
          <Text style={this.styles.raceslist_td}>{SecondsToTimeFormat(element.stop)}</Text>
          <Text style={this.styles.raceslist_td}>{SecondsToTimeFormat(element.time)}</Text>
          <Text style={this.styles.raceslist_td}>{element.speed.toFixed(1)}</Text>
          <Text style={this.styles.raceslist_td}>{element.distance}</Text>
        </View>
      );
      
      return racesList;
    }
    else {
      return ( 
        <View style={this.styles.racelist_row}>
          <Text style={this.styles.noracesyet}>There was no races yet</Text>
        </View>
      );
    }
  }

  render () {
    var raceDateRow = this.getRaceDataRow();
    var buttonRow = this.getButtonRow();
    var racesList = this.getRacesList();

    return (
      <View style={this.styles.theblock}>
        <View style={this.styles.labels_row}>
          <Text style={this.styles.label}>Running Time</Text>
          <Text style={this.styles.label}>Running Distance</Text>
        </View>
        <View style={[this.styles.ctrls_row, {marginBottom:16}]}>
          <Text style={this.styles.ctrl_elem}>{SecondsToTimeFormat(this.props.runningTime)}</Text>
          <Text style={this.styles.ctrl_elem}>{this.props.runningDistance}</Text>
        </View>
        <View style={this.styles.labels_row}>
          <Text style={this.styles.label}>Race Time</Text>
          <Text style={this.styles.label}>Race Speed</Text>
          <Text style={this.styles.label}>Race Distance</Text>
        </View>
        {raceDateRow}
        {buttonRow}
        {racesList}
      </View>
    );
  }
}

class FinishedTraining extends Component {
  constructor(props) {
    super(props);

    this.styles = StyleSheet.create({
      theblock: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center'
      },
      finishtext: {
        fontSize: 20,
        color: 'white'
      }
    });
  }

  render () {
    return (
      <View style={this.styles.theblock}>
        <Text style={this.styles.finishtext}>training was finished</Text>
      </View>
    );
  }
}

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      status: "initial"
    };

    this.startTaraining = this.startTaraining.bind(this);
    this.updateRunningStatus = this.updateRunningStatus.bind(this);
    this.finishTaraining = this.finishTaraining.bind(this);
    this.storeTaraining = this.storeTaraining.bind(this);
    this.addRace = this.addRace.bind(this);

    this.styles = StyleSheet.create({
      appcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#607D8B'
      }
    });
  }

  startTaraining () {
    this.setState({
      status: "training",
      runningStatus: "walking",
      trainingTime: 0,
      runningTime: 0,
      runningDistance: 0,
      races: []
    });

    this.timeID = setInterval(
      () => this.trainingTick(),
      1000
    );
  }

  trainingTick () {
    this.setState((prevState, props) => ({
      trainingTime: prevState.trainingTime + 1
    }));
  }

  updateRunningStatus (runningStatus) {
    this.setState ({
      runningStatus: runningStatus
    });
  }

  addRace(raceData) {
    var updatedRaces = this.state.races.slice();
    updatedRaces.push(raceData);
    var updatedRunningTime = this.state.runningTime + raceData.time;
    var updatedRunningDistance = this.state.runningDistance + raceData.distance;
    this.setState({
      races: updatedRaces,
      runningTime: updatedRunningTime,
      runningDistance: updatedRunningDistance
    });
  }
  
  finishTaraining () {
    clearInterval(this.timeID);
    this.setState({
      status: "pending_store"
    });
  }

  storeTaraining () {
    this.setState({
      status: "initial"
    });
  }

  getContentBlock () {
    switch (this.state.status) {
      case "initial":
        return (
          <WelcomeBlock />
        );
        
      case "training":
        return (
          <ActiveTraining status={this.state.status} trainingTime={this.state.trainingTime}
            runningTime={this.state.runningTime} runningDistance={this.state.runningDistance} 
            runningStatus={this.state.runningStatus} races={this.state.races} 
            updateRunningStatus={this.updateRunningStatus} addRace={this.addRace} />
        );

      case "pending_store":
        return (
          <FinishedTraining />
        );

      default:
        break;
    }
  }

  render() {

    var contentBlock = this.getContentBlock();

    return (
      <View style={this.styles.appcontainer}>
        <StatusBar backgroundColor="#37474F" barStyle="light-content" hidden={false} />
        <TopControlBlock status={this.state.status} runningStatus={this.state.runningStatus} 
          startTaraining={this.startTaraining} finishTaraining={this.finishTaraining} storeTaraining={this.storeTaraining} />
        {contentBlock}
      </View>
    );
  }
}