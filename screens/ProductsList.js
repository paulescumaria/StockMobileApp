import * as React from "react";
import {DataTable, Dialog, TextInput, IconButton, Modal, Portal, Text, Button, Provider} from "react-native-paper";
import { View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { styles } from "../styles";
import { stylesDropdown } from "../stylesDropdown";
import { ScrollView } from "react-native-gesture-handler";
import { MultiSelect } from "react-native-element-dropdown";
import {  doc,  setDoc, getDocs, collection, updateDoc, deleteDoc, arrayUnion} from "firebase/firestore";
import { db } from "../firebase";

const ProductsList = () => {
  const [stockList, setStockList] = useState([]);
  const [quantityProduct, setQuantityProduct] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [food, setFood] = useState("");
  const [sellPrice, setSellPrice] = useState(Number);
  const [filter, setFilter] = useState("");

  //modal for view the food ingredients
  const [foodModal, setFoodModal] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const showModal = (foodElement) => {
    setSelectedFood(foodElement);
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };
  const containerStyle = { backgroundColor: "white", padding: 20 };

  //Dialog for enter food and sellPrice
  const [visible, setVisible] = React.useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const showDialog = () => setVisibleDialog(true);
  const hideDialog = () => {
    setSellPrice(0);
    setFood("");
    setVisibleDialog(false);
  };

  //Dialog for ingredients
  const [visibleDialogIngredients, setVisibleDialogIngredients] =
    useState(false);
  const [foodDialog, setFoodDialog] = useState("");
  const showDialogIngredients = (food) => {
    setFoodDialog(food.food);
    setSellPrice(food.sellPrice);
    setVisibleDialogIngredients(true);
  };
  const hideDialogIngredients = () => {
    setVisibleDialogIngredients(false);
  };

  //DropDown
  const [selected, setSelected] = useState([]);
  const renderItem = (item) => {
    return (
      <View style={stylesDropdown.item}>
        <Text style={stylesDropdown.selectedTextStyle}>
          {item.label + " " + item.value.value + " (Kg)"}
        </Text>
      </View>
    );
  };

  const getStock = async () => {
    setStockList([]);
    const colRef = collection(db, "stock");
    let snapshots = await getDocs(colRef);
    let docs = snapshots.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      data.label = data.product;
      data.value = { label: data.product, value: data.quantity };
      return data;
    });
    setStockList(docs);
  };

  const getProducts = async () => {
    setProductsList([]);
    const colRef = collection(db, "products");
    let snapshots = await getDocs(colRef);
    let docs = snapshots.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
    setProductsList(docs);
  };

  useEffect(() => {
    getProducts();
    getStock();
  }, []);

  const addFood = async () => {
    if (food && sellPrice) {
      await setDoc(
        doc(db, "products", food?.toLowerCase().trim().replace(" ", "-")),
        {
          food: food,
          sellPrice: sellPrice,
          ingredients: [],
        }
      )
        .then(() => {
          //setProductList([...productList, {product: product, price: price, quantity: quantity}])
          console.log("product data save");
        })
        .catch((error) => {
          console.log(error);
        });
      // return <></>;

      await getProducts();
      await hideDialog();
    }
  };

  const addIngredients = async () => {
    var productsRef = doc(
      db,
      "products",
      foodDialog?.toLowerCase().trim().replace(" ", "-")
    );

    if (selected && quantityProduct && foodDialog) {
      const findElement = productsList.filter(
        (element) =>
          element.food.toLowerCase().trim().replace(" ", "-") ===
          foodDialog.toLowerCase().trim().replace(" ", "-")
      );

      if (findElement.length > -1) {
        const findIngredient = findElement[0].ingredients.filter((element) =>
          element.hasOwnProperty(selected[0].label)
        );

        if (findIngredient.length === 0) {
          await updateDoc(productsRef, {
            ingredients: arrayUnion({ [selected[0].label]: quantityProduct }),
          })
            .then(() => {
              console.log("product data save");
              setSelected([]);
              setQuantityProduct(0);
            })
            .catch((error) => {
              console.log(error);
            });
          await getProducts();
        }
      }
    }
    hideDialogIngredients();
  };

  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Text style={stylesDropdown.placeholderStyle}>Ingredients:</Text>
          <Text>{}</Text>
          {selectedFood &&
            selectedFood.ingredients.map((element, index) => {
              return (
                <Text key={"modal-text-" + index}>
                  {Object.keys(element)[0] +
                    "   " +
                    element[Object.keys(element)[0]] +
                    "Kg"}
                </Text>
              );
            })}
        </Modal>

        <Dialog visible={visibleDialog} onDismiss={hideDialog}>
          <Dialog.Title>Add a new Food in list</Dialog.Title>
          <Dialog.Content>
            <View>
              <TextInput
                placeholder="Food Name"
                value={food}
                onChangeText={(text) => {
                  setFood(text);
                }}
              ></TextInput>
              <TextInput
                placeholder="Sell Price "
                value={sellPrice}
                onChangeText={(text) => {
                  setSellPrice(text);
                }}
              ></TextInput>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={addFood}>Save</Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={visibleDialogIngredients}
          onDismiss={setVisibleDialogIngredients}
        >
          <Dialog.Title>
            Add Ingredients for <>{foodDialog}</>
          </Dialog.Title>
          <Dialog.Content>
            <View style={stylesDropdown.container}>
              <MultiSelect
                style={stylesDropdown.dropdown}
                placeholderStyle={stylesDropdown.placeholderStyle}
                selectedTextStyle={stylesDropdown.selectedTextStyle}
                inputSearchStyle={stylesDropdown.inputSearchStyle}
                iconStyle={stylesDropdown.iconStyle}
                data={stockList}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                value={selected}
                search
                searchPlaceholder="Search..."
                maxSelect={1}
                onChange={(item) => {
                  setSelected(item);
                }}
                renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => (
                  <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                    <View style={stylesDropdown.selectedStyle}>
                      <Text style={stylesDropdown.textSelectedStyle}>
                        {item.label}
                      </Text>
                      <IconButton
                        icon="delete"
                        color="black"
                        name="Safety"
                        size={20}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View>
              <TextInput
                placeholder="Quantity"
                value={quantityProduct}
                onChangeText={(text) => {
                  setQuantityProduct(text);
                }}
              ></TextInput>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={addIngredients}>Save</Button>
            <Button onPress={hideDialogIngredients}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* <Button style={{ marginTop: 30 }} onPress={showModal}>
        Show
      </Button> */}
      <View>
        <ScrollView>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Food Product</DataTable.Title>
              <DataTable.Title numeric>Price</DataTable.Title>
              <DataTable.Title numeric>View </DataTable.Title>
              <DataTable.Title numeric>Delete</DataTable.Title>
            </DataTable.Header>
            {productsList
              .filter((element) =>
                filter !== ""
                  ? element.food
                      .toString()
                      .toLowerCase()
                      .trim()
                      .includes(filter.toString().toLowerCase().trim())
                  : element
              )
              .map((element, index) => {
                return (
                  <DataTable.Row
                    key={"datatable-row-" + index}
                    onPress={() => showDialogIngredients(element)}
                  >
                    <DataTable.Cell>{element.food}</DataTable.Cell>
                    <DataTable.Cell numeric>{element.sellPrice}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      <IconButton
                        icon="eye"
                        size={25}
                        onPress={() => showModal(element)}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <IconButton
                        icon="delete"
                        size={25}
                        onPress={async () => {
                          await deleteDoc(
                            doc(
                              db,
                              "products",
                              element.food
                                .toLowerCase()
                                .trim()
                                .replace(" ", "-")
                            )
                          ).then(() => getProducts());
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
              + Add Food
            </Button>
          </View>
        </ScrollView>
      </View>
    </Provider>
  );
};

export default ProductsList;

