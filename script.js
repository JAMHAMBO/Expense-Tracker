const expenseName = document.querySelector("#expenseName");
const expenseAmount = document.querySelector("#expenseAmount");
const category = document.querySelector("#category");
const expenseDate = document.querySelector("#expenseDate");
const addExpense = document.querySelector("#addExpense");
const filterCategory = document.querySelector("#filterCategory");
const expenseTable = document.querySelector("#expenseTable");
const totalExpense = document.querySelector("#totalExpense");
const editModal = document.querySelector("#editModal");
const editName = document.querySelector("#editName");
const editAmount = document.querySelector("#editAmount");
const editCategory = document.querySelector("#editCategory");
const editDate = document.querySelector("#editDate");
const saveEdit = document.querySelector("#saveEdit");
const cancelEdit = document.querySelector("#cancelEdit");
let total = 0;
let expenses = [];
let editingExpense = null;

loadExpenses();

function addExpenseTable(expense) {
    const row = document.createElement("tr");

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    const td5 = document.createElement("td");

    const editBtn = document.createElement("button")
    const deleteBtn = document.createElement("button")

    td1.textContent = expense.name;
    td2.textContent = `₹${expense.amount}`;
    td3.textContent = expense.category;
    td4.textContent = expense.date;

    editBtn.textContent = "Edit";
    deleteBtn.textContent = "Delete";

    editBtn.classList.add("action-btn", "edit");
    deleteBtn.classList.add("action-btn", "delete");

    //DELETE ROW
    deleteBtn.addEventListener("click", () => {

        expenses = expenses.filter((item) => {
            return item.id !== expense.id;
        });

        saveExpenses();

        displayExpenses(expenses);
        addTotal(expenses);

    });
    td5.append(editBtn, deleteBtn);

    editBtn.addEventListener("click", () => {
        editingExpense = expense;

        editModal.style.display = "flex";

        editName.value = expense.name;
        editAmount.value = expense.amount;
        editCategory.value = expense.category;
        editDate.value = expense.date;
    })


    row.append(td1, td2, td3, td4, td5);
    expenseTable.append(row);
}

saveEdit.addEventListener("click", () => {
    editingExpense.name = editName.value;
    editingExpense.amount = Number(editAmount.value);
    editingExpense.category = editCategory.value;
    editingExpense.date = editDate.value;

    saveExpenses();

    displayExpenses(expenses);
    addTotal(expenses);
    editingExpense = null;

    editModal.style.display = "none";
});

cancelEdit.addEventListener("click", () => {

    editModal.style.display = "none";
    editingExpense = null;

});

function displayExpenses(list) {

    expenseTable.innerHTML = "";

    list.forEach((expense) => {

        addExpenseTable(expense);

    });

}

function addTotal(list) {
    total = 0;
    list.forEach(expense => {

        total = total + expense.amount;
    });
    totalExpense.textContent = `₹${total}`;
}

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadExpenses() {
    const savedExpenses = localStorage.getItem("expenses");

    if (savedExpenses != null) {
        expenses = JSON.parse(savedExpenses);
        displayExpenses(expenses);
        addTotal(expenses);
    }
}


filterCategory.addEventListener("change", () => {
    const selectedCategory = filterCategory.value;

    if (selectedCategory === "All") {
        displayExpenses(expenses);
        addTotal(expenses);
    }
    else {
        expenseTable.innerHTML = ""

        const filteredExpenses = expenses.filter((expense) => {
            return expense.category === selectedCategory;
        });
        displayExpenses(filteredExpenses);
        addTotal(filteredExpenses);
    }

});

addExpense.addEventListener("click", () => {

    if (expenseName.value === "" || expenseAmount.value === "" || category.value === "" || expenseDate.value === "") {
        alert("Please fill all fields");
        return;
    }

    const expense = {
        id: Date.now(),
        name: expenseName.value,
        amount: Number(expenseAmount.value),
        category: category.value,
        date: expenseDate.value
    };
    expenses.push(expense)

    saveExpenses();

    displayExpenses(expenses);
    addTotal(expenses);

    expenseName.value = "";
    expenseAmount.value = "";
    category.value = "";
    expenseDate.value = "";
})