import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useStudent } from '../../../hooks/useStudent';
import jwtDecode from 'jwt-decode';
import { AuthStore } from '../../../store/auth';

const FlashQRScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [decodedToken, setDecodedToken] = useState<{
    courseId: string;
    exp: number;
    iat: number;
  } | null>(null);
  const { tokenJWT } = AuthStore();
  const { scanQRCode, messageCode, setMessageCode } =
    useStudent(tokenJWT);

  useEffect(() => {
    (async () => {
      const { status } =
        await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: any) => {
    setMessageCode('');
    const decodedToken: any = jwtDecode(data);
    setDecodedToken(decodedToken);
    scanQRCode(tokenJWT, data, decodedToken.courseId);
    setIsScannerActive(false);
  };

  if (hasPermission === null)
    return <Text>En attente de la permission de la caméra</Text>;

  if (hasPermission === false)
    return <Text>Pas d'accès à la caméra</Text>;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isScannerActive ? (
        <>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <Text style={styles.centerText}>
            Veuillez scanner le QR Code du cours.
          </Text>
        </>
      ) : (
        <>
          <Button
            title="Open Camera"
            onPress={() => setIsScannerActive(true)}
          />
          {decodedToken ? (
            messageCode === 'QR Code has expired.' ||
            messageCode === 'Student already signed in' ? (
              <Text style={styles.redBox}>{messageCode}</Text>
            ) : (
              <Text style={styles.greenBox}>
                {decodedToken.courseId}
              </Text>
            )
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerText: {
    fontSize: 18,
    padding: 32,
    color: '#777',
    textAlign: 'center',
  },
  messageCode: {
    fontSize: 18,
    padding: 32,
    color: '#777',
    textAlign: 'center',
  },
  redBox: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
  greenBox: {
    width: 100,
    height: 100,
    backgroundColor: 'green',
  },
});

export default FlashQRScreen;

/** */
