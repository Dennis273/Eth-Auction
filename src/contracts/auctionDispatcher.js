export const auctionDispatcherABI = [{
        "constant": true,
        "inputs": [{
            "name": "",
            "type": "uint256"
        }],
        "name": "auctions",
        "outputs": [{
            "name": "",
            "type": "address"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getNewId",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "newAuction",
        "outputs": [{
            "name": "",
            "type": "address"
        }],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getAuctions",
        "outputs": [{
            "name": "",
            "type": "address[]"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": false,
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "auctionAddress",
                "type": "address"
            }
        ],
        "name": "NewAuction",
        "type": "event"
    }
]