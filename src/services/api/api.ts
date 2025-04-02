// Need to use the React-specific entry point to import createApi
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Post} from './types';

// Define a service using a base URL and expected endpoints
export const novaPostApi = createApi({
  reducerPath: 'novaPostApi',
  baseQuery: fetchBaseQuery({baseUrl: 'https://jsonplaceholder.typicode.com'}),
  endpoints: builder => ({
    getAllPosts: builder.query<Post[], void>({
      query: () => '/posts',
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useGetAllPostsQuery} = novaPostApi;
