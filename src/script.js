transactions = JSON.parse(localStorage.getItem('transactions')) || []
let total = JSON.parse(localStorage.getItem('total')) || {
    balance: 0,
    income: 0,
    expenses: 0,
}
let i = transactions.length;
const form = document.querySelector('form')
const totalBalance = document.querySelector('.balance-sum')
const totalIncome = document.querySelector('.income-sum')
const totalExpense = document.querySelector('.expenses-sum')
const transactionsHistory = document.querySelector('.transaction-history__list')



render = () => {
    totalBalance.textContent = total.balance
    totalIncome.textContent = total.income
    totalExpense.textContent = total.expenses
    transactionsHistory.textContent = ""

    transactions.forEach((transaction, index) => {
        let transactionsHistoryElement = document.createElement('li')
        transactionsHistoryElement.innerHTML = `
        <div class="transaction-description">
            Transaction type: <span class="transaction-type">${transaction.type}</span>
        </div>
        <span class="transaction-amount">${transaction.amount}</span>
    `
        transactionsHistory.appendChild(transactionsHistoryElement)
    })
}


form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(form);
    const amount = parseFloat(formData.get('amount'))
    const operationType = formData.get('transaction-type')

    if (operationType === 'Income') {
        total.balance += amount
        total.income += amount
    }
    else {
        total.balance -= amount
        total.expenses += amount
    }

    const transaction = {
        id: i,
        amount: amount,
        date: new Date(),
        type: formData.get('transaction-type'),
    }

    transactions.push(transaction)

    localStorage.setItem('total', JSON.stringify(total))
    localStorage.setItem('transactions', JSON.stringify(transactions))

    console.log(transaction);
    console.log(`total income: ${total.income} \n total expenses: ${total.expenses} \n total balance: ${total.balance} \n`);
    render()
    form.reset()
})

render()