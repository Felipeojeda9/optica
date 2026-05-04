import { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { api } from '../services/api';

type Cita = {
  id: number;
  fechaHora: string;
  estado: string;
  paciente?: {
    nombre: string;
  };
  profesional?: {
    nombre: string;
    especialidad: string;
  };
};

export default function CitasScreen() {
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);

  useEffect(() => {
    cargarCitas();
  }, []);

  async function cargarCitas() {
    try {
      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        router.replace('/');
        return;
      }

      const response = await api.get('/citas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCitas(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron cargar las citas');
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Mis citas</Text>

      <ScrollView style={{ marginTop: 20 }}>
        {citas.length === 0 ? (
          <Text>No tienes citas registradas.</Text>
        ) : (
          citas.map((cita) => (
            <View
              key={cita.id}
              style={{
                padding: 12,
                borderWidth: 1,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <Text>ID: {cita.id}</Text>
              <Text>Fecha: {new Date(cita.fechaHora).toLocaleString()}</Text>
              <Text>Estado: {cita.estado}</Text>
              <Text>Paciente: {cita.paciente?.nombre}</Text>
              <Text>
                Profesional: {cita.profesional?.nombre} -{' '}
                {cita.profesional?.especialidad}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <Button title="Volver al inicio" onPress={() => router.back()} />
    </View>
  );
}