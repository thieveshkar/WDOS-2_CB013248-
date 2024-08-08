document.addEventListener("DOMContentLoaded", () => {
    const Fruit_Button = document.getElementById("Fruitbtn")
    const Vegetable_button = document.getElementById("vegbtn")
    const Diary_Button = document.getElementById("Diarybtn")
    const Meat_button = document.getElementById("meatbtn")
    const Baking_Button = document.getElementById("bakingbtn")
    const Apply_from_Fav_Btn=document.getElementById("applyfromfav")
    const Save_to_Fav=document.getElementById("savetoFav")
    const Save_to_Fav2=document.getElementById("savetoFav2")
    /**In lines 8 and 9, I have assigned two separate "save to favorites" button IDs to variables. 
     * This is because if a user wants to proceed to payment with items they have already saved as favorites, a different function will be used.
     * After adding items to favorites (saving them to local storage), and upon refreshing the page, the entire JavaScript will be reloaded, 
     * which resets the "selectedItems" array to empty. Therefore, when the user clicks on the "Apply from Favorites" and "Proceed to Payment" buttons,
     * a function is used to save the selected items to local storage. This way, I can retrieve the data on the payment page and process it. However, 
     * since the "selectedItems" array gets emptied after the page refresh, saving it at this point would result in an empty array, making the cart appear empty on the payment page.
     * To address this issue, I created two different buttons and separate functions.
     */
    const Cart_button = document.getElementById("carttable_btn")
    const PayNow_button_usingfav = document.getElementById("paynow_btn")
    const Paynowbtn=document.getElementById("paynow_btn2")


    let selectedItems = []//initializing empty array to keep track of the selected items

    function reveal_cart_btn() {
        Cart_button.style.display = "block"
        Apply_from_Fav_Btn.style.display="block"
    }

    function cartbtn_stylings() {
        carttablebtn.style.display = "flex"
    }


    function get_data_from_json(the_json_file_path, populate_table) {
        /* Here in this function, I have passed two parameters: one to pass the JSON file location
           and the "populate_table" as the callback function which will be used at the end.
           USAGE: This "populate_table" parameter specifically denotes the name of the function which has to be called.
           Since there are 5 categories and to make sure that there are fewer lines of code, 
           I have passed this parameter as a callback function. */
        fetch(the_json_file_path)
            .then(response => response.json()) // Gets the fetched data and converts it to a JSON file
            .then(content => {
                populate_table(content)// Passing the data to the callback function which was passed as a parameter at the beginning
                reveal_cart_btn() // This function is called here to make the button to populate the summary table visible when at least one of the category tables is populated. Until then, this will be hidden.
                cartbtn_stylings()
            })
            .catch(error => { 
                console.log("Error:", error) // If there are any errors, the error will be printed in the console
                alert("Error, please try again later")// This is for the end user to check back in a while if there were any errors. This will basically show a popup to the end user if any error is encountered.
            });
    }

    function create_table(tableId, data, headers, category) {
        /* This function is used to populate the category table, where I am passing the parameters:
           tableId - which will be the div's ID,
           data - which will be an array holding the data that is there in the JSON file for each category with the properties "name" and "price",
           headers - the array which will be used to define the heading of the table header,
           and finally the category which will be used to assign as an attribute to the checkbox element. */
        const tableContainer = document.getElementById(tableId)
        tableContainer.innerHTML = "" // Ensuring to empty the content under the specified ID, if there are any.

        const table = document.createElement("table")
        const headerRow = document.createElement("tr")

        headers.forEach(header => { // Iterating through the headers array, where it will be specified when calling for the function. Based on the given data, it will iterate through and create the element and append to the table header.
            const th = document.createElement("th")
            th.textContent = header
            headerRow.appendChild(th)
        });

        table.appendChild(headerRow)

        const tbody = document.createElement("tbody")
        data.forEach(item => { // Iterating through the "data" array, which has the data from the JSON file, and creating the table based on the data available.
            const row = document.createElement("tr")

            const checkboxCell = document.createElement("td")
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.name = item.Name
            checkbox.dataset.category = category
            checkbox.addEventListener('change', (event) => updateSelectedItems(event, item, category))
            /**In the above line of code along with a eventlistener i have used a arrow function to make sure to keep updated with the type of event, item and category,
             * the "event" will be a object which will be containing the information about the checkbox so later ill be able to use this and update the cart table
             *  that if the end user checks or unchecks a box(basically if the state of the checkbox changes), a function (updateSelectedItems) is called to update which 
             * items are selected.  */
            checkboxCell.appendChild(checkbox)
            row.appendChild(checkboxCell)

            const nameCell = document.createElement("td")
            nameCell.textContent = item.Name
            row.appendChild(nameCell)

            const priceCell = document.createElement("td")
            priceCell.textContent = item.Price
            row.appendChild(priceCell)

            const quantityCell = document.createElement("td")
            const quantityInput = document.createElement("input")
            quantityInput.type = "number"
            quantityInput.name = "quantity"
            quantityInput.min = "0"
            quantityInput.value = "0"
            quantityInput.placeholder = "Enter the quantity"
            quantityInput.addEventListener('input', (event) => updateQuantity(event, item, category))/**same like the i have made to upadte the sleceted items, i have made sure 
            here, that if the end user changes the amout of quantity, to call a function "updateQuantity" and keep the quantity updated*/
            quantityCell.appendChild(quantityInput)
            row.appendChild(quantityCell)

            tbody.appendChild(row)
        });

        table.appendChild(tbody)
        tableContainer.appendChild(table)
    }

    function create_fruit_table(data) {
        const headers = ["Selection", "Fruits", "Price", "Quantity(Kgs)"]
        create_table("table_visibility", data, headers, "fruit")
    }

    function create_vegatable_table(data) {
        const headers = ["Selection", "Vegetables", "Price", "Quantity(Kgs)"]
        create_table("table_visibility", data, headers, "vegetable")
    }

    function create_diary_table(data) {
        const headers = ["Selection", "Diary Products", "Price", "Quantity"]
        create_table("table_visibility", data, headers, "diary")
    }

    function create_meat_table(data) {
        const headers = ["Selection", "Meat and Seafood", "Price", "Quantity(Kgs)"]
        create_table("table_visibility", data, headers, "meat")
    }

    function create_baking_table(data) {
        const headers = ["Selection", "Baking and Ingredient", "Price", "Quantity"]
        create_table("table_visibility", data, headers, "baking")
    }

    function updateSelectedItems(event, item, category) {
        const checkbox = event.target// getting the checkbox element assigned to the varaible
        const row = checkbox.parentElement.parentElement // Get the parent row of the checkbox
        const quantityInput = row.querySelector('input[name="quantity"]')
        const quantity = quantityInput.value

        if (checkbox.checked) {//checking if the checkbox ix checked, if so it will add to the array
            selectedItems.push({
                name: item.Name,
                price: parseFloat(item.Price),
                quantity: parseInt(quantity),
                category: category
            });
        } else {// If the checkbox is unchecked,the item will ba removed from the array
            selectedItems = selectedItems.filter(selectedItem => selectedItem.name !== item.Name || selectedItem.category !== category)
            /**in the above line of im checking if the unchecked items name and category are same, it will remove from the array or else it will be there
             * ex: if "apple" and "banana" is there in the slected items and if the "apple" is being unchecked;
             *         * for "apple": name !== "apple" is false, and category !== "fruit" is also false. (apple fails and removed)
             *         * for "banana": name !== "apple" is true (different name). (banana passes the tst and stay)   
              */
        }
    }
    function updateQuantity(event, item, category) {
        /*Ex: If the user changes the quantity of "Apple" to 5:
             This function will be triggered and then finds "Apple" in selectedItems, and updates its quantity to 5. using a if statement. 
             in that way it is easy to keep track of the quantity*/
        const quantityInput = event.target
        const quantity = quantityInput.value

        selectedItems.forEach(selectedItem => {
            if (selectedItem.name === item.Name && selectedItem.category === category) {
                selectedItem.quantity = parseInt(quantity)
            }
        });
    }
    function displayCart() {
        Paynowbtn.style.display="block"
        proceedpaymentwithoutfav.style.display="flex"
        const cartTable = document.getElementById("cart_table")
        cartTable.innerHTML = ""

        const headerRow = document.createElement("tr")
        const nameHeader = document.createElement("th")
        const priceHeader = document.createElement("th")
        const quantityHeader = document.createElement("th")
        const totalHeader = document.createElement("th")

        nameHeader.textContent = "Product Name"
        priceHeader.textContent = "Price per Unit"
        quantityHeader.textContent = "Quantity"
        totalHeader.textContent = "Total Price"

        headerRow.appendChild(nameHeader)
        headerRow.appendChild(priceHeader)
        headerRow.appendChild(quantityHeader)
        headerRow.appendChild(totalHeader)
        cartTable.appendChild(headerRow)

        let grandTotal = 0; 

        selectedItems.forEach(item => {
            const row = document.createElement("tr")

            const nameCell = document.createElement("td")
            nameCell.textContent = item.name
            row.appendChild(nameCell)

            const priceCell = document.createElement("td")
            priceCell.textContent = item.price.toFixed(2)
            row.appendChild(priceCell)

            const quantityCell = document.createElement("td")
            quantityCell.textContent = item.quantity
            row.appendChild(quantityCell)

            const totalCell = document.createElement("td")
            const totalPrice = item.price * item.quantity
            totalCell.textContent = totalPrice.toFixed(2)
            row.appendChild(totalCell);

            cartTable.appendChild(row)

            grandTotal += totalPrice 
        });

        
        const grandTotalRow = document.createElement("tr")

        const emptyCell1 = document.createElement("td")
        const emptyCell2 = document.createElement("td")
        const grandTotalLabelCell = document.createElement("td")
        grandTotalLabelCell.textContent = "Grand Total"
        grandTotalLabelCell.style.fontWeight = "bold"

        const grandTotalValueCell = document.createElement("td")
        grandTotalValueCell.textContent = grandTotal.toFixed(2)
        grandTotalValueCell.style.fontWeight = "bold";

        grandTotalRow.appendChild(emptyCell1)
        grandTotalRow.appendChild(emptyCell2)
        grandTotalRow.appendChild(grandTotalLabelCell)
        grandTotalRow.appendChild(grandTotalValueCell)

        cartTable.appendChild(grandTotalRow) 
    }

    function SaveOrderToFav(){
        if (selectedItems.length>0) {
            localStorage.setItem("selectedItems", JSON.stringify(selectedItems)) /*Here I am making sure to save the selected items 
            to the local storage by converting the the "selectedItems" array to JSON formatted string.in that way it is possible to retrive the data 
            when "apply favourites" and "pay now" is clicked using that it is possible to populate the cart table in both the pages*/
            alert("Order has been added to Favourites")
            
        } else {
            alert("Add Products to save")
            
        }
       
    }

    function displayfavitems() {
        const FavCartTable = document.getElementById("cart_table")
        const selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || []
        PayNow_button_usingfav.style.display="block"
        savorder.style.display="flex"
        FavCartTable.innerHTML = "";

        const headerRow = document.createElement("tr");
        const nameHeader = document.createElement("th");
        const priceHeader = document.createElement("th");
        const quantityHeader = document.createElement("th");
        const totalHeader = document.createElement("th");

        nameHeader.textContent = "Product Name";
        priceHeader.textContent = "Price per Unit";
        quantityHeader.textContent = "Quantity";
        totalHeader.textContent = "Total Price";

        headerRow.appendChild(nameHeader);
        headerRow.appendChild(priceHeader);
        headerRow.appendChild(quantityHeader);
        headerRow.appendChild(totalHeader);
        FavCartTable.appendChild(headerRow);

        let grandTotal = 0;

        selectedItems.forEach(item => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            const priceCell = document.createElement("td");
            priceCell.textContent = item.price.toFixed(2);
            row.appendChild(priceCell);

            const quantityCell = document.createElement("td");
            quantityCell.textContent = item.quantity;
            row.appendChild(quantityCell);

            const totalCell = document.createElement("td");
            const totalPrice = item.price * item.quantity;
            totalCell.textContent = totalPrice.toFixed(2);
            row.appendChild(totalCell);

            FavCartTable.appendChild(row);

            grandTotal += totalPrice;
        });

        const grandTotalRow = document.createElement("tr");

        const emptyCell1 = document.createElement("td");
        const emptyCell2 = document.createElement("td");
        const grandTotalLabelCell = document.createElement("td");
        grandTotalLabelCell.textContent = "Grand Total";
        grandTotalLabelCell.style.fontWeight = "bold";

        const grandTotalValueCell = document.createElement("td");
        grandTotalValueCell.textContent = grandTotal.toFixed(2);
        grandTotalValueCell.style.fontWeight = "bold";

        grandTotalRow.appendChild(emptyCell1);
        grandTotalRow.appendChild(emptyCell2);
        grandTotalRow.appendChild(grandTotalLabelCell);
        grandTotalRow.appendChild(grandTotalValueCell);

        FavCartTable.appendChild(grandTotalRow)
    }

    function Paynow_using_fav() {
        window.location.href = "Payment_Page.html"//this line make sure to redirect to the Payment page once the btn is clicked
    }
    function Paynow(){
        if (selectedItems.length>0) {
            window.location.href = "Payment_Page.html"//this line make sure to redirect to the Payment page once the btn is clicked
            localStorage.setItem("selectedItems", JSON.stringify(selectedItems))
        } else {
            alert("Your cart is empty, Try adding some products")
            
        }
    }



    Fruit_Button.addEventListener("click", () => get_data_from_json("./Json_Files/Fruit.json", create_fruit_table))
    Vegetable_button.addEventListener("click", () => get_data_from_json("./Json_Files/Vegetables.json", create_vegatable_table))
    Diary_Button.addEventListener("click", () => get_data_from_json("./Json_Files/DiaryProducts.json", create_diary_table))
    Meat_button.addEventListener("click", () => get_data_from_json("./Json_Files/Meat&Seafood.json", create_meat_table))
    Baking_Button.addEventListener("click", () => get_data_from_json("./Json_Files/Baking&Ingredients.json", create_baking_table))
    Cart_button.addEventListener("click", displayCart)
    PayNow_button_usingfav.addEventListener("click", Paynow_using_fav)
    Paynowbtn.addEventListener("click", Paynow)
    Save_to_Fav.addEventListener("click", SaveOrderToFav)
    Save_to_Fav2.addEventListener("click", SaveOrderToFav)
    Apply_from_Fav_Btn.addEventListener("click", displayfavitems)

});
