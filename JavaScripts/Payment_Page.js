document.addEventListener("DOMContentLoaded", () => {
    const summaryTable = document.getElementById("summary_table");
    const selectedItems = JSON.parse(localStorage.getItem("selectedItems")) || [];/**here im getting the data stored in the local storage and 
    if there was no data im making the array empty, to make sure that the code runs with having a seperate if statement for valaidion like with "Null Validation"   */

    function displayOrder() {
        summaryTable.innerHTML = "";

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
        summaryTable.appendChild(headerRow);

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

            summaryTable.appendChild(row);

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

        summaryTable.appendChild(grandTotalRow);
    }

    displayOrder();

    const visaCard = document.getElementById("visacard");
    const masterCard = document.getElementById("master_card");
    const americanExpressCard = document.getElementById("americanexpresscard");
    const cod = document.getElementById("cod");
    const cardDetails = document.getElementById("Carddetails");

    const cardDetailsForm = `
        <form action="">
            <label for="card_name">Name on Card</label><br>
            <input type="text" id="card_name" required><br><br>
            <label for="card_number">Card Number</label><br>
            <input type="number" id="card_number" maxlength="16" required><br><br>
            <label for="expiry_date">Expiry Date</label><br>
            <input type="date" id="expiry_date" required><br><br>
            <label for="cvv">CVV</label><br>
            <input type="number" id="cvv" maxlength="3" required>
        </form>`;

    function showCardDetails() {
        cardDetails.innerHTML = cardDetailsForm;
    }

    function hideCardDetails() {
        cardDetails.innerHTML = "";
    }

    visaCard.addEventListener("click", showCardDetails);
    masterCard.addEventListener("click", showCardDetails);
    americanExpressCard.addEventListener("click", showCardDetails);
    cod.addEventListener("click", hideCardDetails);

    function validateForm() {
        let isValid = true; //here i have intialized a variable with boolean expression fo the overall form validation so if atleast one validation takes "false", then in the if statement the message will be added to the message variable 
        let message = "";//i have intialized a variable to keep track of error messages, if any invaild inputs entered by the end user

        const fname = document.getElementById('fname').value.trim();
        const lname = document.getElementById('lname').value.trim();
        const streetAddress = document.getElementById('street_address').value.trim();
        const townCity = document.getElementById('town_city').value.trim();
        const postalCode = document.getElementById('postalcode').value.trim();
        const phoneNumber = document.getElementById('phonenumber').value.trim();
        const email = document.getElementById('email').value.trim();
        const successMessage = document.getElementById("successfull");

        // Personal Information Validation
        if (fname === "") {
            isValid = false;
            message += "First Name is required. ";
        }
        if (lname === "") {
            isValid = false;
            message += "Last Name is required. ";
        }
        if (streetAddress === "") {
            isValid = false;
            message += "Street Address is required. ";
        }
        if (townCity === "") {
            isValid = false;
            message += "Town/City is required. ";
        }
        if (postalCode === "" || postalCode.length !== 4 || isNaN(postalCode)) {
            isValid = false;
            message += "Please enter the Postal Code Correctly. ";
        }
        if (phoneNumber === "" || phoneNumber.length !== 10 || isNaN(phoneNumber)) {
            isValid = false;
            message += "Please enter the Phone Number Correctly. ";
        }
        if (email === "") {
            isValid = false;
            message += "Email Address is required. ";
        }

        // Card Details Validation
        if (visaCard.checked || masterCard.checked || americanExpressCard.checked) {
            const cardName = document.getElementById('card_name').value.trim();
            const cardNumber = document.getElementById('card_number').value.trim();
            const expiryDate = document.getElementById('expiry_date').value;
            const cvv = document.getElementById('cvv').value.trim();

            if (cardName === "") {
                isValid = false;
                message += "Name on Card is required. ";
            }
            if (cardNumber === "" || cardNumber.length !== 16 || isNaN(cardNumber)) {
                isValid = false;
                message += "Please enter the Card Number Correctly. ";
            }
            if (expiryDate === "") {
                isValid = false;
                message += "Expiry Date is required. ";
            }
            if (cvv === "" || cvv.length !== 3 || isNaN(cvv)) {
                isValid = false;
                message += "Please enter the CVV Correctly. ";
            }
        }

        if (isValid) {
            successMessage.textContent = "Order has been accepted successfully! " + printdatetwodaysfromtoday();
            successMessage.style.color = "green";
        } else {
            successMessage.textContent = message;
            successMessage.style.color = "red";
        }
    }

    function printdatetwodaysfromtoday() {
        const today = new Date();
        today.setDate(today.getDate() + 2);

        const year = today.getFullYear();
        const month = today.getMonth() + 1;// Months are 0-based, so add 1
        const day = today.getDate();

        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        return `Your order will be delivered on ${formattedDate}`;
    }

    document.getElementById('proceed').addEventListener('click', validateForm);
});






