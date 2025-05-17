import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  PriceCalculationRequest, 
  PriceCalculationResponse,
  InternetDocumentProps
} from '../../types/calculator';

const API_KEY = 'ace91b0abee185831f799f25045d9436'; 

export const calculatorApi = createApi({
  reducerPath: 'calculatorApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://api.novaposhta.ua/v2.0/',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    calculateShippingPrice: builder.mutation<PriceCalculationResponse, InternetDocumentProps>({
      query: (methodProperties) => ({
        url: 'json/',
        method: 'POST',
        body: {
          apiKey: API_KEY,
          modelName: 'InternetDocument',
          calledMethod: 'getDocumentPrice',
          methodProperties,
        } as PriceCalculationRequest,
      }),
    }),
  }),
});

export const { useCalculateShippingPriceMutation } = calculatorApi;