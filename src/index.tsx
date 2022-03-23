import { getChainOptions, WalletProvider } from '@terra-money/wallet-provider';
import ReactDOM from 'react-dom';
import Main from "./pages/Main";
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query';
import './style.css';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
    <ChakraProvider>
    <Main />
    </ChakraProvider>
    </QueryClientProvider>
  );
}

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <WalletProvider {...chainOptions}>
      <App />
    </WalletProvider>,
    document.getElementById('root'),
  );
});
