const getVal = (id) => parseFloat(get(id).value);
const addOutput = (message) => get('output').innerHTML += message;

const getMonthlyInterestRate = (interestRate) => {
    const decimalRate = interestRate - 1;
    const monthlyDecimalRate = decimalRate / 12;
    return monthlyDecimalRate + 1;
};

const formatAmount = (amount) => amount.toLocaleString('en-us', 2);

const calculateAmount = () => {
    get('output').innerHTML = "";

	let amountRemaining = getVal('amountRemaining');
    const amountToPay = getVal('amountToPay');
    const monthlyPayment = getVal('monthlyPayment');
    
    const mortgageInterestRate = getVal('mortgageInterestRate');
	const monthlyMortgageRate = getMonthlyInterestRate(mortgageInterestRate);
    console.log('monthlyMortgageRate', monthlyMortgageRate);

    const savingsInterestRate = getVal('savingsInterestRate');
	const monthlySavingsRate = getMonthlyInterestRate(savingsInterestRate);


    const outputs = [];    
    let totalAmountPaid = 0;
    let totalInterestPaid = 0;

    let monthIndex = 0;
    while (amountRemaining > 0 && monthIndex < 360) {
        monthIndex++;


        // Add interest for the month
        const interestForMonth = (amountRemaining * monthlyMortgageRate) - amountRemaining;
        amountRemaining += interestForMonth;

        // Pay off an amount
        amountRemaining -= monthlyPayment;
        if (amountRemaining <= 0) {
            // Amount remaining is the extra we paid off so substract that (It's a negative #)
            totalAmountPaid += monthlyPayment + amountRemaining;
            break;
        }
        
        

        // Add interest and how much we paid to total
        totalInterestPaid += interestForMonth;
        totalAmountPaid += monthlyPayment;
        outputs.push({
            amountRemaining,
            interestForMonth,
            monthIndex,
            totalAmountPaid,
            totalInterestPaid,
        });
    }

    

    let table = '<table>';
    table += '<tr>';
    table += '<th>Month</th>';
    table += '<th>Monthly Interest</th>';
    table += '<th>Total Interest</th>';
    table += '<th>Total Amount Paid</th>';
    table += '<th>Amount Remaining</th>';
    table += '</tr>';
    outputs.forEach((output) => {
        const monthOutput = output.monthIndex % 12 === 0 ? 'Year ' + output.monthIndex / 12 : output.monthIndex;
        table += `
            <tr>
                <td>${monthOutput}</td>
                <td>${formatAmount(output.interestForMonth)}</td>
                <td>${formatAmount(output.totalInterestPaid)}</td>
                <td>${formatAmount(output.totalAmountPaid)}</td>
                <td>${formatAmount(output.amountRemaining)}</td>
            </tr>
        `;
    });

    table += `</table>`;
    addOutput(table);
};
