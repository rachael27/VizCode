google.charts.load('current');
google.charts.setOnLoadCallback(init);


function init() {
  var url = 'https://docs.google.com/spreadsheets/d/1oJ03ZJkadeFXWZsdpkjgI8UWPHWbgf7zHB37Zc2VDaw/edit?usp=sharing';
  var query = new google.visualization.Query(url);
 // query.setQuery('select A, B');
  query.send(processSheetsData);
}


function processSheetsData(response) {
    var array = [];
    var data = response.getDataTable();
    var columns = data.getNumberOfColumns();
    var rows = data.getNumberOfRows();
    console.log(columns);
   
    console.log(data);
    //renderData(array);
  }


