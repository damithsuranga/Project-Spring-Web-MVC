switch (document.readyState) {
    case "loading":
        getCustID();
        getAllItems();
        generateOrderID();
        LocalDate();
       // itemdetailsfromitem();
        // qtyandunitprice();
        break;
    default:
        alert("nothing");



}
//----------------------------------------Local Date-------------------------------------------------------------------

function LocalDate() {
    console.log("Date");
    var date = new Date();
    var month = date.getMonth()+1;
    if(month<10){
        month = "0"+month;
    }
    var todayDate = date.getFullYear()+'-'+month+'-'+date.getDate();
    $("#OrderDate").text(todayDate);

}

//----------------------------------------generate Order ID--------------------------------------------------------------------

function generateOrderID() {

    var generateIDajax={
        method: "GET",
        url: "http://localhost:8080/api/v1/orders",
        async: true

    };
     $.ajax(generateIDajax).done(function (orders) {
console.log(orders.length);
var maxId;
if(orders.length==0){
    maxId=0;
}else{
    console.log(orders[orders.length-1].orderId);
    maxId=orders[orders.length-1].orderId;
}
            var OrderIDnumber = maxId+1;
       $("#orderID").text(OrderIDnumber);

    })
}



//----------------------------load customer id to combobox---------------------------------------------------------------------
function getCustID() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/api/v1/customers",
        async: true
    }).done(function (customers) {
        for (var i = 0; i < customers.length; i++) {
            $("#selectCustomerID").append('<option value="' + customers[i].id + '">' + customers[i].id + '</option>')
        }
    });
}

//---------------------------------------------load customer name---------------------------------------------------

$("#selectCustomerID").click(function () {

    var selectedID = $("#selectCustomerID").val();

    $.ajax({
        method: "GET",
        url: "http://localhost:8080/api/v1/customers/" + selectedID,
        async: true
    }).done(function (customers) {
        var customername = customers.name;
        $("#customerName").text(customername);

    });


});

//--------------------------------------load Items------------------------------------
function getAllItems() {
    // $("#orderQtyField").val("");

    $.ajax({
        method: "GET",
        url: "http://localhost:8080/api/v1/items",
        async: true
    }).done(function (items) {
        for (var i = 0; i < items.length; i++) {
            $("#selectItemCode").append('<option value="' + items[i].code + '">' + items[i].code + '</option>')
        }
    });
}

//-------------------------------load to item feilds-----------------------------------------------------

$("#selectItemCode").click(function () {
    var selctedItemCode = $("#selectItemCode").val();

    $.ajax({
        method: "GET",
        url: "http://localhost:8080/api/v1/items/" + selctedItemCode,
        async: true
    }).done(function (items) {
        var description = items.description;
        var qtyonhand = items.qtyOnHand;
        var unitprice = items.unitPrice;
        $("#txtitemName").text(description);
        $("#txtitemPrice").text(unitprice);
        $("#txtitemQty").text(qtyonhand);
    });
});


//----------------------------------------validation part & add data to table-------------------------------------------------------

$("#orderQtyField").keydown(function (event) {


   if (event.which == '13') {
      // alert("working");
        var itemcode = $("#selectItemCode").val();
        var itemdescription = $("#txtitemName").text();
        var itemquantity =$("#txtitemQty").text();
        var itemunitprice = $("#txtitemPrice").text();
        var quantity = $("#orderQtyField").val();
        var Total = (quantity)*(itemunitprice);

       var balanceItemQuantity = itemquantity - quantity

       if(quantity<0){
           alert("invalid quantity");
           $("#orderQtyField").select();
           return;
       }

       if(quantity>itemquantity){
           alert("invalid quantity");
           $("#orderQtyField").select();
           return;
       }

       $("#ordertable tbody tr td:first-child").each(function () {
          var itemCodeNumber = $(this).text();
                if(itemCodeNumber==itemcode){
                    var OLDQauntity = parseInt($(this).parents("tr").find("td:nth-child(3)").text());
                    $(this).parents("tr").find("td:nth-child(3)").text(quantity);
                    $(this).parents("tr").find("td:nth-child(5)").text(quantity * itemunitprice);


                    $.ajax({
                        method: "GET",
                        url: "http://localhost:8080/api/v1/items/" + selctedItemCode,
                        async: true
                    }).done(function (items) {
                        var item1= items.find(function (item2) {
                            return item1.code==itemcode;
                        });

                        item1.qtyOnHand += OLDQauntity;
                        item1.qtyOnHand = item1.qtyOnHand - quantity;
                    });


                }
       });


       // $("#tblOrderDetails tbody tr td:first-child").each(function () {
       //     var itemCode = $(this).text();
       //     if (itemCode == code) {
       //
       //         var oldQty = parseInt($(this).parents("tr").find("td:nth-child(3)").text());
       //         $(this).parents("tr").find("td:nth-child(3)").text(qty);
       //         $(this).parents("tr").find("td:nth-child(5)").text(qty * unitPrice);
       //
       //         var item = items.find(function (item) {
       //             return item.code == code;
       //         });
       //         item.qtyOnHand += oldQty;
       //         item.qtyOnHand = item.qtyOnHand - qty;
       //     }
       // });



       // if($("#customerName").text("")){
       //     alert("Please enter the customer");
       //     $("#customerName").focus();
       //     return;
       // }


                var html = '<tr>' +
                    '<td>' + itemcode + '</td>' +
                    '<td>' + itemdescription + '</td>' +
                    '<td>' + quantity + '</td>' +
                    '<td>' + itemunitprice + '</td>' +
                    '<td>' + Total + '</td>' +
                    "<td><img src='images/trash-icon.png' style='width: 30px' class='img-bin'></td>" +
                    '</tr>'

                $("#ordertable").append(html);

                // $.ajax({
                //     method: "GET",
                //     url: "http://localhost:8080/api/v1/items",
                //     async: true
                // }).done(function (items) {
                //     items.qtyOnHand -= quantity;
                // });



       calculateTotal();
       clearFeild();
      // $("#ordertable").refresh();




       var itemcodes = $("#ordertable tbody tr:last-child td:first-child").text();
       var itemdescriptions=$("#ordertable tbody tr:last-child td:nth-child(2)").text();
       var itemquantitys=$("#ordertable tbody tr:last-child td:nth-child(3)").text();
       var itemunitprices=$("#ordertable tbody tr:last-child td:nth-child(4)").text();
       var quantitys=$("#ordertable tbody tr:last-child td:nth-child(5)").text();

       $("table tbody tr:last-child td:last-child").click(function () {

           $("#selectItemCode").val(itemcodes);
           console.log("update or Delete");
           $("#txtitemName").text(itemdescriptions);
           $("#txtitemQty").text(balanceItemQuantity);
           $("#txtitemPrice").text(itemunitprices);
           //$("#orderQtyField").val(itemquantitys);


       });

       // var newOrderQuantity=0;
       // if(itemcodes==itemcode){
       //      newOrderQuantity += itemquantitys;
       //      console.log(newOrderQuantity);
       // }



    }
});

//----------------------------------------------place the order-------------------------------------------------------------------

$("#save-order").click(function () {

    var OrderDetails = [];
    OrderDetails.push({orderId:$("#orderID").text(),itemCode:$("#selectItemCode").val(),qty:$("#ordertable tbody tr td:nth-child(3)").text(),unitPrice:$("#ordertable tbody tr td:nth-child(4)").text()});

  var Order ={
      orderId : $("#orderID").text(),
      orderDate : $("#OrderDate").text(),
      customerId : $("#selectCustomerID").val(),
      orderDetails : OrderDetails

  };



    var orderAjax = {
        method : "POST",
        url : "http://localhost:8080/api/v1/orders",
        async : true,
        data : JSON.stringify(Order),
        contentType : 'application/json'
    };

    $.ajax(orderAjax).done(function (response) {
        if(response){
            alert("Order has been save successfully")
        }else{
            alert("falied save order")
        }
    })

})

// function itemdetailsfromitem() {
//    $.ajax({
//        method: "GET",
//        url: "http://localhost:8080/api/v1/items",
//        async: true
//    }).done(function (items) {
//        for(var i=0;i<items.length;i++){
//            var html = '<tr>'+
//                '<td>'+items[i].code+'</td>'+
//                '<td>'+items[i].description+'</td>'+
//                '</tr>'
//            $("#ordertable").append(html);
//        }
//    })
// }
//
// function qtyandunitprice() {
//     $.ajax({
//         method: "GET",
//         url: "http://localhost:8080/api/v1/orders",
//         async: true
//     }).done(function (orderdetails) {
//         for(var i=0;i<orderdetails.length;i++){
//             var html = '<tr>'+
//                 '<td></td>'+
//                 '<td></td>'+
//                 '<td>'+orderdetails[i].qty+'</td>'+
//                 '<td>'+orderdetails[i].unitPrice+'</td>'+
//                 '</tr>'
//             $("#ordertable").append(html);
//         }
//     })
// }

function calculateTotal() {

    var total =0;
    $("#ordertable tbody tr td:nth-child(5)").each(function () {
        total += parseInt($(this).text());
    });

    $("#total-heading").text(total);
}

function clearFeild() {
    //$("#selectItemCode").val("");
    $("#customerName").text("");
    $("#txtitemName").text("");
    $("#txtitemPrice").text("");
    $("#txtitemQty").text("");
    $("#orderQtyField").val("")
}




