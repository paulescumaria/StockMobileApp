import * as React from "react";
import { TextInput,  IconButton,  DataTable,  Provider,  Button, Portal, Dialog} from "react-native-paper";
import { View, Text, TouchableOpacity} from "react-native";
import { useState, useEffect } from "react";
import { styles } from "../styles";
import { stylesDropdown } from "../stylesDropdown";
import { ScrollView } from "react-native-gesture-handler";
import { MultiSelect } from "react-native-element-dropdown";
import { doc, setDoc, collection, getDocs, documentId, arrayUnion, updateDoc, deleteDoc, deleteField, FieldValue, addDoc, getDoc} from "firebase/firestore";
import { db } from "../firebase";

const SelectTables = () => {
  const [tableNumber, setTableNumber] = useState(Number);
  const [status, setStatusTabel] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [tablesList, setTablesList] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [quantityProductOrder, setQuantityProductOrder] = useState(Number);
  const [ingredientsList, setIngredientsList] = useState([])
  const [productsOrderList, setProductsOrderList] = useState([])
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedIndexTable, setSelectedIndexTable] = useState('');
  const [productOrder, setProductOrder] = useState("")
  const [canAddedProd, setCanAddedProd] = useState(true);

  let index = 0;


  //DropDown
  const [selected, setSelected] = useState([]);
  const renderItem = (item) => {
    return (
      <View style={stylesDropdown.item}>
        <Text style={stylesDropdown.selectedTextStyle}>
          {item.label}
        </Text>
      </View>
    );
  };

  //Dialog for add products in order to selected table
  const [visible, setVisible] = React.useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const showDialog = () => setVisibleDialog(true);
  const hideDialog = () => {setVisibleDialog(false)}

  //Dialog for view/edit order
  const [visibleDialogView, setVisibleDialogView] = useState(false);
  const showDialogView = (selectedElement) => {
    setVisibleDialogView(true);
    setSelectedTable(selectedElement);
  }
  const hideDialogView = () => setVisibleDialogView(false);



  const getStock = async () => {
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


  const getProducts = async () => {
    setProductsList([]);
    const colRef = collection(db, "products");
    let snapshots = await getDocs(colRef);
    let docs = snapshots.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      data.label = data.food;
      data.value = { label: data.food };
      return data;
    });

    setProductsList(docs);
  };

  const getOrders = async () => {
    setProductsOrderList([]);
    const colRef = collection(db, "orders");
    let snapshots = await getDocs(colRef);
    // let docs = ;
    setProductsOrderList(snapshots.docs.map((doc) => {
      const data = doc.data();
      return data;
    }));
  };

 const getData = async () => {
      await getProducts();
      await getStock();
      await getOrders();
    }
    
  useEffect(() => {
   
    getData();
  }, []);


  const addProductsInOrder = async () => {

      if (selected.length > 0 && selectedIndexTable.length > 0 && selectedTable &&
         quantityProductOrder && productsList.length > 0 && stockList.length > 0 && visibleDialog) {
         let canBeInOrder = true;
         let canModifyInDatabase = true;
        // productsOrderList[0][selectedIndexTable].map((element, index) => {
        //     Object.keys(element).map(foodName => {
              const getFoodData = productsList.filter((foodElem) => 
              foodElem.food.toString().toLowerCase() === selected[0].label.toString().toLowerCase());
              
              if (getFoodData.length > 0) {
                getFoodData[0].ingredients.map(product => {
                  const findProduct = stockList.filter(productElem => productElem.product.toLowerCase() === Object.keys(product)[0].toLowerCase());

                  if (findProduct.length > 0) {
                      const isInStock = (+findProduct[0].quantity) - ((+quantityProductOrder) * (+product[Object.keys(product)[0]]));
                      
                      if (isInStock < 0) {
                        canBeInOrder = false;
                        canModifyInDatabase = false;
                      }
                  } else {
                    canBeInOrder = false;
                  }
                })
              } else {
                canBeInOrder = false;
              }

        //     })
        // })
        if (canBeInOrder && canModifyInDatabase) {

          const getFoodData = productsList.filter((foodElem) => 
          foodElem.food.toString().toLowerCase() === selected[0].label.toString().toLowerCase());
          
          if (getFoodData.length > 0) {
            await Promise.all(getFoodData[0].ingredients.map(product => {
              const findProduct = stockList.filter(productElem => productElem.product.toLowerCase() === Object.keys(product)[0].toLowerCase());

              if (findProduct.length > 0) {
                  const isInStock = (+findProduct[0].quantity) - ((+quantityProductOrder) * (+product[Object.keys(product)[0]]));
                  
                  if (isInStock >= 0) {
                    return new Promise(async (promise, reject) => {
                      try {
                        const response = await updateDoc(doc(
                          db,
                          "stock",
                          findProduct[0].product
                        ), {
                          quantity: isInStock
                        }, { merge: true });
                        return promise(response);
                      } catch (error) {
                        return reject(error);
                      }
                  });
                  }
              }
            })).then(async res => {
              
              await updateDoc(doc(
                db,
                "orders",
                'table'
              ), {
                [selectedIndexTable]: arrayUnion({[selected[0].label]: quantityProductOrder})
              })
                .then(async () => {
                  console.log("order data save");
                  setSelected([]);
                  setQuantityProductOrder(0);
 
                  await getData();

                  setCanAddedProd(true);
                  hideDialog();   
                })
                .catch((error) => {
                  console.log(error);
                });
            })
          }
    
        } else {
          // setTimeout(() => {
            setCanAddedProd(false);
            setSelected([]);
            setQuantityProductOrder(0);
            // hideDialog(); 
          // }, 2000)
        }

      }
    };

  const emitRecepit = async () => {
    console.log("emit the recipe")
    if (selectedTable && selectedIndexTable) {
      const getDate = new Date().toLocaleDateString('en-GB').split('/').join('-');

      await setDoc(doc(db, "orders-complete", getDate), {}, { merge: true })

      const colRef = doc(db, "orders-complete", getDate);
      let snapshots = await getDoc(colRef);
      const docData = snapshots.data();
      console.log(docData);
      if (docData) {
        if (docData.hasOwnProperty(selectedIndexTable)) {
          const oldOrdersCompleted = docData[selectedIndexTable];
          let newOrdersCompleted = selectedTable;
          
          if (oldOrdersCompleted?.length > 0) {
            newOrdersCompleted = newOrdersCompleted.concat(oldOrdersCompleted);
          }

          await updateDoc(doc(
            db,
            "orders-complete",
            getDate
          ), {
            [selectedIndexTable]: newOrdersCompleted
          })
            .then(async () => {
              console.log("order data save");

              await updateDoc(doc(
                db,
                "orders",
                'table'
              ), {
                [selectedIndexTable]: []
              })
                .then(async () => {
                  console.log("order data save");

                  setSelected([]);
                  setSelectedIndexTable(0);
 
                  await getData();

                  hideDialogView();   
                })
                .catch((error) => {
                  console.log(error);
                });
 
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          await updateDoc(doc(
            db,
            "orders-complete",
            getDate
          ), {
            [selectedIndexTable]: selectedTable
          })
            .then(async () => {
              await updateDoc(doc(
                db,
                "orders",
                'table'
              ), {
                [selectedIndexTable]: []
              })
                .then(async () => {
                  console.log("order data save");

                  setSelected([]);
                  setSelectedIndexTable(0);
 
                  await getData();

                  hideDialogView();   
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        await updateDoc(doc(
          db,
          "orders-complete",
          getDate
        ), {
          [selectedIndexTable]: selectedTable
        })
          .then(async () => {
            await updateDoc(doc(
              db,
              "orders",
              'table'
            ), {
              [selectedIndexTable]: []
            })
              .then(async () => {
                console.log("order data save");

                setSelected([]);
                setSelectedIndexTable(0);

                await getData();

                hideDialogView();   
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }

    }
  }

  const deleteTable = async (tableIndex) => {
    if (tableIndex) {
      await updateDoc(doc(
        db,
        "orders",
        'table'
      ), {
        [tableIndex]: deleteField(),
      })
        .then(async () => {
          console.log("product data save");
          await getOrders();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const addTable = async () => {
    //press button to add new row table
    if (productsOrderList && productsOrderList.length > 0) {
      let findIndex = 1;
      Object.keys(productsOrderList[0]).map((element) => {
        if (Object.keys(productsOrderList[0]).filter(item => +item === findIndex).length === 0) {

        } else {
          findIndex++;
        }
      })
        await updateDoc(doc(
        db,
        "orders",
        'table'
      ), {
        [findIndex]: [],
      })
        .then(async () => {
          console.log("product data save");
          await getOrders();
        })
        .catch((error) => {
          console.log(error);
        });
    } 
  };

  const deleteProductFromOrder = async (productIndex) => {
    
      if (selectedIndexTable.length > 0 && productsOrderList) {
        const findIndexTable = Object.keys(productsOrderList[0])
                                  .filter(element => element.toString() === selectedIndexTable.toString());
        
        if (findIndexTable) {

          const getDeletedFood = productsOrderList[0][findIndexTable[0]].filter((element, index) => index === productIndex);

          if (getDeletedFood.length > 0) {
            const getFoodData = productsList.filter((foodElem) => 
            foodElem.food.toString().toLowerCase() === Object.keys(getDeletedFood[0])[0].toString().toLowerCase());
            
            if (getFoodData.length > 0) {
              await Promise.all(getFoodData[0].ingredients.map(product => {
                const findProduct = stockList.filter(productElem => productElem.product.toLowerCase() === Object.keys(product)[0].toLowerCase());
  
                if (findProduct.length > 0) {
                    const isInStock = (+findProduct[0].quantity) + ((+getDeletedFood[0][Object.keys(getDeletedFood[0])]) * (+product[Object.keys(product)[0]]));
                    
                    if (isInStock >= 0) {
                      return new Promise(async (promise, reject) => {
                        try {
                          const response = await updateDoc(doc(
                            db,
                            "stock",
                            findProduct[0].product
                          ), {
                            quantity: isInStock
                          }, { merge: true });
                          return promise(response);
                        } catch (error) {
                          return reject(error);
                        }
                    });
                    }
                }
              })).then(async res => {

                const newArr = productsOrderList[0][findIndexTable[0]].filter((element, index) => index !== productIndex)

                await updateDoc(doc(
                  db,
                  "orders",
                  'table'
                ), {
                  [selectedIndexTable]: newArr
                  ,
                })
                  .then(async () => {
                    console.log("product data save");
                    setSelectedTable(newArr);
                    await getData();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                
                // await updateDoc(doc(
                //   db,
                //   "orders",
                //   'table'
                // ), {
                //   [selectedIndexTable]: arrayUnion({[selected[0].label]: quantityProductOrder})
                // })
                //   .then(async () => {
                //     console.log("order data save");
                //     setSelected([]);
                //     setQuantityProductOrder(0);
   
                //     await getData();
  
                //     setCanAddedProd(true);
                //     hideDialog();   
                //   })
                //   .catch((error) => {
                //     console.log(error);
                //   });
              })
            }
          }
        
        }
  
        
      }
  }

  return (
    <Provider>
      <Portal>
        <View>
          <ScrollView>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Table</DataTable.Title>
                <DataTable.Title numeric>Status</DataTable.Title>
                <DataTable.Title numeric>View Order </DataTable.Title>
                <DataTable.Title> {} Delete Table</DataTable.Title>
              </DataTable.Header>

              {
                //daca e si length > 0
                productsOrderList && productsOrderList.length > 0 &&
                //extragem keyle pentru afisare interfata 1,2,3...
                Object.keys(productsOrderList[0])
                //eleme
                .map((element, index) => 
                  <DataTable.Row key={"datatable-row-" + index} onPress={() => {setSelectedIndexTable(element); setSelectedTable(productsOrderList[0][element]); showDialog();}}>
                    <DataTable.Cell> {element}</DataTable.Cell>
                    <DataTable.Cell underlayColor="#9E7CE3" numeric>{productsOrderList[0][element].length === 0 ? 'available' : 'unavailable'}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      <IconButton icon="eye"  size={25}  onPress={() => { console.log("view order pressed"); setSelectedIndexTable(element); showDialogView(productsOrderList[0][element]);}}/>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <IconButton icon="delete" size={25} onPress={() => { console.log("delete table"); deleteTable(element)}}/>
                    </DataTable.Cell>
                  </DataTable.Row>
                )
              }
            </DataTable>
              <Button onPress={addTable}>+ Add Table</Button>
          </ScrollView>
        </View>

    {/* Dialog for add products in order to selected table */}
        <Dialog visible={visibleDialog} onDismiss={hideDialog}>
          <Dialog.Title>Order for table {}</Dialog.Title>
          <Dialog.Content>
          <View style={stylesDropdown.container}>
              <MultiSelect
                style={stylesDropdown.dropdown}
                placeholderStyle={stylesDropdown.placeholderStyle}
                selectedTextStyle={stylesDropdown.selectedTextStyle}
                inputSearchStyle={stylesDropdown.inputSearchStyle}
                iconStyle={stylesDropdown.iconStyle}
                data={productsList}
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
                      <Text style={stylesDropdown.textSelectedStyle}> {item.label}  </Text>
                      <IconButton icon="delete"  color="black"  name="Safety"  size={20} />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View>
              <TextInput placeholder="Quantity"  value={quantityProductOrder}  onChangeText={(text) => {setQuantityProductOrder(text);}}></TextInput>
            </View>
            <View>
              {!canAddedProd && <Text style={{color: '#880808'}}>Insufficient stock</Text>}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
                 <Button onPress={() => addProductsInOrder()}>Add</Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
        
        {/* Dialog for view/edit order */}
        <Dialog visible={visibleDialogView} onDismiss={hideDialogView}>
          <Dialog.Title>Order for table {}</Dialog.Title>
          <Dialog.Content>
            <View>
              <Text>Order details</Text>
              {
                selectedTable?.map((element, index) => element && 
                <View key={'product-elem-' + index} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                  <Text>{Object.keys(element)[0] + ' ' + element[Object.keys(element)[0]] + ' Buc.'}</Text>
                  <IconButton icon="delete"  color="black"  name="Safety"  size={20} onPress={() => deleteProductFromOrder(index)}/>
                </View>)
              }
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialogView}>Exit</Button>
            <Button onPress={emitRecepit}>Recepit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
}

export default SelectTables;
