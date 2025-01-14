import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        const clerkToken = await window.Clerk.session?.getToken({
          template: "supabase",
        });

        const headers = new Headers(options?.headers);
        headers.set("Authorization", `Bearer ${clerkToken}`);

        return fetch(url, {
          ...options,
          headers,
        });
      },
    },
  });
}
// function getSupabase() {
//   return createClient(supabaseUrl, supabaseAnonKey, {
//     fetch:
//       typeof window === "undefined"
//         ? fetch
//         : async (url, options = {}) => {
//             const clerkToken = await window.Clerk.session?.getToken({
//               template: "supabase",
//             });

//             const headers = new Headers(options?.headers);
//             headers.set("Authorization", `Bearer ${clerkToken}`);

//             return fetch(url, {
//               ...options,
//               headers,
//             });
//           },
//   });
// }

const supabaseClient = getSupabase();

export default supabaseClient;
