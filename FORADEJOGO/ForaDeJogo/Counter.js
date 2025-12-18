import React, {Component} from "react";
import {View, Text, Button} from "react-native";
class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {count: 0, };
    }
    handleClick = () => {
        let val = this.state.count;
        val = val + 1;
        this.setState({count: val});
    };
    render() {
        const count = this.state.count;
        return (
            <View>
                <Button onPress={this.handleClick} title="Click here" />
                <Text>{count}</Text>
            </View>
        );
    }
}
export default Counter;