import { Alert } from 'react-native';

export function confirmDelete(itemName: string): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza de que deseja excluir ${itemName}?`,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Excluir', style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
