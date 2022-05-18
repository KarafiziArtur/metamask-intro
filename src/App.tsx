import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ethers } from 'ethers';

declare global {
    interface Window {
        ethereum?: any;
    }
}

const networks: any = {
    bsc: {
        chainId: `0x${Number(56).toString(16)}`,
        chainName: "Binance Smart Chain Mainnet",
        nativeCurrency: {
            name: "Binance Chain Native Token",
            symbol: "BNB",
            decimals: 18
        },
        rpcUrls: [
            "https://bsc-dataseed1.ninicoin.io",
            "https://bsc-dataseed2.ninicoin.io",
            "https://bsc-dataseed3.ninicoin.io",
            "https://bsc-dataseed4.ninicoin.io",
            "wss://bsc-ws-node.nariox.org"
        ],
        blockExplorerUrls: ["https://bscscan.com"]
    }
};

const changeNetwork = async ({ networkName }: any) => {
    try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    ...networks[networkName]
                }
            ]
        });
    } catch (err: any) {
        console.error(err.message);
    }
};

const App = () => {
    const [selectedAddress, setSelectedAddress] = useState(null);

    const connectToMetamask = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setSelectedAddress(accounts[0]);
    };

    const networkChanged = (chainId: any) => {
        console.log({ chainId });
    };

    const handleNetworkSwitch = async (networkName: any) => {
        await changeNetwork({ networkName });
    };

    const switchToBCS = () => {
        handleNetworkSwitch("bsc");
    };

    const renderMetamask = () => {
        if (!selectedAddress) {
            return (
                <Button color="inherit" onClick={connectToMetamask}>Connect to Metamask</Button>
            )
        } else {
            return (
                <>
                    <Box mr={4}><Button color="inherit" onClick={switchToBCS}>Switch to BSC</Button></Box>
                    <Typography>Welcome {selectedAddress}</Typography>
                </>
            );
        }
    }

    useEffect(() => {
        window.ethereum.on("chainChanged", networkChanged);

        return () => {
            window.ethereum.removeListener("chainChanged", networkChanged);
        };
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Metamask intro
                    </Typography>
                    {renderMetamask()}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default App;
