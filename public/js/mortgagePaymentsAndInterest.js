const getVal = (id) => parseFloat(get(id).value);
const addOutput = (message) => get('output').innerHTML += message;

const getMonthlyInterestRate = (interestRate) => {
    const decimalRate = interestRate - 1;
    const monthlyDecimalRate = decimalRate / 12;
    return monthlyDecimalRate + 1;
};

const formatAmount = (amount) => {
    const formattedOutput = amount.toLocaleString('en-us', 2) + '';
    if (formattedOutput.indexOf('.') === -1) {
        return formattedOutput;
    }
    
    const [big, small] = formattedOutput.split('.');
    return `${big}.${small.substring(0, 2)}`;
}

const createHighlights = (payDownItems, noPayDownItems) => {
    const lastPayDown = payDownItems.paidOffMonthRow;
    const longerNoPayDown = payDownItems.monthlySavings[noPayDownItems.paidOffMonthIndex];

    const lastNoPayDown = noPayDownItems.paidOffMonthRow
    const midwayNoPayDown = noPayDownItems.monthlySavings[payDownItems.paidOffMonthIndex];

    let output = `<div>In ${payDownItems.paidOffMonthIndex} months you paid ${formatAmount(lastPayDown.totalAmountPaid)} with ${formatAmount(lastPayDown.totalInterestPaid)} interest</div>`;
    output += `<div>After paying off the loan you could've saved ${formatAmount(longerNoPayDown.totalSavings)} in ${noPayDownItems.paidOffMonthIndex} months</div>`;

    output += `<br /><div>If you didn't payoff anything it would take ${noPayDownItems.paidOffMonthIndex} months to pay off the loan</div>`;
    output += `<div>You would've paid ${formatAmount(lastNoPayDown.totalAmountPaid)} with ${formatAmount(lastNoPayDown.totalInterestPaid)} interest</div>`;
    output += `<div>You could've saved ${formatAmount(midwayNoPayDown.totalSavings)} in ${payDownItems.paidOffMonthIndex} months</div>`;
    output += `<div>You could've saved ${formatAmount(lastNoPayDown.totalSavings)} in ${noPayDownItems.paidOffMonthIndex} months</div>`;
    

    // const savingsAmount = (lastNoPayDown.totalAmountPaid - lastPayDown.totalAmountPaid) - lastPayDown.totalSavings;
    // output += `<br /><div>Paying off this amount you netted ${formatAmount(savingsAmount)}</div>`;
    return output;
};

const createMonthlyRates = ({
    amountRemaining,
    amountToPayOff,
    monthlyPayment,
    monthlyMortgageRate,
    amountToSave,
    monthlySavingsInterestRate,
    totalMonths,
}) => {
    const outputs = [];
    let totalAmountPaid = amountToPayOff;
    let totalInterestPaid = 0;
    let totalSavings = amountToSave;
    let paidOffMonthIndex = -1;

    let monthIndex = 0;
    while (monthIndex < totalMonths) {
        monthIndex++;

        // Add interest for the month
        const interestForMonth = (amountRemaining * monthlyMortgageRate) - amountRemaining;
        amountRemaining += interestForMonth;

        totalSavings += (totalSavings * monthlySavingsInterestRate) - totalSavings;

        // Pay off an amount
        amountRemaining -= monthlyPayment;
        if (amountRemaining <= 0) {
            if (paidOffMonthIndex > 0) {
                totalSavings += monthlyPayment;
            } else {
                paidOffMonthIndex = monthIndex;
                // Amount remaining is now a negative number and and overpayment amount
                const overpaymentAmount = Math.abs(amountRemaining);
                totalAmountPaid += monthlyPayment - overpaymentAmount; 
                totalSavings += overpaymentAmount;                
            }

            // Set amount remaining after setting overpayment amount
            amountRemaining = 0;

            outputs.push({
                amountRemaining,
                interestForMonth,
                monthIndex,
                totalAmountPaid,
                totalInterestPaid,
                totalSavings,
            });
            continue;
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
            totalSavings,
        });
    }

    const paidOffMonthRow = outputs[paidOffMonthIndex - 1];
    return {
        monthlySavings: outputs,
        paidOffMonthIndex,
        paidOffMonthRow,
    };
};

const calculateAmount = () => {
    get('output').innerHTML = "";

	let amountRemaining = getVal('amountRemaining');
    const amountToPayOff = getVal('amountToPayOff');
    const monthlyPayment = getVal('monthlyPayment');
    const totalMonths = getVal('totalMonths');
    
    const mortgageInterestRate = getVal('mortgageInterestRate');
	const monthlyMortgageRate = getMonthlyInterestRate(mortgageInterestRate);
    console.log('monthlyMortgageRate', monthlyMortgageRate);

    const amountToSave = getVal('amountToSave');
    const savingsInterestRate = getVal('savingsInterestRate');
	const monthlySavingsInterestRate = getMonthlyInterestRate(savingsInterestRate);
    console.log('monthlySavingsInterestRate', monthlySavingsInterestRate);

    const payingOffOutputs = createMonthlyRates({
        amountRemaining: amountRemaining - amountToPayOff,
        amountToPayOff,
        monthlyPayment,
        monthlyMortgageRate,
        amountToSave: amountToSave,
        monthlySavingsInterestRate,
        totalMonths,
    });

    const fullSavingOutputs = createMonthlyRates({
        amountRemaining,
        amountToPayOff: 0,
        monthlyPayment,
        monthlyMortgageRate,
        amountToSave: amountToSave + amountToPayOff,
        monthlySavingsInterestRate,
        totalMonths,
    });
    console.log('fullSavingOutputs', fullSavingOutputs);

    

    let table = '<table>';
    table += '<tr>';
    table += '<th>Month</th>';
    table += '<th>Monthly Interest</th>';
    table += '<th>Total Interest</th>';
    table += '<th>Total Paid</th>';
    table += '<th>Amount Remaining</th>';
    table += '<th>Total Savings</th>';
    table += '<th></th>';
    table += '<th>Monthly Interest</th>';
    table += '<th>Total Interest</th>';
    table += '<th>Total Paid</th>';
    table += '<th>Amount Remaining</th>';
    table += '<th>Total Savings</th>';
    table += '<th></th>';
    table += '<th>Net</th>';
    table += '</tr>';
    for (let i = 0; i < totalMonths; i++) {
        const paidOffItem = payingOffOutputs.monthlySavings[i];
        const fullSaveItem = fullSavingOutputs.monthlySavings[i];

        const paidOffNet = paidOffItem.totalSavings - (paidOffItem.totalAmountPaid + paidOffItem.amountRemaining);
        const fullSaveNet = fullSaveItem.totalSavings - (fullSaveItem.totalAmountPaid + fullSaveItem.amountRemaining);

        const createRowOutput = (item) => {
            const net = item.totalSavings - (item.totalAmountPaid + item.amountRemaining);
            return `
                <td>${formatAmount(item.interestForMonth)}</td>
                <td>${formatAmount(item.totalInterestPaid)}</td>
                <td>${formatAmount(item.totalAmountPaid)}</td>
                <td>${formatAmount(item.amountRemaining)}</td>
                <td title='Net ${formatAmount(net)}'>${formatAmount(item.totalSavings)}</td>
            `;
        };

        const monthOutput = i % 12 === 0 ? 'Year ' + i / 12 : i;
        table += `
            <tr>
                <td>${monthOutput}</td>
                ${createRowOutput(paidOffItem)}
                <td></td>
                ${createRowOutput(fullSaveItem)}
                <td></td>
                <td>${formatAmount(paidOffNet - fullSaveNet)}</td>
            </tr>
        `;
    }
    table += `</table>`;
    addOutput(createHighlights(payingOffOutputs, fullSavingOutputs));
    addOutput('<br />');
    addOutput(table);
};
