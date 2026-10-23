import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getApiBaseUrl } from "@/lib/api-url";
import type { ConfigurationPayload, ConfigurationValidation } from "@/types/catalog";
import type { Order, OrderCreatePayload } from "@/types/order";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    calculatePrice: builder.mutation<ConfigurationValidation, ConfigurationPayload>({
      query: (body) => ({
        url: "/configurator/price",
        method: "POST",
        body,
      }),
    }),
    createOrder: builder.mutation<Order, OrderCreatePayload>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrder: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
  }),
});

export const { useCalculatePriceMutation, useCreateOrderMutation, useGetOrderQuery } = api;
