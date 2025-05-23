import { useEffect, useState } from "react";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { getCookie, deleteCookie } from "@/utils/cookies";

const ME_QUERY = gql`
  query Me {
    me {
      id
      username
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

interface User {
  id: number;
  username: string;
  token?: string;
}

export const userAtom = atom<User | null>(null);

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data, error, loading } = useQuery(ME_QUERY, {
    skip: typeof window === "undefined" || !getCookie("token"),
    fetchPolicy: "network-only",
  });
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const token = getCookie("token");

    if (!token) {
      setUser(null);
      setIsLoading(false);
      router.push("/login");
      return;
    }

    if (loading) {
      return;
    }

    if (data?.me) {
      setUser({ ...data.me, token });
      setIsLoading(false);
    } else if (error) {
      console.error("Auth error:", error.message);
      deleteCookie("token");
      setUser(null);
      setIsLoading(false);
      router.push("/login");
    }
  }, [data, error, loading, setUser, router]);

  const logout = async () => {
    console.log("Initiating logout..."); // Debug log
    try {
      const { data, errors } = await logoutMutation();
      console.log("Logout mutation response:", { data, errors }); // Debug log
      if (errors) {
        throw new Error(errors[0].message);
      }
    } catch (err) {
      console.error("Logout mutation error:", err);
    }
    console.log("Clearing token and redirecting..."); // Debug log
    deleteCookie("token");
    setUser(null);
    setIsLoading(false);
    router.push("/login");
  };

  return { user, logout, isLoading };
}