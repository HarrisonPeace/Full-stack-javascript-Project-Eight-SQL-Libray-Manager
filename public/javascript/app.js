function searchFunction() {
  // Declare variables
  let input, filter, table, tableRow, dataCaption;
  input = document.getElementById('search');
  filter = input.value.toUpperCase();
  table = document.querySelector("tbody");
  tableRow = table.getElementsByTagName('tr');
  
  // Loop through all list items, and hide those who don't match the search query
  for (let i = 0; i < tableRow.length; i++) {
    let filterItems = [];
    let tableColumns = tableRow[i].querySelectorAll("td")

    for (let j = 0; j < tableColumns.length; j++) {
      filterItems.push(tableColumns[j].innerText)
    }

    dataCaption = filterItems.join(' ');
    
    if (dataCaption.toUpperCase().indexOf(filter) > -1) {
      tableRow[i].style.display = "";
    } else {
      tableRow[i].style.display = "none";
    }
  }
}