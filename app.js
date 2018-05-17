//Storage controller
const StorageCtrl = (function(){
return {

  //public methods
  storeItem: function(item){
    let items;
    //check if any items in localstorage
    if(localStorage.getItem('items') === null){
      items = [];
      //push the new item
      items.push(item);
      //set LS
      localStorage.setItem('items', JSON.stringify(items));

    }else {
      //Get what is already in LS
      items = JSON.parse(localStorage.getItem('items'));

      //push the new item
      items.push(item);

      //reset LS
      localStorage.setItem('items', JSON.stringify(items));

    }
    
  },
  getItemFromLocalStorage: function(){
    let items;
    if(localStorage.getItem('items') === null){
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
  },
  updateItemStorage: function(updatedItem){
    let items = JSON.parse(localStorage.getItem('items'));

    items.forEach(function(item, index){
      if(updatedItem.id === item.id){
        items.splice(index, 1, updatedItem);
      } 
    });

    localStorage.setItem('items', JSON.stringify(items));
  },
  deleteItemFromLocalStorage: function(id){
    let items = JSON.parse(localStorage.getItem('items'));

    items.forEach(function(item, index){
      if(id === item.id){
        items.splice(index, 1);
      } 
    });

    localStorage.setItem('items', JSON.stringify(items));
  },
  clearItemsFromStorage: function(){
    localStorage.removeItem('items');
  }
}
})();


//Item Controller
const ItemCtrl = (function(){
  //Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure /state
  const data = {
    // items: [
    //   // {id:0, name:'Steak Dinner', calories:1200},
    //   // {id:1, name:'Eggs', calories:400},
    //   // {id:2, name:'Cookie', calories:300}
    // ],
    items: StorageCtrl.getItemFromLocalStorage(),
    currentItem: null,
    totalCalories: 0
  }

  //public methods
  
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      //create ID
      let ID;
      if(data.items.length > 0){
        ID = data.items[data.items.length-1].id + 1;
      }else {
        ID = 0;
      }

      //calories to number
      calories = parseInt(calories);
      //create new item 
      newItem = new Item(ID, name, calories);
      
      //add to items array
      data.items.push(newItem);
      return newItem;
    },
      getItemById: function(id){
        
        let found = null;
        //loop through the items
        data.items.forEach(function(item){
          if(item.id === id){
            found = item;
          }
        });
        return found;
      },
      updateItem: function(name, calories){
        //calories to number
        calories = parseInt(calories);
        let found = null;
        data.items.forEach(function(item){
          if(item.id === data.currentItem.id){
            item.name = name;
            item.calories = calories;
            found = item;
          }
        });
        return found;
      },
      deleteItem: function(id){
        //Get ids
       const ids = data.items.map(function(item){
          return item.id;
        });

        //get index
        const index = ids.indexOf(id);

        //remove item
        data.items.splice(index, 1);
      },
      clearAllItems: function(){
        data.items = [];
      },
      setCurrentItem: function(item){
        data.currentItem = item;
      },
    
      getCurrentItem: function(){
        return data.currentItem;
      },

    getTotalCalories: function(){
      let total = 0;
      //loop through items and add calories
      data.items.forEach(function(item){
        total += item.calories;
      });
      //set total calories in data structure
      data.totalCalories = total;
      //return total
      return data.totalCalories;
    },
    logData: function(){
      return data;
    }
  }
})();



//UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    addBtn : '.add-btn',
    listItems: '#item-list li',
    updateBtn : '.update-btn',
    clearBtn: '.clear-btn',
    deleteBtn : '.delete-btn',
    backBtn : '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
  return{
    populateItemList: function(items){
      let html = '';
      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      </li> `;
      });

      //insert list items

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return{
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      //show the list
      document.querySelector(UISelectors.itemList).style.display= 'block';
      //create li element
      const li = document.createElement('li');
      //add class.
      li.className = 'collection-item';
      //add ID
      li.id = `item-${item.id}`;
      //add HTML
      li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
      //Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //ListItems is Nodelist and we need to turn into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}: </strong><em>${item.calories} Calories</em> 
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          `;
        }
      });
    },
    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value ='';
      document.querySelector(UISelectors.itemCaloriesInput).value ='';

    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems : function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn Node list into array
     listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState:function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors:function(){
      return UISelectors;
    }
  }
})();


//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  //Load event listeners
  const loadEventListeners = function(){
    //Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    
    //disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    
    //update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    //delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

  
  }

    //add item  submit
  const itemAddSubmit = function(e){
    //Get form input from UI controller
    const input = UICtrl.getItemInput();
    
    //check for name and calories input
    if(input.name !== '' && input.calories !== ''){
      //Add item
     const newItem = ItemCtrl.addItem(input.name, input.calories);
      
     //add item to UI list
     UICtrl.addListItem(newItem);

     //Get total calories
     const totalCalories = ItemCtrl.getTotalCalories();
      //Add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      //store in localstorage
      StorageCtrl.storeItem(newItem);

     //clear fields
     UICtrl.clearInput();
    }
    
    e.preventDefault();

  }


  //click item to Edit 
  const itemEditClick = function(e){
   if(e.target.classList.contains('edit-item')){
     //get list item id( item-0, item-1..)
     const listId = e.target.parentNode.parentNode.id;
     
     //break into an array
     const listIdArr = listId.split('-');
     //get the actual id
     const id = parseInt(listIdArr[1]);
     //get item
     const itemToEdit = ItemCtrl.getItemById(id);
     
     //set current item
     ItemCtrl.setCurrentItem(itemToEdit);

     //add item to form
     UICtrl.addItemToForm();
   }

    e.preventDefault();
  }

  //Update item submit
  const itemUpdateSubmit = function(e){
    //get item input
    const input = UICtrl.getItemInput();

    //update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    //update UI
    UICtrl.updateListItem(updatedItem);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to ui
    UICtrl.showTotalCalories(totalCalories);

    //Update LocalStorage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  const itemDeleteSubmit = function(e){
  //Get curent item
    const currentItem = ItemCtrl.getCurrentItem();

    //Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    //delete from Ui
    UICtrl.deleteListItem(currentItem.id);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to ui
    UICtrl.showTotalCalories(totalCalories);

    //delete from local storage
    StorageCtrl.deleteItemFromLocalStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();

  }
  //clear items event
  const clearAllItemsClick = function(){
    //Delete all items from data structures
    ItemCtrl.clearAllItems();

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to ui
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
    
    //Remove from UI
    UICtrl.removeItems();

    //clear from local storage
    StorageCtrl.clearItemsFromStorage();

    //Hide UL after clearing
    UICtrl.hideList();
  }

  //public methods
  return {
    init:function(){
     
      //clear initial state
      UICtrl.clearEditState();

      //fetch items from data structure
      const items = ItemCtrl.getItems();
      
      //check if any items
      if(items.length === 0){
        UICtrl.hideList();
      } else {
      //populate list with items
      UICtrl.populateItemList(items);
      }

      //Get total calories
     const totalCalories = ItemCtrl.getTotalCalories();
     //Add total calories to ui
     UICtrl.showTotalCalories(totalCalories);
    

      //Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

//initializ app
App.init();