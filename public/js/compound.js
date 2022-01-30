var startingAmount = 0;
var interestRate = 0;
var amountDeposited = 0;
var years = 0;

startingAmount = 120000;
interestRate = 1.08;
amountDeposited = 15000;
years = 22;

const getVal = (id) => parseFloat(get(id).value);
const addOutput = (message) => get('output').innerHTML += message + "</br>";

const calculate = (years) => {
	var total = startingAmount;
	for(var i = 0; i < years; i++){
		total = total *  interestRate;
		total += amountDeposited;
	}

	var totalAmountDeposited = amountDeposited * years;
	var intrestEarned = total - totalAmountDeposited - startingAmount;
	return {
		amountYouAdded: formatNumber(totalAmountDeposited + startingAmount),
		interestEarned: formatNumber(intrestEarned),
		total: boldNumber(total)
	};
	
}

const calculateAmount = () => {
	get('output').innerHTML = "";
	startingAmount = getVal('startingAmount');
	amountDeposited = getVal('amountDeposited');
	interestRate = getVal('interestRate');
	years = getVal('years');
	
	const values = calculate(years);
	addOutput('Amount you added = ' + values.amountYouAdded);
	addOutput("Interest Earned = " + values.interestEarned);
	addOutput("Total = " + values.total);

	createTableOutput();
}

const createTableOutput = () => {
	const value5 = calculate(5);
	const value10 = calculate(10);
	const value15 = calculate(15);
	const value20 = calculate(20);
	const value25 = calculate(25);
	const value30 = calculate(30);
const tableOutput = `
<table>
	<tr>
		<th>Category</th>	
		<th>5</th>
		<th>10</th>
		<th>15</th>
		<th>20</th>
		<th>25</th>
		<th>30</th>
	</tr>
	<tr>
		<td>Amount Added</td>	
		<td>${value5.amountYouAdded}</td>
		<td>${value10.amountYouAdded}</td>
		<td>${value15.amountYouAdded}</td>
		<td>${value20.amountYouAdded}</td>
		<td>${value25.amountYouAdded}</td>
		<td>${value30.amountYouAdded}</td>
	</tr>
	<tr>
		<td>Interest Earned</td>	
		<td>${value5.interestEarned}</td>
		<td>${value10.interestEarned}</td>
		<td>${value15.interestEarned}</td>
		<td>${value20.interestEarned}</td>
		<td>${value25.interestEarned}</td>
		<td>${value30.interestEarned}</td>
	</tr>
	<tr>
		<td>Total</td>	
		<td>${value5.total}</td>
		<td>${value10.total}</td>
		<td>${value15.total}</td>
		<td>${value20.total}</td>
		<td>${value25.total}</td>
		<td>${value30.total}</td>
	</tr>
</table>
`;
	get('tableOutput').innerHTML = tableOutput;
}

const createTableInterestOutput = () => {
	const powNum = (rate, years) => formatNumber(Math.pow(rate, years));

	const createTableRow = (rate) => {
		return `<tr>
	<td>${rate}</td>
	<td>${powNum(rate, 5)}</td>
	<td>${powNum(rate, 10)}</td>
	<td>${powNum(rate, 15)}</td>
	<td>${powNum(rate, 20)}</td>
	<td>${powNum(rate, 25)}</td>
	<td>${powNum(rate, 30)}</td>
	<td>${powNum(rate, 35)}</td>
	<td>${powNum(rate, 40)}</td>
</tr>`;
	}
	
const tableOutput = `
<table>
	<tr>
		<th>Interest</th>
		<th>5</th>
		<th>10</th>
		<th>15</th>
		<th>20</th>
		<th>25</th>
		<th>30</th>
		<th>35</th>
		<th>40</th>
	</tr>
	${createTableRow(1.02)}
	${createTableRow(1.04)}
	${createTableRow(1.06)}
	${createTableRow(1.08)}
	${createTableRow(1.10)}
	${createTableRow(1.12)}
	${createTableRow(1.14)}
	${createTableRow(1.16)}
</table>
`;
	get('tableOutput').innerHTML = tableOutput;
}
