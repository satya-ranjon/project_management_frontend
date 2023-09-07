import apiSlice from "../api/api";
import { updateHasMore, updatePage } from "./activateSlice";

const activateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllActivate: builder.query({
      query: () => `activates?page=1&perPage=10`,
      providesTags: ["getAllActivate"],

      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(updateHasMore(true));
          dispatch(updatePage(1));
        } catch (err) {}
      },
    }),
    getMoreActivate: builder.query({
      query: (page) => `activates?page=${page}&perPage=10`,
      // cachePolicy: "cacheNever",
      keepUnusedDataFor: 0,

      // provides: (results, error, args) => [
      //   { type: "data", id: customCacheKey() },
      // ],

      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        console.log("getMore");
        try {
          const { data } = await queryFulfilled;
          console.log("data", data);
          if (data?.length === 0) {
            dispatch(updateHasMore(false));
          }
          if (data?.length > 0) {
            dispatch(
              apiSlice.util.updateQueryData(
                "getAllActivate",
                undefined,
                (draft) => {
                  return [...draft, ...data];
                }
              )
            );
          }
        } catch (err) {}
      },
    }),
  }),
});

export const { useGetAllActivateQuery, useGetMoreActivateQuery } = activateApi;
export default activateApi;
