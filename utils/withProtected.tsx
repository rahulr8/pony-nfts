import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

export function withProtected(Component: NextPage): React.FC<object> {
  return function ComponentWithAuthentication<T extends object>(
    props: React.PropsWithChildren<T>
  ) {
    const idToken = "placeholder";
    //   TODO: get token from localstorage
    // const { idToken } = useSelector(userAuthSelector) as LoggedInUser;
    const router = useRouter();

    useEffect((): void => {
      if (!idToken) {
        router.replace("/login");
      }
    }, [idToken, router]);

    return idToken ? <Component {...props} /> : <div />;
  };
}
