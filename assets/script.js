const ethereumButton = document.querySelector('.enableEthereumButton');
const sendEthButton = document.querySelector('.sendEthButton');

let accounts = [];

//Sending Ethereum to an address
sendEthButton.addEventListener('click', () => {
    window.ethereum
        .request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: accounts[0],
                    to: '0xa120af0949e46ad17aaa994a751b05c4dbc7652c',
                    data: '0xe6985b3c0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b6578616d706c652e636f6d000000000000000000000000000000000000000000',
                },
            ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
});

ethereumButton.addEventListener('click', () => {
    getAccount();
});

async function getAccount() {
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
}
