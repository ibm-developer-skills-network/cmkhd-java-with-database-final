
let students = [];
let Ordercount = 1;
let deleteRow = [];

function resetForm() {
    const inputs = document.querySelectorAll("#myform input:not([type='submit']), #myform select");
    inputs.forEach(input => {
        input.value = "";
    })
}

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-item .nav-link');

    const activeLink = document.querySelector('.nav-item .nav-link.active');

    if (activeLink) {

        let html = `<h1 style='color: white;'>${activeLink.textContent}</h1>`
        head.innerHTML = html;

    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            let html = `<h1 style='color: white;'>${event.target.textContent}</h1>`
            head.innerHTML = html;
        });
    });
});


function createMoreOrderField() {
    Ordercount++;
    OrderList = document.getElementById('OrderListBody');

    tr = document.createElement('tr');
    tr.setAttribute('id', `${Ordercount}`)



    tr.innerHTML =
        `
            <td><input type="text" class="input-cell SerialNo" disabled>
            </td>
            <td><input type="text" class="input-cell" id="orderProductName${Ordercount}"
                placeholder="Enter Product Name" onkeyup="fillProductId(${Ordercount})"
                required>
            <div id="OrderSuggestion${Ordercount}">

            </div>
            </td>

            <td><input type="text" class="input-cell" id="orderProductId${Ordercount}"
                                                    placeholder="Enter ProductId" disabled required></td>
            <td><input type="text" class="input-cell" id="orderProductPrice${Ordercount}"
                                                    placeholder=" Enter Product price" disabled required></td>
            <td><input type="text" class="input-cell" id="orderProductQuantity${Ordercount}"
                                                    placeholder="Enter Quantity" required
                                                    onkeyup="calculatePrice(${Ordercount}),validateQuantity(${Ordercount})"></td>
             <td><input type="text" class="input-cell" id="orderTotal${Ordercount}"
                                                    placeholder="Enter Total Here" disabled required></td>
            <td><button type="button" class="remove-btn" onclick="deleteDiv(${Ordercount})">Remove</button></td>
        `


    OrderList.appendChild(tr);
    setSerialNo();

}

function deleteDiv(count) {

    let divToDelete = document.getElementById(`${count}`);

    // Check if the div exists
    if (divToDelete && Ordercount != 1) {
        divToDelete.remove();
        deleteRow.push(count);
    }
    else {
        alert(`Atleast One row is required`);
    }


    setSerialNo()
    calculateTotal()

}

function calculateTotal() {
    let total = 0;
    for (let i = 1; i <= Ordercount; i++) {
        totalField = document.getElementById(`orderTotal${i}`);
        if (totalField) {
            if (totalField.value)
                total = total + parseInt(totalField.value)
        }

    }

    document.getElementById('totalOrderValue').value = total;
}


function setSerialNo() {
    const serialNos = document.querySelectorAll('.SerialNo');
    let count = 1;
    serialNos.forEach(serialNo => {
        serialNo.value = count++;

    });

}


function fillProductId(count) {
    let storeId = document.getElementById('orderStoreId').value;
    suggestion = document.getElementById(`OrderSuggestion${count}`);
    productId = document.getElementById(`orderProductName${count}`).value
    if (productId.trim() !== '') {
        let url = `http://localhost:8080/warehouseManager/viewProductName/${productId}/${storeId}`;
        fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
        })
            .then(response => {
                return response.json();
            })
            .then(data => {

                showOrderSuggestion(data.product, count);
            })
            .catch(error => {
                alert(error);
            })
    }
    else {
        suggestion.innerHTML = "";
    }


}





function showOrderSuggestion(products, count) {


    suggestion = document.getElementById(`OrderSuggestion${count}`);
    productName = document.getElementById(`orderProductName${count}`);
    productId = document.getElementById(`orderProductId${count}`);
    productPrice = document.getElementById(`orderProductPrice${count}`);
    quantity = document.getElementById(`orderProductQuantity${count}`);
    suggestion.innerHTML = "";
    for (product of products) {
        div = document.createElement('div');
        div.classList.add('suggestionCard');
        h6 = document.createElement('h6');
        h6.textContent = product.name
        div.appendChild(h6);
        div.addEventListener('click', (function (product) {
            return function () {
                quantity.value = '1';
                productName.value = product.name;
                productId.value = product.id;
                productPrice.value = product.price;
                suggestion.innerHTML = "";
                calculatePrice(count);

            };
        })(product));
        suggestion.appendChild(div);
    }
}






function calculatePrice(count) {

    price = document.getElementById(`orderProductPrice${count}`).value;
    quantity = document.getElementById(`orderProductQuantity${count}`).value;
    total = document.getElementById(`orderTotal${count}`);
    total.value = (price * quantity);
    calculateTotal();
}

function validateStoreId(event) {
    event.preventDefault();

    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let day = String(now.getDate()).padStart(2, '0');
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    let dateTimeInput = document.getElementById("datetime");
    dateTimeInput.value = formattedDateTime;


    let submitButton = document.getElementById('submitButton');
    let storeId = document.getElementById('orderStoreId');
    let url = `http://localhost:8080/validateStoreId/${storeId.value}`
    fetch(url, {
        method: "GET",
        headers: { "content-type": "application/json" },
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data === true) {
                storeId.disabled = true;
                document.getElementById('displayForm').style = 'display:block';
                submitButton.style = 'display:flex';

            }
            else {
                alert("Enter correct Store id")
            }
        })
}


function addStore(event) {
    event.preventDefault();
    let storeName = document.getElementById('storeName').value;
    let storeAddress1 = document.getElementById('storeAddress1').value;
    let storeAddress2 = document.getElementById('storeAddress2').value;
    let storeAddress3 = document.getElementById('storeAddress3').value;
    let storeAddress = storeAddress1 + " " + storeAddress2 + " " + storeAddress3;

    let data = { name: storeName, address: storeAddress };

    let url = "http://localhost:8080/admin/addStore"
    fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            alert(data.message);
            resetForm();
        })
}


function viewProduct(event) {
    event.preventDefault();

    let inputstoreId = document.getElementById('vstoreId');
    document.getElementById('searchBar').disabled = false
    document.getElementById('SearchButton').disabled = false;
    document.getElementById('vstoreId').disabled = false
    document.getElementById('category').disabled = false;
    storeId = inputstoreId.value;
    inputstoreId.disabled = true;

    let url = `http://localhost:8080/warehouseManager/viewProduct/${storeId}`;
    fetch(url, {
        method: "GET",
        headers: { "content-type": "application/json" },
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            createData(data.products, storeId);
        })
}




function search() {

    productId = document.getElementById('searchBar').value
    let storeId = document.getElementById('vstoreId').value;

    if (productId.trim() !== '') {
        let url = `http://localhost:8080/warehouseManager/viewProductName/${productId}/${storeId}`;
        fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
        })
            .then(response => {
                return response.json();
            })
            .then(data => {

                createData(data.product, storeId);
            })
            .catch(error => {
                alert(error);
            })
    }
    else {
        viewProduct(event);
    }

}


async function filter() {
    category = document.getElementById('category').value;
    if (category.trim() == 'Allcategory') {
        viewProduct(event);
    }
    let storeId = document.getElementById('vstoreId').value;


    let url = `http://localhost:8080/warehouseManager/viewProductbyCategory/${category}/${storeId}`;
    fetch(url, {
        method: "GET",
        headers: { "content-type": "application/json" },
    })
        .then(response => {
            return response.json();
        })
        .then(data => {

            createData(data.product, storeId);
        })
        .catch(error => {
            alert(error);
        })
}





async function createData(products, storeId) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    products.forEach(product => {

        const row = document.createElement('tr');

        const prodId = document.createElement('td');
        prodId.classList.add('expandable');
        prodId.textContent = product.id;

        const name = document.createElement('td');
        name.classList.add('expandable');
        name.textContent = product.name;

        const category = document.createElement('td');
        category.classList.add('expandable');
        category.textContent = product.category;

        const price = document.createElement('td');
        price.classList.add('expandable');
        price.textContent = product.price;

        const sku = document.createElement('td');
        sku.classList.add('expandable');
        sku.textContent = product.sku;

        const stockLevel = document.createElement('td');
        stockLevel.classList.add('expandable');
        stockLevel.textContent = product.inventory[0].stockLevel;

        const buttoncolumn = document.createElement('td');
        const button = document.createElement('button')
        button.classList.add('btn', 'btn-warning');
        button.textContent = 'Edit';
        button.addEventListener('click', () => {
            window.location = `EditProduct.html?productId=${product.id}&storeId=${storeId}&stockLevel=${product.inventory[0].stockLevel}`;

        });
        buttoncolumn.appendChild(button);


        const buttonTable2 = document.createElement('td');
        const delbutton = document.createElement('button')
        delbutton.classList.add('btn', 'btn-danger');
        delbutton.textContent = 'Delete';
        delbutton.value = product.id;
        delbutton.addEventListener('click', function () {
            showModal(this.value, product.name,2);
        });
        buttonTable2.appendChild(delbutton);


        row.appendChild(prodId);
        row.appendChild(name);
        row.appendChild(category);
        row.appendChild(price);
        row.appendChild(sku);
        row.appendChild(stockLevel);
        row.appendChild(buttoncolumn);
        row.appendChild(buttonTable2);

        tableBody.appendChild(row);
    });
}





function viewProductByid(productId) {

    let url = `http://localhost:8080/storeManager/viewProduct/${productId}`;
    fetch(url, {
        method: "GET",
        headers: { "content-type": "application/json" },
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.products) {
                fillDetails(data.products, productId);
            }
            else {
                alert("No data with product id: " + productId);
                resetForm();
                return;
            }
        })
        .catch(error => {
            alert(error);
        })
}


function fillDetails(products, productId) {
    let productIdDiv = document.getElementById('uproductId');
    let productName = document.getElementById('uproductName');
    let category = document.getElementById('ucategory');
    let productPrice = document.getElementById('uproductPrice');
    let SKU = document.getElementById('uSKU');

    productIdDiv.value = productId;
    productName.value = products.name;
    category.value = products.category;
    productPrice.value = products.price;
    SKU.value = products.sku;

}



function updateProduct(event) {
    event.preventDefault();
    let productId = document.getElementById('uproductId').value;
    let productName = document.getElementById('uproductName').value;
    let category = document.getElementById('ucategory').value;
    let productPrice = document.getElementById('uproductPrice').value;
    let SKU = document.getElementById('uSKU').value;
    let stockLevel = document.getElementById('ustockLevel').value;
    let storeId = document.getElementById('ustoreId').value;

    let ProductModel = { id: productId, name: productName, category: category, price: productPrice, sku: SKU };
    let InventoryModel = { product: { id: productId }, store: { id: storeId }, stockLevel: stockLevel };
    let data = { product: ProductModel, inventory: InventoryModel };

    console.log(data);
    let url = `http://localhost:8080/storeManager/updateProduct`;
    fetch(url, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            alert(data.message);
            location.href = `frontend.html?storeId=${storeId}`
        })
}



function fillProductName() {
    let productName = document.getElementById('productName').value;
    if (productName.trim() != "") {
        let url = `http://localhost:8080/searchProduct/${productName}`;
        fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
        })
            .then(response => {
                return response.json();
            })
            .then(data => {

                showproductSuggestion(data.product);
            })
            .catch(error => {
                alert(error);
            })
    }
    else {
        suggestion = document.getElementById('aStoreSuggestion');
        suggestion.innerHTML = "";

    }
}


function showproductSuggestion(products) {

    suggestion = document.getElementById('aStoreSuggestion');
    productName = document.getElementById('productName')
    productId = document.getElementById('productId')
    category = document.getElementById('category');
    productPrice = document.getElementById('productPrice');
    SKU = document.getElementById('SKU');

    suggestion.innerHTML = "";
    for (product of products) {
        button = document.createElement('button');
        button.type = 'button'
        button.value = product.id;
        button.innerHTML = product.name;
        button.addEventListener('click', (function (product) {
            return function () {
                productName.value = product.name;
                suggestion.innerHTML = "";
                productId.value = product.id;
                category.value = product.category;
                productPrice.value = product.price;
                SKU.value = product.sku;
            };
        })(product));



        suggestion.appendChild(button);
    }
}



function addProductToInventory(event) {
    event.preventDefault();

    productId = document.getElementById('productId').value;
    storeId = document.getElementById('astoreId').value;
    stockLevel = document.getElementById('astockLevel').value;

    let data = { product: { id: productId }, store: { id: storeId }, stockLevel: stockLevel };
    let url = "http://localhost:8080/storeManager/addProductToInventory"
    fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            alert(data.message);
            location.href = `frontend.html?storeId=${storeId}`
        })
}



function viewProductList() {
    let url = `http://localhost:8080/getAllProducts`;
    fetch(url, {
        method: "GET",
        headers: { "content-type": "application/json" },
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.products) {
                showProductsInTable(data.products);
            }
            else {
                alert("No data with product id: " + productId);
                resetForm();
                return;
            }
        })
        .catch(error => {
            alert(error);
        })
}

function showProductsInTable(products) {
    allProducts = document.getElementById('allProducts')
    allProducts.innerHTML = "";
    products.forEach(product => {

        const row = document.createElement('tr');

        const prodId = document.createElement('td');
        prodId.classList.add('expandable');
        prodId.textContent = product.id;

        const name = document.createElement('td');
        name.classList.add('expandable');
        name.textContent = product.name;

        const category = document.createElement('td');
        category.classList.add('expandable');
        category.textContent = product.category;

        const price = document.createElement('td');
        price.classList.add('expandable');
        price.textContent = product.price;

        const sku = document.createElement('td');
        sku.classList.add('expandable');
        sku.textContent = product.sku;


        const buttonTable = document.createElement('td');
        const button = document.createElement('button')
        button.classList.add('btn', 'btn-warning');
        button.value = product.id;
        button.textContent = 'Edit';
        button.addEventListener('click', function () {
            window.location = `EditParentProduct.html?productId=${this.value}`

        });
        buttonTable.appendChild(button);

        const buttonTable2 = document.createElement('td');
        const delbutton = document.createElement('button')
        delbutton.classList.add('btn', 'btn-danger');
        delbutton.textContent = 'Delete';
        delbutton.value = product.id;
        delbutton.addEventListener('click', function () {
            showModal(this.value, product.name,1);
        });
        buttonTable2.appendChild(delbutton);

        row.appendChild(prodId);
        row.appendChild(name);
        row.appendChild(category);
        row.appendChild(price);
        row.appendChild(sku);
        row.appendChild(buttonTable);
        row.appendChild(buttonTable2);

        allProducts.appendChild(row);
    });
}



function showModal(id, name, action) {
    console.log(action);
    const myModal = new bootstrap.Modal(document.getElementById('myModal'));
    const modalFooter = document.getElementById('modal-footer');
    text = document.getElementById('deleteProuctName');
    text.innerHTML = name;
    modalFooter.innerHTML = "";
    button = document.createElement('button');
    button.classList.add('btn', 'btn-danger')
    button.textContent = 'Yes';
    if (action == 1) {
        button.addEventListener('click', function () {
            deleteItembyId(id);
            myModal.hide();
        })
    }
    else {
        button.addEventListener('click', function () {
            removeFromInventory(id)
            myModal.hide();
        })
    }
    modalFooter.appendChild(button);
        myModal.show();
    }


    function deleteItembyId(id) {
        console.log("deleting button with id: " + id);


        let url = `http://localhost:8080/admin/deleteProduct/${id}`;
        fetch(url, {
            method: "DELETE",
            headers: { "content-type": "application/json" },
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                alert(data.message);
                viewProductList();
            })
            .catch(error => {
                alert(error);
            })


    }

    function removeFromInventory(id)
    {
        let url=`http://localhost:8080/removeProductFromInventory/${id}`
        fetch(url, {
            method: "DELETE",
            headers: { "content-type": "application/json" },
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                alert(data.message);
                window.location.reload();
            })
            .catch(error => {
                alert(error);
            })
    }


    function searchProductList() {

        search = document.getElementById('ProductsearchBar').value;
        if (search.trim() !== '') {
            let url = `http://localhost:8080/searchProduct/${search}`;
            fetch(url, {
                method: "GET",
                headers: { "content-type": "application/json" },
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {

                    showProductsInTable(data.products);
                })
                .catch(error => {
                    alert(error);
                })
        }
        else {
            viewProductList();
        }
    }



    function getProductByid(productId) {

        let url = `http://localhost:8080/storeManager/viewProduct/${productId}`;
        fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.products) {
                    setParentProduct(data.products);
                }
                else {
                    alert("No data with product id: " + productId);
                    resetForm();
                    return;
                }
            })
            .catch(error => {
                alert(error);
            })
    }

    function setParentProduct(product) {
        document.getElementById('pproductName').value = product.name;
        document.getElementById('pcategory').value = product.category;
        document.getElementById('pproductPrice').value = product.price;
        document.getElementById('pSKU').value = product.sku;
    }



    function updateParentProduct(event) {
        event.preventDefault();

        productId = document.getElementById('pproductId').value;
        productName = document.getElementById('pproductName').value;
        category = document.getElementById('pcategory').value;
        price = document.getElementById('pproductPrice').value;
        sku = document.getElementById('pSKU').value;
        let url = "http://localhost:8080/updateProduct"
        data = { id: productId, name: productName, category: category, price: price, sku: sku };
        fetch(url, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                alert(data.message);
                location.href = "Frontend.html?classList=Active";
            })
    }

    async function filterParentProduct() {
        category = document.getElementById('pcategory').value;
        if (category.trim() == 'All category') {
            viewProductList();
        }
        let storeId = document.getElementById('vstoreId').value;


        let url = `http://localhost:8080/getProductbyCategory/${category}`;
        fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
        })
            .then(response => {
                return response.json();
            })
            .then(data => {

                showProductsInTable(data.products);
            })
            .catch(error => {
                alert(error);
            })
    }




    function addParentProduct(event) {
        event.preventDefault();
        let productName = document.getElementById('parentproductName').value;
        let category = document.getElementById('parentcategory').value;
        let productPrice = document.getElementById('parentproductPrice').value;
        let SKU = document.getElementById('parentSKU').value;

        let data = { name: productName, category: category, price: productPrice, sku: SKU };

        let url = "http://localhost:8080/storeManager/addProduct"
        fetch(url, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                alert(data.message);
                location.href = "Frontend.html?classList=Active";
            })
    }


    function validateQuantity(OrderNo) {
        quantity = document.getElementById(`orderProductQuantity${OrderNo}`).value;
        storeId = document.getElementById('orderStoreId').value;
        productId = document.getElementById(`orderProductId${OrderNo}`).value;
        if (!quantity || !productId || !storeId) {
            return;
        }
        let url = `http://localhost:8080/validateQuantity/${quantity}/${storeId}/${productId}`
        fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" }
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (!data) {
                    alert("Limited Quantity Available, Reduce quantity")
                }
            })
            .catch(error => {
                alert(error);
            })
    }

    async function placeOrder(event) {
        event.preventDefault();

        // Collecting form field values
        let storeId = document.getElementById("orderStoreId").value;
        let customerName = document.getElementById("customerName").value;
        let customerEmail = document.getElementById("customerEmail").value;
        let customerPhone = document.getElementById("customerPhone").value;
        let datetime = document.getElementById("datetime").value;
        let totalOrderValue = document.getElementById('totalOrderValue').value;
        if (!totalOrderValue) {
            alert("Enter atleast one product");
            return
        }

        let purchaseProduct = [];
        console.log(deleteRow);
        for (let i = 1; i <= Ordercount; i++) {

            if (deleteRow.includes(i)) {
                console.log("hi");
                continue;
            }
            console.log(`orderProductName${i}`);

            let orderProductName = document.getElementById(`orderProductName${i}`).value;
            let orderProductId = document.getElementById(`orderProductId${i}`).value;
            let orderProductPrice = document.getElementById(`orderProductPrice${i}`).value;
            let orderProductQuantity = document.getElementById(`orderProductQuantity${i}`).value;
            let orderProductTotal = document.getElementById(`orderTotal${i}`).value;

            let data = {
                name: orderProductName,
                id: orderProductId,
                price: orderProductPrice,
                quantity: orderProductQuantity,
                total: orderProductTotal
            };
            purchaseProduct.push(data);
        }


        let orderData = {
            storeId: storeId,
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            datetime: datetime,
            purchaseProduct: purchaseProduct,
            totalPrice: totalOrderValue
        };


        try {
            const response = await fetch('http://localhost:8080/placeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            }).then(response => {
                return response.json();
            }).then(data => {
                if (data.message) {
                    alert(data.message);
                }
                else {
                    alert(data.error);
                }
            })

        } catch (error) {
            alert('Error placing order:', error);
        }
    }

