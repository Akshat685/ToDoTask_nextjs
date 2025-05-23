"use client";

import { ReactNode, useState } from "react";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { ApolloProvider } from "@apollo/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";

import ClientLayout from "@/components/layout/clientLayout";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import client from "@/graphql/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Todo List App</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <JotaiProvider>
          <ApolloProvider client={client}>
            <QueryClientProvider client={queryClient}>
              <Header />
              <ClientLayout>{children}</ClientLayout>
              <ToastContainer position="top-right" autoClose={2000} />
              <Footer />
            </QueryClientProvider>
          </ApolloProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
