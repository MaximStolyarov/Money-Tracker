transactions = JSON.parse(localStorage.getItem('transactions')) || []
let total = JSON.parse(localStorage.getItem('total')) || {
    balance: 0,
    income: 0,
    expenses: 0,
}
const form = document.querySelector('form')
const totalBalance = document.querySelector('.balance-sum')
const totalIncome = document.querySelector('.income-sum')
const totalExpense = document.querySelector('.expenses-sum')
const transactionsHistory = document.querySelector('.transaction-history__list')
const deleteAllBtn = document.querySelector('.history-delete-all__button')


const formatDate = (date) => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date))
}


render = () => {
    totalBalance.textContent = total.balance
    totalIncome.textContent = total.income
    totalExpense.textContent = total.expenses
    transactionsHistory.textContent = ""
    localStorage.setItem('transactions', JSON.stringify(transactions))
    localStorage.setItem('total', JSON.stringify(total))

    transactions.forEach((transaction, index) => {
        let transactionsHistoryElement = document.createElement('li')
        transactionsHistoryElement.setAttribute('id', `${transaction.id}`)
        transactionsHistoryElement.innerHTML = `
        <div class="transaction-description">
            Transaction type: <span class="transaction-type">${transaction.type}</span>
            <small class="transaction-date">
                ${formatDate(transaction.date)}
            </small>
        </div>
        
        <span class="transaction-amount">${transaction.amount}</span>
        <button class="history-delete-transaction__button">Delete transaction</button>
    `
        transactionsHistory.appendChild(transactionsHistoryElement)

    })
}

render()

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
        id: Date.now(),
        amount: amount,
        date: new Date(),
        type: formData.get('transaction-type'),
    }

    transactions.push(transaction)
    render()
    form.reset()
})

deleteAllBtn.addEventListener('click', (e) => {
    e.preventDefault()
    transactions.length = 0
    Object.keys(total).forEach((key) => {
        total[key] = 0
    })
    render()
})

transactionsHistory.addEventListener('click', (e) => {
    if (e.target.classList.contains('history-delete-transaction__button')) {
        e.preventDefault()
        const listItem = e.target.closest('li')
        const transactionId = parseInt(listItem.getAttribute('id'))

        const transactionIndex = transactions.findIndex(t => t.id === transactionId)

        if (transactionIndex !== -1) {
            const transaction = transactions[transactionIndex]

            if (transaction.type === 'Income') {
                total.balance -= transaction.amount
                total.income -= transaction.amount
            } else {
                total.balance += transaction.amount
                total.expenses -= transaction.amount
            }

            transactions.splice(transactionIndex, 1)

            render()
    }
}})


render()