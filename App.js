import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight, StatusBar, Image, TextInput, Modal, ActivityIndicator } from 'react-native';

const RaceTimeQuant = 30;

function SecondsToTimeFormat(seconds) {
  if (seconds.isNull || seconds.isNaN)
    return "";

  var sHours = parseInt(seconds / 3600, 10).toString();
  while (sHours.length < 2) {
    sHours = '0' + sHours;
  }

  var sMinutes = parseInt(seconds % 3600 / 60, 10).toString();
  while (sMinutes.length < 2) {
    sMinutes = '0' + sMinutes;
  }

  var sSeconds = parseInt(seconds % 60, 10).toString();
  while (sSeconds.length < 2) {
    sSeconds = '0' + sSeconds;
  }

  if (seconds >= 3600)
    return sHours + ":" + sMinutes + ":" + sSeconds;  
  else
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
      },
      progress_hldr: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },
      progress_text: {
        fontSize: 20,
        color: 'lime',
        padding: 20
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

      case "pending_distance":
        return (
          <TouchableHighlight style={this.styles.touch} underlayColor={'transparent'}>
            <View style={[this.styles.button, this.styles.button_dis]}>
              <Text style={[this.styles.buttontext, this.styles.buttontext_dis]}>Store Training</Text>
            </View>
          </TouchableHighlight>
        );

      case "pending_store":
        return (
          <TouchableHighlight onPress={this.onStoreTaraining} style={this.styles.touch} underlayColor={'transparent'}>
            <View style={[this.styles.button, this.styles.button_en]}>
              <Text style={[this.styles.buttontext, this.styles.buttontext_en]}>Store Training</Text>
            </View>
          </TouchableHighlight>
        );

      case "storing":
        return (
          <View style={this.styles.progress_hldr}>
            <ActivityIndicator color={'lime'} size={'small'} />
            <Text style={this.styles.progress_text}>Storing...</Text>
          </View>
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
    var newValue = Math.floor((this.props.value - this.props.step) * 10) / 10;
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

class RacesList extends Component {
  constructor(props) {
    super(props);

    this.styles = StyleSheet.create({
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
}

class ActiveTraining extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      speed: 8.0,
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
      }
    });
  }

  startRace () {
    let startRaceTime = Math.floor(this.props.trainingTime / RaceTimeQuant) * RaceTimeQuant + RaceTimeQuant;
    let phisicalStartRaceTime = this.props.physicalStartTime + startRaceTime * 1000;

    this.props.updateRunningStatus("starting");

    var timeAhead = Math.round((phisicalStartRaceTime - Date.now()) / 1000);
    this.setState({
      phisicalStartRaceTime: phisicalStartRaceTime,
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
      // quantize the time and check that it is greater than zero
      var quantizedTime = parseInt(this.state.time / RaceTimeQuant) * RaceTimeQuant;
      if (quantizedTime > 0) {
        var stoptime = this.state.start + quantizedTime;
        var distance = parseInt(this.state.speed * 1000 / 3600 * quantizedTime, 10);
        
        this.props.addRace({
          start: this.state.start,
          stop: stoptime,
          time: quantizedTime,
          speed: this.state.speed,
          distance: distance
        });  
      }
    }

    this.props.updateRunningStatus("walking");
  
    this.setState({
      time: 0,
      distance: 0
    });
  }

  raceTick () {
    // until phisicalStartRaceTime acheived update time ahead, then switch to mode 'running'
    if (this.props.runningStatus === "starting") {  
      var timeAhead = Math.round((this.state.phisicalStartRaceTime - Date.now()) / 1000);
      if (timeAhead > 0) {
        this.setState({
          time: timeAhead
        });
      }
      else {  // switch to running
        this.props.updateRunningStatus("running");
      }
    }
    
    // when actually running update actual time and distance
    if (this.props.runningStatus === "running") {  
      var time = Math.floor((Date.now() - this.state.phisicalStartRaceTime) / 1000);
      var distance = parseInt(this.state.speed * 1000 / 3600 * time, 10);
      this.setState({
        time: time,
        distance: distance
      });
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

  render () {
    var raceDateRow = this.getRaceDataRow();
    var buttonRow = this.getButtonRow();

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
        <RacesList races={this.props.races} />
      </View>
    );
  }
}

class FinishedTraining extends Component {
  constructor(props) {
    super(props);

    var maxRunningTime = 0;
    var maxRunningDistance = 0;
    this.props.races.forEach(element => {
      if (element.time > maxRunningTime)
        maxRunningTime = element.time;
      if (element.time * element.speed > maxRunningDistance)
        maxRunningDistance = Math.floor(element.time * element.speed * 1000 / 3600);
    });

    this.onTrainingDistanceChanged = this.onTrainingDistanceChanged.bind(this);

    this.state = {
      maxRunningTime: maxRunningTime,
      maxRunningDistance: maxRunningDistance
    };

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
      distinput_holder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      distinput: {
        width: 70,
        padding: 1,
        fontSize: 20,
        backgroundColor: 'white',
        color: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#263238'
      }
    });
  }

  onTrainingDistanceChanged (value) {
    this.props.setTrainingDistance(parseInt(value));
  }

  render () {
    return (
      <View style={this.styles.theblock}>
        <View style={this.styles.labels_row}>
          <Text style={this.styles.label}>Max Running</Text>
          <Text style={this.styles.label}>Total Running</Text>
          <Text style={this.styles.label}>Running Distance</Text>
        </View>
        <View style={this.styles.ctrls_row}>
          <Text style={this.styles.ctrl_elem}>{SecondsToTimeFormat(this.state.maxRunningTime)}</Text>
          <Text style={this.styles.ctrl_elem}>{SecondsToTimeFormat(this.props.runningTime)}</Text>
          <Text style={this.styles.ctrl_elem}>{this.props.runningDistance}</Text>
        </View>
        <View style={this.styles.labels_row}>
          <Text style={this.styles.label}>Training Time</Text>
          <Text style={this.styles.label}>Training Distance</Text>
        </View>
        <View style={[this.styles.ctrls_row, {marginBottom:20}]}>
          <Text style={this.styles.ctrl_elem}>{SecondsToTimeFormat(this.props.trainingTime)}</Text>
          <View style={this.styles.distinput_holder}>
            <TextInput keyboardType='numeric' maxLength={5} style={this.styles.distinput} 
              underlineColorAndroid='transparent' onChangeText={this.onTrainingDistanceChanged} />
          </View>
        </View>        
        <RacesList races={this.props.races} />
      </View>
    );
  }
}

class StoreResultDialog extends Component {
  constructor(props) {
    super(props);

    this.onOK = this.onOK.bind(this);
    this.onRetry = this.onRetry.bind(this);
    this.onCancel = this.onCancel.bind(this);

    this.styles = StyleSheet.create({
      themodal: {
        flex: 1,
        backgroundColor:'rgba(255,255,255,0.6)',
        justifyContent: 'flex-start',
        alignItems: 'center'
      },
      modal_ctn: {
        width: '80%',
        marginTop: 180,
        alignItems: 'center',
        backgroundColor: '#ECEFF1',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        padding: 20
      },
      modal_header_ok: {
        marginTop: 5,
        color: 'green',
        textAlign: 'center'
      },
      modal_header_error: {
        marginTop: 5,
        color: 'red',
        textAlign: 'center'
      },      
      modal_message: {
        marginTop: 5,
        color: 'black',
        textAlign: 'center'
      },
      modal_buttons_block: {
        flexDirection: 'row',
        justifyContent: 'center'        
      },
      modal_button: {
        width: 80,
        textAlign: 'center',
        marginTop: 16,
        backgroundColor: '#455A64',
        color: 'white',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        padding: 8
      },
      modal_buttonspace: {
        width: 30
      }
    });    
  }

  onOK () {
    this.props.closeStoreResultDialog();
    this.props.backToWelcome();
  }

  onRetry () {
    this.props.closeStoreResultDialog();
    this.props.backToPendingStore();
  }

  onCancel () {
    this.props.closeStoreResultDialog();
    this.props.backToWelcome();
  }

  render () {
    if (this.props.storeResult) {
      return (
        <Modal animationType="fade" transparent={true} presentationStyle={'overFullScreen'} visible={this.props.visible}>
          <View style={this.styles.themodal}>
            <View style={this.styles.modal_ctn}>
              <Text style={this.styles.modal_header_ok}>Training was successfully stored{'\n'}at Baritzakala server</Text>
              <TouchableHighlight onPress={this.onOK}>
                <Text style={this.styles.modal_button}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>  
      );
    }
    else {
      return (
        <Modal animationType="fade" transparent={true} presentationStyle={'overFullScreen'} visible={this.props.visible}>
          <View style={this.styles.themodal}>
            <View style={this.styles.modal_ctn}>
              <Text style={this.styles.modal_header_error}>Training store was failed</Text>
              <Text style={this.styles.modal_message}>{this.props.storeResultDialogMessage}</Text>
              <View style={this.styles.modal_buttons_block}>
                <TouchableHighlight onPress={this.onRetry}>
                  <Text style={this.styles.modal_button}>Retry</Text>
                </TouchableHighlight>
                <View style={this.styles.modal_buttonspace}></View>
                <TouchableHighlight onPress={this.onCancel}>
                  <Text style={this.styles.modal_button}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>  
      );
    }
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: "initial",
      storeResultDialogVisible: false
    };

    this.startTaraining = this.startTaraining.bind(this);
    this.updateRunningStatus = this.updateRunningStatus.bind(this);
    this.finishTaraining = this.finishTaraining.bind(this);
    this.storeTaraining = this.storeTaraining.bind(this);
    this.addRace = this.addRace.bind(this);
    this.setTrainingDistance = this.setTrainingDistance.bind(this);
    this.closeStoreResultDialog = this.closeStoreResultDialog.bind(this);
    this.backToWelcome = this.backToWelcome.bind(this);
    this.backToPendingStore = this.backToPendingStore.bind(this);

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
      physicalStartTime: Date.now(),
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
    this.setState({
      trainingTime: Math.floor((Date.now() - this.state.physicalStartTime) / 1000)
    });
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
      status: "pending_distance",
      trainingDistance: 0
    });
  }

  setTrainingDistance (value) {
    this.setState({
      status: "pending_store",
      trainingDistance: value
    });
  }

  storeTaraining () {
    this.setState({
      status: "storing"
    });

    this.callStoreTraining();
  }

  callStoreTraining = async () => {
    var Today = Date.now();
    var maxRunningTime = 0;
    var maxRunningDistance = 0;
    this.state.races.forEach(element => {
      if (element.time > maxRunningTime)
        maxRunningTime = element.time;
      if (element.time * element.speed > maxRunningDistance)
        maxRunningDistance = Math.floor(element.time * element.speed * 1000 / 3600);
    });

    var stateToStore = {
      TrainingDate: Today,
      MaxRunningTime: maxRunningTime,
      MaxRunningDistance: maxRunningDistance,
      TotalRunningTime: this.state.runningTime,
      TotalRunningDistance: this.state.runningDistance,
      TrainingTime: this.state.trainingTime,
      TrainingDistance: this.state.trainingDistance, 
      races: this.state.races
    };

    try {
      await fetch('https://baritzakala.herokuapp.com/api/storetraining', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(stateToStore)
      })
      .then(response => {
        if (response.ok) {
          return response.json()
          .then((responseData) => {
            // responseData contains json object with actual server response,
            // in this case it should be {result:'ok'}
            this.setState({
              storeResultDialogVisible: true,
              storeResult: true
            });
          });
        }
        else {
          this.setState({
            storeResultDialogVisible: true,
            storeResult: false,
            storeResultDialogMessage: 'Response is NOT ok]'
          });  
        }
      }).catch(error => {
        this.setState({
          storeResultDialogVisible: true,
          storeResult: false,
          storeResultDialogMessage: 'Catch: [' + error + ']'
        });
      });
    }
    catch(error) {
      this.setState({
        storeResultDialogVisible: true,
        storeResult: false,
        storeResultDialogMessage: 'Eexception: [' + error.message + ']'
      });
    }
  }

  closeStoreResultDialog () {
    this.setState({
      storeResultDialogVisible: false
    });
  }

  backToWelcome () {
    this.setState({
      status: "initial"
    });
  }

  backToPendingStore () {
    this.setState({
      status: "pending_store"
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
          <ActiveTraining status={this.state.status} physicalStartTime={this.state.physicalStartTime}
            trainingTime={this.state.trainingTime} runningTime={this.state.runningTime} 
            runningDistance={this.state.runningDistance} 
            runningStatus={this.state.runningStatus} races={this.state.races} 
            updateRunningStatus={this.updateRunningStatus} addRace={this.addRace} />
        );

      case "pending_distance":
      case "pending_store":
      case "storing":
        return (
          <FinishedTraining status={this.state.status} trainingTime={this.state.trainingTime} 
          trainingDistance={this.state.trainingDistance} runningTime={this.state.runningTime} 
          runningDistance={this.state.runningDistance} races={this.state.races}
          setTrainingDistance={this.setTrainingDistance} />
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
        <StoreResultDialog visible={this.state.storeResultDialogVisible} storeResult={this.state.storeResult} 
          storeResultDialogMessage={this.state.storeResultDialogMessage} 
          closeStoreResultDialog={this.closeStoreResultDialog} backToWelcome={this.backToWelcome} backToPendingStore={this.backToPendingStore} />
      </View>
    );
  }
}