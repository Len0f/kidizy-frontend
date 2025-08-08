import Constants from 'expo-constants';

export const getDevApiUrl = () => {
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
    if (debuggerHost) {
      return `http://${debuggerHost}:3000/`;
    }
    return 'http://localhost:3000/';
  }
  return 'http://localhost:3000/';
};