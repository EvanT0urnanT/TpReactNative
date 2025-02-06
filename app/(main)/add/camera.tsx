import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from 'expo-router';

const CameraScreen = () => {
    const [hasPermission, setHasPermission] = useState(false);
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    const [permission, requestPermission] = useCameraPermissions();


    useEffect(() => {
        if (permission && !permission.granted && permission.canAskAgain) {
            requestPermission();
        }
    }, [permission]);

    const handleBarCodeScanned = ({ type, data }: any) => {
        setScanned(true);
        alert(`QR Code scanné avec succès: ${data}`);
    };

    if (!permission) {
        return <Text>Pas de permission caméra</Text>;
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CameraView
                style={{ width: '100%', height: '100%' }}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            {scanned && (
                <Button title={'Scanner à nouveau'} onPress={() => setScanned(false)} />
            )}
        </View>
    );
};

export default CameraScreen;
