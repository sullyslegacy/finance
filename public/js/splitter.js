const fillIn600 = () => {
    get('housePrice').value = 600000;
    get('houseAppreciationPrice').value = 660000;
    get('monthlyMortgage').value = 2550;
}

const fillIn650 = () => {
    get('housePrice').value = 650000;
    get('houseAppreciationPrice').value = 715000;
    get('monthlyMortgage').value = 2750;
}

const fillIn700 = () => {
    get('housePrice').value = 700000;
    get('houseAppreciationPrice').value = 770000;
    get('monthlyMortgage').value = 2900;
}

const calculateHouseSplit = () => {
    const results = [];
    const housePrice = parseFloat(get('housePrice').value);
    const houseAppreciationPrice = parseFloat(get('houseAppreciationPrice').value);
    const appreciationRate = houseAppreciationPrice / housePrice;
    const downPaymentRate = parseFloat(get('downPaymentRate').value) / 100;
    const downPaymentAmount = housePrice * downPaymentRate;
    const loanAmount = housePrice - downPaymentAmount;

    const monthlyMortgage = parseFloat(get('monthlyMortgage').value);
    const mortgageDuration = parseFloat(get('mortgageDuration').value);
    const mortgageDurationMonths = mortgageDuration * 12;
    const primarySplit = parseFloat(get('primarySplit').value) / 100;
    const secondarySplit = 1 - primarySplit;
    const monthsInvested = parseFloat(get('monthsInvested').value);

    results.push('Down payment of ' + formatNumber(downPaymentAmount));
    results.push('Loan Amount of ' + formatNumber(loanAmount));
    results.push('Home appreciates ' + appreciationRate);
    results.push('');


    // Down Payments
    const primaryDownPayment = housePrice * downPaymentRate * primarySplit;
    const secondaryDownPayment = housePrice * downPaymentRate * secondarySplit;
    const primaryDownPaymentAppreciationValue = primaryDownPayment * appreciationRate;
    const secondaryDownPaymentAppreciationValue = secondaryDownPayment * appreciationRate;
    results.push('Primary has a down payment of ' + formatNumber(primaryDownPayment) + ' which apprecaites to ' + formatNumber(primaryDownPaymentAppreciationValue));
    results.push('Secondary has a down payment of ' + formatNumber(secondaryDownPayment) + ' which apprecaites to ' + formatNumber(secondaryDownPaymentAppreciationValue));
    results.push('');


    // Payments in months invested
    const primaryMonthlyMortgage = monthlyMortgage * primarySplit;
    const secondaryMonthlyMortgage = monthlyMortgage * secondarySplit;
    const primaryMortgagePayments = primaryMonthlyMortgage * monthsInvested;
    const secondaryMortgagePayments = secondaryMonthlyMortgage * monthsInvested;
    results.push('Primarys monthly mortage payment is ' + formatNumber(primaryMonthlyMortgage) + ", for a total of " + formatNumber(primaryMortgagePayments) + ` in ${monthsInvested} months`);
    results.push('Secondarys monthly mortage payment is ' + formatNumber(secondaryMonthlyMortgage) + ", for a total of " + formatNumber(secondaryMortgagePayments) + ` in ${monthsInvested} months`);
    results.push('');
    results.push('<hr />');


    // Payments in months invested
    const primaryTotalPayments = primaryDownPayment + (primaryMortgagePayments);
    const secondaryTotalPayments = secondaryDownPayment + (secondaryMortgagePayments);
    const primaryLoanValue = loanAmount * (monthsInvested / mortgageDurationMonths) * primarySplit;
    const secondaryLoanValue = loanAmount * (monthsInvested / mortgageDurationMonths) * secondarySplit;
    const primaryLoanAppreciationValue = primaryLoanValue * appreciationRate;
    const secondaryLoanAppreciationValue = secondaryLoanValue * appreciationRate;
    const primaryTotalValue = primaryDownPaymentAppreciationValue + primaryLoanAppreciationValue;
    const secondaryTotalValue = secondaryDownPaymentAppreciationValue + secondaryLoanAppreciationValue;
    results.push(`Primary pays a total of (D.P. ${formatNumber(primaryDownPayment)} + Loan ${formatNumber(primaryMortgagePayments)}) ${boldNumber(primaryTotalPayments)}`);
    results.push('Primary Loan Investment ' + formatNumber(primaryLoanValue) + ' apprecaites to ' + formatNumber(primaryLoanAppreciationValue) + ' but paid ' + formatNumber(primaryMortgagePayments));
    results.push('Primary Total Value ' + boldNumber(primaryTotalValue));
    results.push('');

    results.push(`Secondary pays a total of (D.P. ${formatNumber(secondaryTotalPayments)} + Loan ${formatNumber(secondaryMortgagePayments)}) ${boldNumber(secondaryTotalPayments)}`);
    results.push('Secondary Loan Investment ' + formatNumber(secondaryLoanValue) + ' apprecaites to ' + formatNumber(secondaryLoanAppreciationValue) + ' but paid ' + formatNumber(secondaryMortgagePayments));
    results.push('Secondary Total Value ' + boldNumber(secondaryTotalValue));
    results.push('');

    get('houseSplitResults').innerHTML = results.join('<br/>');
}