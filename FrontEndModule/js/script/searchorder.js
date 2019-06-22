$(document).ready(function () {

    var getOrderID={
        method: "GET",
        url: "http://localhost:8080/api/v1/orders",
        async: true

    };

    $.ajax(getOrderID).done(function (orders) {
        for(var i=0;i<orders.length;i++){
            var html = '<tr>'+
                '<td>'+orders[i].orderId+'</td>'+
                '<td>'+orders[i].customerId+'</td>'+
                '<td></td>'+
                '<td>'+orders[i].orderDate+'</td>'+
                '<td></td>'+
                '</tr>'

            $("#searchTable").append(html);
        }

        var getcustomerName = {
            method: "GET",
            url: "http://localhost:8080/api/v1/customers",
            async: true
        };
        $.ajax(getcustomerName).done(function (customers) {
            for(var i=0;i<customers.length;i++){

                var cusID = customers[i].id;

                console.log(cusID);

            }

            var getOrderID1={
                method: "GET",
                url: "http://localhost:8080/api/v1/orders",
                async: true

            };

            $.ajax(getOrderID1).done(function (orders) {
                for(var i=0;i<orders.length;i++){
                    var OrderCusID = orders[i].customerId;
                    console.log(OrderCusID);
                }







            });



        });







    });

    $("#searchbar").on("keyup",function () {
        var value = $(this).val().toLowerCase();
        $("#tblresult tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value)>-1)
        });
    });

});