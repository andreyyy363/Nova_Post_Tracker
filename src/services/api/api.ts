import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
  Post,
  NovaPoshtaRequest,
  SearchSettlementsProps,
  SearchSettlementsResponse,
  WarehouseProps,
  WarehouseResponse,
  TrackDocumentResponse,
  TrackDocumentProps,
} from './types';

const API_KEY = process.env.API_KEY || '';

interface TrackDocumentParams {
  documentNumber: string;
  phone?: string;
}

export const novaPostApi = createApi({
  reducerPath: 'novaPostApi',
  baseQuery: fetchBaseQuery({baseUrl: 'https://api.novaposhta.ua/v2.0/json/'}),
  endpoints: builder => ({
    getAllPosts: builder.query<Post[], void>({
      query: () => '/posts',
    }),

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
      query: ({cityRef}) => {
        console.log('Loading warehouses for city:', cityRef);
        return {
          url: '',
          method: 'POST',
          body: {
            apiKey: API_KEY,
            modelName: 'AddressGeneral',
            calledMethod: 'getWarehouses',
            methodProperties: {
              SettlementRef: cityRef,
              Language: 'UA',
            },
          } as NovaPoshtaRequest<WarehouseProps>,
        };
      },
      keepUnusedDataFor: 600,
    }),

    trackDocument: builder.mutation<
      TrackDocumentResponse,
      string | TrackDocumentParams
    >({
      query: params => {
        const isString = typeof params === 'string';
        const documentNumber = isString ? params : params.documentNumber;
        const phone = isString ? undefined : params.phone;

        const document: {DocumentNumber: string; Phone?: string} = {
          DocumentNumber: documentNumber,
        };

        if (phone) {
          document.Phone = phone;
        }

        return {
          url: '',
          method: 'POST',
          body: {
            apiKey: API_KEY,
            modelName: 'TrackingDocument',
            calledMethod: 'getStatusDocuments',
            methodProperties: {
              Documents: [document],
              GetFullInfo: true,
            },
          } as NovaPoshtaRequest<TrackDocumentProps>,
        };
      },
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useSearchCitiesMutation,
  useGetWarehousesQuery,
  useTrackDocumentMutation,
} = novaPostApi;
