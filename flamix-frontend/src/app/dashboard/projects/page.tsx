import { FlipCardProject } from "@/components/animate-ui/components/community/flip-card";
import { EmptyProject } from "@/components/blocks/EmptyProject";
import ProjectCard from "@/components/cards/ProjectCard";
import { fetchAllProjects } from "@/utils/project";

export default async function Dashboard() {
  const projects = await fetchAllProjects();

  return (
    <div className="flex justify-center items-center h-fit flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2"></div>
      {projects.length == 0 ? <EmptyProject /> : null}

      {/* Conditional Rendering */}
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-3 w-full mt-4  gap-10 px-20">
          {projects.map((p) => (
            <div key={p._id} className=" duration-75">
              <ProjectCard
                key={p.projectName}
                projectName={p.projectName}
                href={`/dashboard/project/${p.projectName}`}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
