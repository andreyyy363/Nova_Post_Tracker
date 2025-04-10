import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  Post,
  NovaPoshtaRequest,
  SearchSettlementsProps,
  SearchSettlementsResponse,
  WarehouseProps,
  WarehouseResponse,
} from './types';

const API_KEY = process.env.API_KEY || '';

export const novaPostApi = createApi({
  reducerPath: 'novaPostApi',
  baseQuery: fetchBaseQuery({baseUrl: 'https://api.novaposhta.ua/v2.0/json/'}),
  endpoints: builder => ({
    getAllPosts: builder.query<Post[], void>({
      query: () => '/posts',
    }),

    // Add search cities endpoint
    searchCities: builder.mutation<SearchSettlementsResponse, string>({
      query: cityName => ({
        url: '',
        method: 'POST',
        body: {
          apiKey: API_KEY,
          modelName: 'Address',
          calledMethod: 'searchSettlements',
          methodProperties: {
            CityName: cityName,
            Limit: 20,
          },
        } as NovaPoshtaRequest<SearchSettlementsProps>,
      }),
    }),

    getWarehouses: builder.query<
      WarehouseResponse,
      {cityRef: string; warehouseType?: string}
    >({
      query: ({cityRef, warehouseType}) => {
        console.log('Request parameters:', {cityRef, warehouseType});
        return {
          url: '',
          method: 'POST',
          body: {
            apiKey: API_KEY,
            modelName: 'AddressGeneral',
            calledMethod: 'getWarehouses',
            methodProperties: {
              SettlementRef: cityRef,
              TypeOfWarehouseRef: warehouseType,
              Language: 'UA',
            },
          } as NovaPoshtaRequest<WarehouseProps>,
        };
      },
      transformResponse: (response: WarehouseResponse) => {
        console.log('Raw API response:', JSON.stringify(response, null, 2));
        return response;
      },
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useSearchCitiesMutation,
  useGetWarehousesQuery,
} = novaPostApi;
