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
                    to: '0xb9362ac0ab8325a5a3e976a0015251fb6921ad55',
                    data: '0xe6985b3c0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b6578616d706c652e636f6d000000000000000000000000000000000000000000',
                    value: '0x0a',
                    chainId: '5',
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
