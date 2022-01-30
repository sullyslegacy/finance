const get = (id) => document.getElementById(id);

const formatNumber = (val) => Number(val).toLocaleString();
const boldNumber = (val) => '<b>' + Number(val).toLocaleString() + '</b>';

const calculateMonthlyInterestRate = () => {
    const apy = parseFloat(get('apy').value) / 100;
    const monthlyApy = Math.pow(apy + 1, 1/12);
    const result = (monthlyApy - 1) * 100;
    get('apyResults').innerHTML = result;
}