import { ApolloProvider } from '@apollo/client';
import { client } from './client';
const React = require('react');
const { ThemeProvider } = require('theme-ui');
const {deep} = require('@theme-ui/presets');

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={deep}><ApolloProvider client={client}>{element}</ApolloProvider></ThemeProvider>
);