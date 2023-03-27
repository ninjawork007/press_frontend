import Intercom from "../lib/intercom";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Example() {
  const { data: session } = useSession();

  return <></>;
}
