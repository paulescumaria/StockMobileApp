import * as React from 'react';
import { View } from 'react-native';
import { Button, Paragraph, Dialog, Portal, Provider, RadioButton, Text} from 'react-native-paper';

const DialogCom = () => {
  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState('Option 1');
  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  return (
    <Provider>
      <View>
        <Button onPress={showDialog}>Show Dialog</Button>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Choose an option</Dialog.Title>
            <Dialog.Content>
             <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
              <View>
               <Text>Option 1</Text>
               <RadioButton value="option 1" />
              </View>
              <View>
               <Text>Option 2</Text>
               <RadioButton value="option 2" />
              </View>
              <View>
               <Text>Option 3</Text>
               <RadioButton value="option 3" />
              </View>
             </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>OK</Button>
              <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

export default DialogCom;