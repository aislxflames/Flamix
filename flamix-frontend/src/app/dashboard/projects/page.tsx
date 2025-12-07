import { EmptyProject } from "@/components/blocks/EmptyProject";
import { createProject } from "@/utils/project";

export default function Dashbaoard() {
  console.log(process.env.NEXT_PUBLIC_BACKEND_API);

  return (
    <div className="flex justify-center items-center h-fit flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2"></div>
      <EmptyProject />
    </div>
  );
}
