import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../../hooks/useAuth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();

  const handleLogin = () => {
    console.log('Login...');
    login(email, password);
  };

  const { container, input, textInput } = styles;

  return (
    <View style={container}>
      <Text style={textInput}>Email</Text>
      <TextInput
        style={input}
        value={email}
        onChangeText={setEmail}
        placeholder={'Email'}
      />
      <Text style={textInput}>Password</Text>
      <TextInput
        style={input}
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
        placeholder={'Email'}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: 300,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  textInput: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default LoginScreen;
