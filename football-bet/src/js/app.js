$(document).ready(function(){

  $('#btn-save').click(function(){
    let transDate = $('#trans_date').val();
    let transAmount = $('#trans_amount').val();
    let transContent = $('#trans_content').val();

    if (transDate === '' || transAmount === '' || transContent === '') {
      alert ('Please input all.');
      return;
    }

    $('.table-content').append('<div class="table-row">' +
      '<div class="table-data">' + transDate + '</div>' +
      '<div class="table-data">' + transAmount + '</div>' +
      '<div class="table-data">' + transContent + '</div>' +
      '</div>');
  });

})
