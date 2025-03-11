import { FieldUpload } from "@/components/FileUp";
import { OverviewView } from "@/components/Map";
import { TransferList } from "@/components/TransferList";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* <OverviewView /> */}
      {/* <TransferList /> */}
      <FieldUpload/>
    </div>
  );
}
