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
    const lastPayDown = payDownItems[payDownItems.length - 1];
    const lastNoPayDown = noPayDownItems[noPayDownItems.length - 1];
    let output = `<div>In ${payDownItems.length} months you paid ${formatAmount(lastPayDown.totalAmountPaid)} with ${formatAmount(lastPayDown.totalInterestPaid)} interest</div>`;
    output += `<div>You could've saved ${formatAmount(lastPayDown.totalSavings)} in ${payDownItems.length} months</div>`;
    output += `<br /><div>If you didn't payoff anything</div>`;
    output += `<div>In ${noPayDownItems.length} months you paid ${formatAmount(lastNoPayDown.totalAmountPaid)} with ${formatAmount(lastNoPayDown.totalInterestPaid)} interest</div>`;
    
    
    const savingsAmount = (lastNoPayDown.totalAmountPaid - lastPayDown.totalAmountPaid) - lastPayDown.totalSavings;
    output += `<br /><div>Paying off this amount you netted ${formatAmount(savingsAmount)}</div>`;
    return output;
};

const createMonthlyRates = ({
    amountRemaining,
    amountToPayOrSave,
    monthlyPayment,
    monthlyMortgageRate,
    monthlySavingsInterestRate,
}) => {
    const outputs = [];
    let totalAmountPaid = 0;
    let totalInterestPaid = 0;
    let totalSavings = amountToPayOrSave;

    let monthIndex = 0;
    while (amountRemaining > 0 && monthIndex < 360) {
        monthIndex++;


        // Add interest for the month
        const interestForMonth = (amountRemaining * monthlyMortgageRate) - amountRemaining;
        amountRemaining += interestForMonth;

        totalSavings += (totalSavings * monthlySavingsInterestRate) - totalSavings;

        // Pay off an amount
        amountRemaining -= monthlyPayment;
        if (amountRemaining <= 0) {
            // Amount remaining is the extra we paid off so substract that (It's a negative #)
            totalAmountPaid += monthlyPayment + amountRemaining;
            outputs.push({
                amountRemaining: 0,
                interestForMonth,
                monthIndex,
                totalAmountPaid,
                totalInterestPaid,
                totalSavings,
            });
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
            totalSavings,
        });
    }
    return outputs;
};

const calculateAmount = () => {
    get('output').innerHTML = "";

	let amountRemaining = getVal('amountRemaining');
    const amountToPayOrSave = getVal('amountToPayOrSave');
    const monthlyPayment = getVal('monthlyPayment');
    
    const mortgageInterestRate = getVal('mortgageInterestRate');
	const monthlyMortgageRate = getMonthlyInterestRate(mortgageInterestRate);
    console.log('monthlyMortgageRate', monthlyMortgageRate);

    const savingsInterestRate = getVal('savingsInterestRate');
	const monthlySavingsInterestRate = getMonthlyInterestRate(savingsInterestRate);
    console.log('monthlySavingsInterestRate', monthlySavingsInterestRate);

    const payingOffOutputs = createMonthlyRates({
        amountRemaining: amountRemaining - amountToPayOrSave,
        amountToPayOrSave,
        monthlyPayment,
        monthlyMortgageRate,
        monthlySavingsInterestRate,
    });

    const fullSavingOutputs = createMonthlyRates({
        amountRemaining,
        amountToPayOrSave: 0,
        monthlyPayment,
        monthlyMortgageRate,
        monthlySavingsInterestRate,
    });
    console.log('fullSavingOutputs', fullSavingOutputs);

    

    let table = '<table>';
    table += '<tr>';
    table += '<th>Month</th>';
    table += '<th>Monthly Interest</th>';
    table += '<th>Total Interest</th>';
    table += '<th>Total Amount Paid</th>';
    table += '<th>Total Savings</th>';
    table += '<th>Amount Remaining</th>';
    table += '</tr>';
    payingOffOutputs.forEach((output) => {
        const monthOutput = output.monthIndex % 12 === 0 ? 'Year ' + output.monthIndex / 12 : output.monthIndex;
        table += `
            <tr>
                <td>${monthOutput}</td>
                <td>${formatAmount(output.interestForMonth)}</td>
                <td>${formatAmount(output.totalInterestPaid)}</td>
                <td>${formatAmount(output.totalAmountPaid)}</td>
                <td>${formatAmount(output.totalSavings)}</td>
                <td>${formatAmount(output.amountRemaining)}</td>
            </tr>
        `;
    });

    table += `</table>`;
    addOutput(createHighlights(payingOffOutputs, fullSavingOutputs));
    addOutput('<br />');
    addOutput(table);
};
