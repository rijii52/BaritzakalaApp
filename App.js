import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  StatusBar
} from 'react-native';

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
        borderBottomColor: '#CFD8DC',
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
        padding: 10,
        backgroundColor: '#455A64'
      },
      buttontext: {
        fontSize: 20,
        color: 'white',
      },
      disbuttontext: {
        fontSize: 20,
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
          <TouchableHighlight onPress={this.onStartTaraining} style={this.styles.touch}>
            <View style={this.styles.button}>
              <Text style={this.styles.buttontext}>Start Training</Text>
            </View>
          </TouchableHighlight>
        );
        
      case "training":
        if (this.props.runningStatus === "walking") {
          return  (
            <TouchableHighlight onPress={this.onFinishTaraining} style={this.styles.touch}>
              <View style={this.styles.button}>
                <Text style={this.styles.buttontext}>Finish Training</Text>
              </View>
            </TouchableHighlight>
            );
          }
        else {
          return  (
            <TouchableHighlight style={this.styles.touch}>
              <View style={this.styles.button}>
                <Text style={this.styles.disbuttontext}>Store Training</Text>
              </View>
            </TouchableHighlight>
          );
        }

      case "pending_store":
        return (
          <TouchableHighlight onPress={this.onStoreTaraining} style={this.styles.touch}>
            <View style={this.styles.button}>
              <Text style={this.styles.buttontext}>Store Training</Text>
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
    welcometext: {
      fontSize: 20,
      color: 'white'
    }
  });
}

  render () {
    return (
      <View style={this.styles.theblock}>
        <Text style={this.styles.welcometext}>Welcome to Baritzakala!</Text>
      </View>
    );
  }
}

class ActiveTraining extends Component {
  constructor(props) {
    super(props);

    this.onRunning = this.onRunning.bind(this);
    this.onWalking = this.onWalking.bind(this);

    this.styles = StyleSheet.create({
      theblock: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center'
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
        padding: 10,
        backgroundColor: '#455A64'
      },
      buttontext: {
        fontSize: 20,
        color: 'white',
      }      
    });
  }

  onRunning () {
    this.props.updateRunningStatus("running");
  }

  onWalking () {
    this.props.updateRunningStatus("walking");
  }

  getButton () {
    if (this.props.runningStatus === "running") {
      return (
        <TouchableHighlight style={this.styles.touch} onPress={this.onWalking}>
          <View style={this.styles.button}>
            <Text style={this.styles.buttontext}>Stop Race</Text>
          </View>
        </TouchableHighlight>
      );
    }
    else {
      return (
        <TouchableHighlight style={this.styles.touch} onPress={this.onRunning}>
          <View style={this.styles.button}>
            <Text style={this.styles.buttontext}>Start Race</Text>
          </View>
        </TouchableHighlight>
      );
    }
  }

  render () {

    var button = this.getButton();

    return (
      <View style={this.styles.theblock}>
        {button}
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
      runningStatus: "walking"
    });
  }

  updateRunningStatus (runningStatus) {
    this.setState ({
      runningStatus: runningStatus
    });
  }

  finishTaraining () {
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
          <ActiveTraining runningStatus={this.state.runningStatus} updateRunningStatus={this.updateRunningStatus} />
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