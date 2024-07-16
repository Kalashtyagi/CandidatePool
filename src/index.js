import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from 'react-query';
import "./tailwind.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000, // 5 minutes
    },
  },
});


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Toaster position="top-right" />
    <Provider store={store}>
      <BrowserRouter>
      <QueryClientProvider client={queryClient}>

        <App />
        </QueryClientProvider>


      </BrowserRouter>
    </Provider>
  </>
);
