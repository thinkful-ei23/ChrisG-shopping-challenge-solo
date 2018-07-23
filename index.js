'use strict';
/* global $ */

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  hideCheckedItems: false,
  wordSearch: ''
};


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  let filteredItems = STORE.items;
  if (STORE.hideCheckedItems === true) {
    filteredItems = STORE.items.filter(function(item) {
      return item.checked === false;
    });
  }
  /************ Test ***********/
  if (STORE.wordSearch !== '') {
    filteredItems = filteredItems.filter(function(item) {
      return item.name.toLowerCase().startsWith(STORE.wordSearch);
    });
  }
  /************** *************/
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  console.log(STORE);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

// //********************** Newly added search box *************************/

// function searchFilterItems(searchedItem) {
//   STORE.wordSearch = searchedItem;
// }

// function handleSearchedItems() {
//   $('.js-shopping-list-search').on('keyup', function() {
//     event.preventDefault();
//     let searchWord = $(this).val().toLowerCase();

//     searchFilterItems(searchWord);
//     renderShoppingList();
//   });
// }
// // *****************************************************************
function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}
// *********************************************added lines
function deleteItem(itemIndex) {
  STORE.items.splice(itemIndex,1);
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  // fench info
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.target);
    deleteItem(itemIndex);
    renderShoppingList();
  });
  console.log('`handleDeleteItemClicked` ran');
}

function handleHideItemChecked() {
  $('.js-shopping-list-hide').on('click', () => {
    STORE.hideCheckedItems = !STORE.hideCheckedItems;
    renderShoppingList();
  });
}
//********************** Newly added search box *************************/

function searchFilterItems(searchedItem) {
  STORE.wordSearch = searchedItem;
}

function handleSearchedItems() {
  $('.js-shopping-list-search').on('keyup', function() {
    event.preventDefault();
    let searchWord = $(this).val().toLowerCase();

    searchFilterItems(searchWord);
    renderShoppingList();
  });
}
// *****************************************************************
//**********************************************Edit item part */
// function changeStoreItems(itemIndex) {
//   // if not work try edit-item
  
// }

function handleEditItem() {
  // when the item is double clicked add html that allows userInput
  // create a event listener that listens for userInput
  // replace value in STORE 
  $('.js-shopping-list').on('dblclick','.js-shopping-item' ,function() {
    $(this).html('<input class="edit-item" type="text">');

    $('.js-shopping-item').on('keyup', function(event) {
      if (event.key === 'Enter') {
        console.log('Hi');
  
        let userValue = $('.edit-item').val();
        let itemIndex = (getItemIndexFromElement(event.currentTarget));
        STORE.items[itemIndex].name = userValue;
        // changeStoreItems(itemIndex);
        renderShoppingList();
      }
    });
  });
}
/*************************************************************** */
// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  //added
  handleSearchedItems();
  handleItemCheckClicked();
  //added both below
  handleDeleteItemClicked();
  handleHideItemChecked();
  handleEditItem();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);