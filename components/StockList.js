import * as React from "react";
import {
  DataTable,
  Button,
  Dialog,
  Portal,
  Provider,
  TextInput,
  IconButton,
} from "react-native-paper";
import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { styles } from "../styles";
import { ScrollView } from "react-native-gesture-handler";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const StockList = () => {
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState(Number);
  const [quantity, setQuantity] = useState(Number);
  const [stockList, setStockList] = useState([]);
  const [filter, setFilter] = useState("");

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setProduct("");
    setPrice("");
    setQuantity("");
  };

  const getData = async () => {
    setStockList([]);
    const colRef = collection(db, "stock");
    let snapshots = await getDocs(colRef);
    let docs = snapshots.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
    setStockList(docs);
  };

  useEffect(() => {
    getData();
  }, []);

  const addProduct = async () => {
    //dupa ce adaugi in baza de date faci pop-upul invizibil
    //iterare lista ppentru verificare repetare produs, daca da, atunci schimbam variabila din useEffect pentru a-l randa
    //astfel isi ia noile modificari din db
    let isAdded = false;

    if (product && price && quantity) {
      const findElement = stockList.filter(
        (element) =>
          element.product.toLowerCase().trim() === product.toLowerCase().trim()
      );
      if (findElement.length > 0) {
        await setDoc(
          doc(db, "stock", product.toLowerCase().trim()),
          {
            quantity: +quantity + +findElement[0].quantity,
            price: price,
          },
          { merge: true }
        ).then(() => {
          isAdded = true;
        });
      } else {
        await setDoc(doc(db, "stock", product), {
          product: product,
          price: price,
          quantity: quantity,
        })
          .then(() => {
            //setProductList([...productList, {product: product, price: price, quantity: quantity}])
            isAdded = true;
            console.log("product data save");
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (isAdded) {
        getData();
      }
    }
    hideDialog();
  };

  return (
    <Provider>
      <View>
        <ScrollView>
          <TextInput
            placeholder="Filter by product name"
            value={filter}
            onChangeText={(text) => {
              setFilter(text);
            }}
          ></TextInput>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Product</DataTable.Title>
              <DataTable.Title numeric>Price/Kg</DataTable.Title>
              <DataTable.Title numeric>Quantity/Kg</DataTable.Title>
              <DataTable.Title> {"       "}</DataTable.Title>
            </DataTable.Header>
            {stockList
              .filter((element) =>
                filter !== ""
                  ? element.product
                      .toString()
                      .toLowerCase()
                      .trim()
                      .includes(filter.toString().toLowerCase().trim())
                  : element
              )
              .map((element, index) => {
                return (
                  <DataTable.Row key={"datatable-row-" + index}>
                    <DataTable.Cell>{element.product}</DataTable.Cell>
                    <DataTable.Cell numeric>{element.price}</DataTable.Cell>
                    <DataTable.Cell numeric>{element.quantity}</DataTable.Cell>
                    <DataTable.Cell>
                      <Text>{"           "}</Text>
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={async () => {
                          await deleteDoc(
                            doc(db, "stock", element.product)
                          ).then(() => getData());
                        }}
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}
          </DataTable>
          <View>
            <Button
              mode="contained"
              onPress={showDialog}
              style={styles.buttonAddProduct}
            >
              + Add Product
            </Button>
            <Portal>
              <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Add a new product in list</Dialog.Title>
                <Dialog.Content>
                  <View>
                    <TextInput
                      placeholder="Product Name"
                      value={product}
                      onChangeText={(text) => {
                        setProduct(text);
                      }}
                    ></TextInput>
                    <TextInput
                      placeholder="Price/kg"
                      value={price}
                      onChangeText={(text) => {
                        setPrice(text);
                      }}
                    ></TextInput>
                    <TextInput
                      placeholder="Quantity/kg"
                      value={quantity}
                      onChangeText={(text) => {
                        setQuantity(text);
                      }}
                    ></TextInput>
                  </View>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={addProduct}>Save</Button>
                  <Button onPress={hideDialog}>Cancel</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </View>
        </ScrollView>
      </View>
    </Provider>
  );
};

export default StockList;
