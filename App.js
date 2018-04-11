import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight, StatusBar, Image } from 'react-native';

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

class ActiveTraining extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      speed: 8.6
    };

    this.startRace = this.startRace.bind(this);
    this.stopRace = this.stopRace.bind(this);

    this.styles = StyleSheet.create({
      theblock: {
        flex: 5,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
      },
      labels_row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
      },
      ctrls_row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
      },
      button_row: {
        flex: 4,
        justifyContent: 'center'
      },
      ctrl_elem: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'white',
        color: 'white'
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
        padding: 20,
        backgroundColor: '#455A64'
      },
      buttontext: {
        fontSize: 20,
        color: 'white',
      }      
    });
  }

  startRace () {
    let startRaceTime = 0;
    while (startRaceTime < this.props.trainingTime + 15) {
      startRaceTime += 30;
    }
    let timeAhead = startRaceTime - this.props.trainingTime;

    this.props.updateRunningStatus("starting");

    this.setState({
      start: startRaceTime,
      time: timeAhead
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
      
      /*
      this.props.addRace({
        start: this.state.start,
        stop: stoptime,
        time: this.state.time,
        speed: this.state.speed,
        distance: distance
      });
      */
    }

    this.props.updateRunningStatus("walking");
  
    this.setState({
      time: 0
    });
  }

  raceTick () {
    if (this.props.runningStatus === "starting") {
      this.setState((prevState, props) => ({
        time: prevState.time - 1
      }));
    }
    else {
      this.setState((prevState, props) => ({
        time: prevState.time + 1
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

    if (this.props.runningStatus === "starting")
      raceTimeColor.color = "red";
    else if (this.props.runningStatus === "running")
      raceTimeColor.color = "lime";

    return (
      <View style={this.styles.ctrls_row}>
        <Text style={this.styles.ctrl_elem}>{this.state.speed}</Text>
        <Text style={[this.styles.ctrl_elem, raceTimeColor]}>{SecondsToTimeFormat(this.state.time)}</Text>
        <Text style={this.styles.ctrl_elem}>0</Text>
      </View>
    );
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

  render () {
    var raceDateRow = this.getRaceDataRow();
    var buttonRow = this.getButtonRow();

    return (
      <View style={this.styles.theblock}>
        <View style={this.styles.labels_row}>
          <Text style={this.styles.ctrl_elem}>Running Time</Text>
          <Text style={this.styles.ctrl_elem}>Running Distance</Text>
        </View>
        <View style={this.styles.ctrls_row}>
          <Text style={this.styles.ctrl_elem}>{SecondsToTimeFormat(this.props.runningTime)}</Text>
          <Text style={this.styles.ctrl_elem}>{this.props.runningDistance}</Text>
        </View>
        <View style={this.styles.labels_row}>
          <Text style={this.styles.ctrl_elem}>Race Speed</Text>
          <Text style={this.styles.ctrl_elem}>Race Time</Text>
          <Text style={this.styles.ctrl_elem}>Race Distance</Text>
        </View>
        {raceDateRow}
        {buttonRow}
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